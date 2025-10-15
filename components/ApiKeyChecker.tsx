import React from 'react';
import { Mascot } from './Mascot.tsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.tsx';

interface ApiKeyCheckerProps {
  children: React.ReactNode;
}

const ApiKeyChecker: React.FC<ApiKeyCheckerProps> = ({ children }) => {
  // FIX: Use `process.env.API_KEY` to align with the coding guidelines and resolve the TypeScript error with `import.meta.env`.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-rose-50 p-4">
        <Card className="max-w-lg w-full text-center shadow-2xl border-red-300">
          <CardHeader>
            <Mascot className="w-24 h-24 mx-auto" />
            <CardTitle className="text-2xl text-red-800 mt-4">Configuration Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">
              This application cannot connect to Google's AI services because the required API key is missing.
            </p>
            <div className="p-4 bg-slate-100 rounded-lg text-left">
              <h4 className="font-semibold text-slate-800">For the Site Owner:</h4>
              <p className="mt-2 text-sm text-slate-600">
                To resolve this, you need to add an environment variable to your website's hosting platform (e.g., Vercel, Netlify, etc.).
              </p>
              <p className="mt-3 text-sm">
                Please add the following variable:
              </p>
              <pre className="mt-1 p-2 bg-slate-200 text-slate-900 rounded-md text-xs">
                {/* FIX: Updated variable name to API_KEY to match usage. */}
                <code>API_KEY="your_actual_gemini_api_key"</code>
              </pre>
               <p className="mt-3 text-xs text-slate-500">
                After adding the key, you may need to redeploy your site for the change to take effect.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApiKeyChecker;