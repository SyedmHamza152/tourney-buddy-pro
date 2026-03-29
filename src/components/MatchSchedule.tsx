import { useState } from 'react';
import { Match } from '@/lib/tournament';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarDays, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  matches: Match[];
  onResult: (matchId: string, score1: number, score2: number) => void;
}

export default function MatchSchedule({ matches, onResult }: Props) {
  const [editing, setEditing] = useState<string | null>(null);
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');

  const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
  const remaining = matches.filter(m => !m.played);
  const nextMatch = remaining[0];

  const submitResult = (id: string) => {
    const score1 = parseInt(s1);
    const score2 = parseInt(s2);
    if (!isNaN(score1) && !isNaN(score2) && score1 >= 0 && score2 >= 0) {
      onResult(id, score1, score2);
      setEditing(null);
      setS1('');
      setS2('');
    }
  };

  return (
    <div className="gradient-card rounded-xl border border-border p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display text-foreground flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" /> Matches
        </h2>
        <span className="text-sm text-muted-foreground">{remaining.length} remaining</span>
      </div>

      {nextMatch && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm text-foreground">
          <span className="text-primary font-semibold">Up Next:</span> {nextMatch.team1} vs {nextMatch.team2}
        </div>
      )}

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {rounds.map(r => (
          <div key={r}>
            <h3 className="text-sm font-display text-muted-foreground mb-2">Round {r}</h3>
            <div className="space-y-2">
              {matches.filter(m => m.round === r).map(m => (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    m.played
                      ? 'bg-muted/50 border-border'
                      : m.id === nextMatch?.id
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-muted border-border'
                  }`}
                >
                  {m.played ? (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  {m.bracket && (
                    <span className="text-[10px] font-display px-1.5 py-0.5 rounded bg-secondary text-muted-foreground uppercase">
                      {m.bracket}
                    </span>
                  )}
                  <span className="font-medium text-foreground text-sm flex-1">{m.team1}</span>
                  {m.played ? (
                    <span className="font-display text-foreground text-lg tabular-nums">
                      {m.score1} - {m.score2}
                    </span>
                  ) : editing === m.id ? (
                    <div className="flex items-center gap-1">
                      <Input value={s1} onChange={e => setS1(e.target.value)} className="w-12 h-8 text-center bg-secondary border-border text-foreground" />
                      <span className="text-muted-foreground">-</span>
                      <Input value={s2} onChange={e => setS2(e.target.value)} className="w-12 h-8 text-center bg-secondary border-border text-foreground" />
                      <Button size="sm" onClick={() => submitResult(m.id)} className="gradient-primary text-primary-foreground h-8 text-xs">Save</Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">vs</span>
                  )}
                  <span className="font-medium text-foreground text-sm flex-1 text-right">{m.team2}</span>
                  {!m.played && editing !== m.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditing(m.id); setS1(''); setS2(''); }}
                      className="h-7 text-xs border-border text-muted-foreground hover:text-foreground hover:border-primary"
                    >
                      Score
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
