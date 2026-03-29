import { TournamentFormat } from '@/lib/tournament';
import { Trophy, GitBranch, Repeat, Table } from 'lucide-react';

interface Props {
  onSelect: (format: TournamentFormat) => void;
}

const formats: { format: TournamentFormat; label: string; desc: string; icon: React.ElementType }[] = [
  { format: 'round-robin', label: 'Round Robin', desc: 'Every team plays every other team once', icon: Repeat },
  { format: 'double-round-robin', label: 'Double Round Robin', desc: 'Every team plays every other team twice (home & away)', icon: Repeat },
  { format: 'single-elimination', label: 'Single Elimination', desc: 'Lose once and you\'re out', icon: GitBranch },
  { format: 'double-elimination', label: 'Double Elimination', desc: 'Two losses to be eliminated', icon: Trophy },
  { format: 'league', label: 'League', desc: 'Home & away with points table', icon: Table },
];

export default function FormatSelector({ onSelect }: Props) {
  return (
    <div className="gradient-card rounded-xl border border-border p-6 shadow-card space-y-4">
      <h2 className="text-2xl font-display text-foreground">Choose Format</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {formats.map(f => (
          <button
            key={f.format}
            onClick={() => onSelect(f.format)}
            className="group flex items-start gap-3 p-4 rounded-lg bg-muted border border-border hover:border-primary hover:shadow-glow transition-all text-left"
          >
            <div className="p-2 rounded-md bg-secondary group-hover:gradient-primary transition-all">
              <f.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-foreground text-lg">{f.label}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
