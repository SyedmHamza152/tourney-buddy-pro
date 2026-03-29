import { useState } from 'react';
import PlayerInput from '@/components/PlayerInput';
import FormatSelector from '@/components/FormatSelector';
import TeamDisplay from '@/components/TeamDisplay';
import MatchSchedule from '@/components/MatchSchedule';
import StandingsTable from '@/components/StandingsTable';
import { Team, Match, TournamentFormat, assignTeams, generateFixtures, updateStandings } from '@/lib/tournament';
import { Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Step = 'players' | 'format' | 'tournament';

export default function Index() {
  const [step, setStep] = useState<Step>('players');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [format, setFormat] = useState<TournamentFormat>('round-robin');

  const handlePlayers = (players: string[], numTeams: number) => {
    setTeams(assignTeams(players, numTeams));
    setStep('format');
  };

  const handleFormat = (f: TournamentFormat) => {
    setFormat(f);
    const fixtures = generateFixtures(teams, f);
    setMatches(fixtures);
    setStep('tournament');
  };

  const handleResult = (matchId: string, score1: number, score2: number) => {
    const updated = matches.map(m =>
      m.id === matchId ? { ...m, score1, score2, played: true } : m
    );
    setMatches(updated);
    setTeams(updateStandings(teams, updated, format));
  };

  const reset = () => {
    setStep('players');
    setTeams([]);
    setMatches([]);
  };

  const allPlayed = matches.length > 0 && matches.every(m => m.played);
  const champion = allPlayed && teams.length > 0 ? teams[0] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg shadow-glow">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display text-foreground tracking-wider">
              Tournament<span className="text-primary">Hub</span>
            </h1>
          </div>
          {step !== 'players' && (
            <Button variant="ghost" onClick={reset} className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-4 h-4 mr-2" /> New Tournament
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Champion banner */}
        {champion && (
          <div className="gradient-primary rounded-xl p-6 text-center shadow-glow animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="font-display text-primary-foreground text-sm tracking-widest mb-1">🏆 Champion</p>
            <h2 className="font-display text-3xl text-primary-foreground">{champion.name}</h2>
            <p className="text-primary-foreground/80 text-sm mt-1">{champion.wins}W {champion.draws}D {champion.losses}L — {champion.points} pts</p>
          </div>
        )}

        {step === 'players' && <PlayerInput onSubmit={handlePlayers} />}

        {step === 'format' && (
          <>
            <TeamDisplay teams={teams} />
            <FormatSelector onSelect={handleFormat} />
          </>
        )}

        {step === 'tournament' && (
          <>
            <TeamDisplay teams={teams} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MatchSchedule matches={matches} onResult={handleResult} />
              </div>
              <div>
                <StandingsTable teams={teams} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
