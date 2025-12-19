'use client';
import { useState } from 'react';
import LiveMatchSetup from './LiveMatchSetup';
import LiveGoalTracker from './LiveGoalTracker';
import LiveMatchSummary from './LiveMatchSummary';

export default function LiveMatchFlow({ players }: any) {
    const [phase, setPhase] = useState<'setup' | 'tracking' | 'summary'>('setup');
    const [teams, setTeams] = useState<any>(null);
    const [goals, setGoals] = useState<any>(null);

    return (
        <div className="max-w-lg mx-auto">
            {phase === 'setup' && (
                <LiveMatchSetup players={players} onStart={(t) => { setTeams(t); setPhase('tracking'); }} />
            )}
            {phase === 'tracking' && (
                <LiveGoalTracker {...teams} onFinish={(g: any) => { setGoals(g); setPhase('summary'); }} />
            )}
            {phase === 'summary' && (
                <LiveMatchSummary {...teams} goals={goals} onDone={() => setPhase('setup')} />
            )}
        </div>
    );
}
