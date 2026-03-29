import { Team } from '@/lib/tournament';
import { Shield } from 'lucide-react';

const teamColors = [
  'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30',
  'from-blue-500/20 to-blue-900/10 border-blue-500/30',
  'from-amber-500/20 to-amber-900/10 border-amber-500/30',
  'from-rose-500/20 to-rose-900/10 border-rose-500/30',
  'from-violet-500/20 to-violet-900/10 border-violet-500/30',
  'from-cyan-500/20 to-cyan-900/10 border-cyan-500/30',
  'from-orange-500/20 to-orange-900/10 border-orange-500/30',
  'from-pink-500/20 to-pink-900/10 border-pink-500/30',
];

export default function TeamDisplay({ teams }: { teams: Team[] }) {
  return (
    <div className="gradient-card rounded-xl border border-border p-6 shadow-card space-y-4">
      <h2 className="text-2xl font-display text-foreground flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" /> Teams
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {teams.map((t, i) => (
          <div key={t.name} className={`bg-gradient-to-br ${teamColors[i % teamColors.length]} border rounded-lg p-4`}>
            <h3 className="font-display text-lg text-foreground mb-2">{t.name}</h3>
            <ul className="space-y-1">
              {t.players.map(p => (
                <li key={p} className="text-sm text-secondary-foreground">• {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
