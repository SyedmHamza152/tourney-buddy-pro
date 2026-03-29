import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, X, Shuffle } from 'lucide-react';

interface Props {
  onSubmit: (players: string[], numTeams: number) => void;
}

export default function PlayerInput({ onSubmit }: Props) {
  const [players, setPlayers] = useState<string[]>(['']);
  const [numTeams, setNumTeams] = useState(2);

  const addPlayer = () => setPlayers([...players, '']);
  const removePlayer = (i: number) => setPlayers(players.filter((_, idx) => idx !== i));
  const updatePlayer = (i: number, v: string) => {
    const p = [...players];
    p[i] = v;
    setPlayers(p);
  };

  const validPlayers = players.filter(p => p.trim());
  const canSubmit = validPlayers.length >= numTeams * 2 && numTeams >= 2;

  return (
    <div className="gradient-card rounded-xl border border-border p-6 shadow-card space-y-6">
      <div className="flex items-center gap-3">
        <div className="gradient-primary p-2.5 rounded-lg">
          <Users className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-display text-foreground">Add Players</h2>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {players.map((p, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder={`Player ${i + 1}`}
              value={p}
              onChange={e => updatePlayer(i, e.target.value)}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              onKeyDown={e => { if (e.key === 'Enter') addPlayer(); }}
            />
            {players.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removePlayer(i)} className="text-muted-foreground hover:text-destructive shrink-0">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addPlayer} className="w-full border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary">
        <Plus className="w-4 h-4 mr-2" /> Add Player
      </Button>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Number of Teams</label>
        <Input
          type="number"
          min={2}
          max={Math.floor(validPlayers.length / 2) || 2}
          value={numTeams}
          onChange={e => setNumTeams(parseInt(e.target.value) || 2)}
          className="bg-muted border-border text-foreground w-24"
        />
      </div>

      <Button
        onClick={() => onSubmit(validPlayers, numTeams)}
        disabled={!canSubmit}
        className="w-full gradient-primary text-primary-foreground font-display text-lg tracking-wider hover:opacity-90 disabled:opacity-40 h-12"
      >
        <Shuffle className="w-5 h-5 mr-2" /> Generate Teams
      </Button>
      {!canSubmit && validPlayers.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">Need at least {numTeams * 2} players for {numTeams} teams</p>
      )}
    </div>
  );
}
