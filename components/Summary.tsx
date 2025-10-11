
import React, { useState } from 'react';
import { Model, ActivityState, Domain } from '../../types.ts';
import { buildTextSummary, emailResults, overallStatus, domainStatus, nextStepsForDomain } from '../../lib/utils.ts';
import { Button } from './ui/Button.tsx';
import { Textarea } from './ui/Textarea.tsx';
import { Label } from './ui/Label.tsx';
import { Download, Mail, Printer, ArrowLeft, Award } from 'lucide-react';

interface SummaryProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
  setView: (view: 'assessment' | 'summary') => void;
  domains: Domain[];
}

export const Summary: React.FC<SummaryProps> = ({ model, setModel, setView, domains }) => {
  const [summaryText, setSummaryText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const domainActivityIds = new Set(domains.flatMap(d => d.activities).map(a => a.id));
  // FIX: Explicitly cast Object.values to ActivityState[] to resolve type inference issues.
  const earnedStickers = (Object.values(model.activity) as ActivityState[])
      .filter(a => a.sticker && domainActivityIds.has(a.id))
      .map((a) => a.sticker);


  React.useEffect(() => {
    setSummaryText(buildTextSummary(model, domains));
  }, [model, domains]);

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sophia-Playcheck-${model.learner.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printable = window.open('', '_blank');
    printable?.document.write(`<html><head><title>Playcheck Summary</title><style>body{font-family:monospace;white-space:pre-wrap;}</style></head><body>${summaryText.replace(/\n/g, '<br/>')}</body></html>`);
    printable?.document.close();
    printable?.focus();
    printable?.print();
  };

  const handleEmail = async () => {
    const recipient = "merriweatherlac@gmail.com";
    if (confirm(`Are you sure you want to email the summary for ${model.learner.name} to ${recipient}?`)) {
        setIsSending(true);
        const result = await emailResults(model, domains);
        if (result.ok) {
            alert("Email sent successfully!");
        } else {
            alert("There was an error sending the email. Please try again.");
        }
        setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="p-6 text-center bg-yellow-100 border-4 border-yellow-300 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-900">Hey girl, you did so good!</h2>
            <p className="mt-2 text-yellow-800">Look at all the stickers you earned for this assessment!</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
                {earnedStickers.length > 0 ? (
                    earnedStickers.map((sticker, index) => (
                        <span key={index} className="text-4xl animate-bounce" style={{ animationDelay: `${index * 50}ms` }}>{sticker}</span>
                    ))
                ) : (
                    <p className="text-sm text-yellow-700">(No stickers earned this time, but you still did great!)</p>
                )}
            </div>
       </div>

      <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/80 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Summary & Next Steps</h2>
          <Button variant="outline" onClick={() => setView('assessment')}>
            <ArrowLeft className="h-4 w-4 mr-2"/> Back to Assessment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map(d => (
              <div key={d.key} className="p-4 rounded-lg border bg-gradient-to-br from-white to-slate-50">
                  <h3 className="font-semibold text-slate-700">{d.label}</h3>
                  <p className="text-sm font-bold text-slate-900 mt-1">{domainStatus(model, d)}</p>
                  <ul className="mt-2 text-xs text-slate-600 list-disc list-inside space-y-1">
                      {nextStepsForDomain(d.key).slice(0, 2).map(step => <li key={step}>{step}</li>)}
                  </ul>
              </div>
          ))}
        </div>
        
        <div className='p-4 rounded-lg bg-slate-800 text-white flex items-center gap-3'>
          <Award className="h-6 w-6"/>
          <h3 className="font-semibold text-lg">{overallStatus(model, domains)}</h3>
        </div>

        <div>
          <Label htmlFor="overallNotes">Overall Notes & Reflections</Label>
          <Textarea
            id="overallNotes"
            className="mt-2"
            placeholder="Any final thoughts, big wins, or things to keep an eye on..."
            value={model.overallNotes}
            onChange={e => setModel(prev => ({...prev, overallNotes: e.target.value}))}
          />
        </div>

        <div>
          <Label htmlFor="summaryPreview">Text Summary Preview</Label>
          <Textarea
            id="summaryPreview"
            readOnly
            value={summaryText}
            className="mt-2 font-mono text-xs h-64 bg-slate-50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={handleDownload}><Download className="h-4 w-4 mr-2" /> Download .txt</Button>
          <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print</Button>
          <Button onClick={handleEmail} disabled={isSending}><Mail className="h-4 w-4 mr-2" /> {isSending ? 'Sending...' : 'Email Summary'}</Button>
        </div>
      </div>
    </div>
  );
};