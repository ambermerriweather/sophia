import React from 'react';
import { Grade } from '../../types.ts';
import { Button } from './ui/Button.tsx';
import { Label } from './ui/Label.tsx';

interface GradeSelectorProps {
    selectedGrade: Grade | 'All';
    setSelectedGrade: (grade: Grade | 'All') => void;
}

const grades: { key: Grade | 'All', label: string }[] = [
    { key: 'K', label: 'Kindergarten' },
    { key: '1', label: '1st Grade' },
    { key: '2', label: '2nd Grade' },
    { key: 'All', label: 'Show All' },
];

export const GradeSelector: React.FC<GradeSelectorProps> = ({ selectedGrade, setSelectedGrade }) => {
    return (
        <div className="text-center">
            <Label className="font-semibold text-slate-700">Which grade level are you assessing today?</Label>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
                {grades.map(({ key, label }) => (
                    <Button
                        key={key}
                        variant={selectedGrade === key ? 'default' : 'outline'}
                        onClick={() => setSelectedGrade(key)}
                        className={`transition-all ${selectedGrade === key ? 'ring-2 ring-slate-900 ring-offset-2' : ''}`}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    )
}