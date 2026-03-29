import { Team } from '@/lib/tournament';
import { Medal } from 'lucide-react';

export default function StandingsTable({ teams }: { teams: Team[] }) {
  return (
    <div className="gradient-card rounded-xl border border-border p-6 shadow-card space-y-4">
      <h2 className="text-2xl font-display text-foreground flex items-center gap-2">
        <Medal className="w-6 h-6 text-accent" /> Standings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-display">
              <th className="text-left py-2 pr-4">#</th>
              <th className="text-left py-2 pr-4">Team</th>
              <th className="text-center py-2 px-2">P</th>
              <th className="text-center py-2 px-2">W</th>
              <th className="text-center py-2 px-2">D</th>
              <th className="text-center py-2 px-2">L</th>
              <th className="text-center py-2 px-2 text-primary font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={t.name} className={`border-b border-border/50 ${i === 0 && t.points > 0 ? 'bg-primary/5' : ''}`}>
                <td className="py-2.5 pr-4 font-display text-muted-foreground">{i + 1}</td>
                <td className="py-2.5 pr-4 font-medium text-foreground">{t.name}</td>
                <td className="py-2.5 px-2 text-center text-secondary-foreground">{t.matchesPlayed}</td>
                <td className="py-2.5 px-2 text-center text-primary">{t.wins}</td>
                <td className="py-2.5 px-2 text-center text-secondary-foreground">{t.draws}</td>
                <td className="py-2.5 px-2 text-center text-destructive">{t.losses}</td>
                <td className="py-2.5 px-2 text-center font-display text-lg text-primary">{t.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
