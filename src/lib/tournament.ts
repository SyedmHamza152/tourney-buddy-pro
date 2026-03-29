export type TournamentFormat = 'round-robin' | 'double-round-robin' | 'single-elimination' | 'double-elimination' | 'league';

export interface Team {
  name: string;
  players: string[];
  wins: number;
  losses: number;
  draws: number;
  points: number;
  matchesPlayed: number;
}

export interface Match {
  id: string;
  round: number;
  team1: string;
  team2: string;
  score1: number | null;
  score2: number | null;
  played: boolean;
  bracket?: 'winners' | 'losers' | 'final';
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function assignTeams(players: string[], numTeams: number): Team[] {
  const shuffled = shuffleArray(players);
  const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
    name: `Team ${String.fromCharCode(65 + i)}`,
    players: [],
    wins: 0, losses: 0, draws: 0, points: 0, matchesPlayed: 0,
  }));
  shuffled.forEach((p, i) => teams[i % numTeams].players.push(p));
  return teams;
}

let matchCounter = 0;
function makeMatch(round: number, t1: string, t2: string, bracket?: Match['bracket']): Match {
  return { id: `m${++matchCounter}`, round, team1: t1, team2: t2, score1: null, score2: null, played: false, bracket };
}

export function generateRoundRobin(teams: Team[]): Match[] {
  matchCounter = 0;
  const names = teams.map(t => t.name);
  const n = names.length;
  const list = [...names];
  if (n % 2 !== 0) list.push('BYE');
  const totalRounds = list.length - 1;
  const matches: Match[] = [];
  for (let r = 0; r < totalRounds; r++) {
    for (let i = 0; i < list.length / 2; i++) {
      const t1 = list[i];
      const t2 = list[list.length - 1 - i];
      if (t1 !== 'BYE' && t2 !== 'BYE') {
        matches.push(makeMatch(r + 1, t1, t2));
      }
    }
    list.splice(1, 0, list.pop()!);
  }
  return matches;
}

export function generateSingleElimination(teams: Team[]): Match[] {
  matchCounter = 0;
  const names = shuffleArray(teams.map(t => t.name));
  let size = 1;
  while (size < names.length) size *= 2;
  while (names.length < size) names.push('BYE');
  const matches: Match[] = [];
  let round = 1;
  let currentRound = names;
  while (currentRound.length > 1) {
    const nextRound: string[] = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      const t1 = currentRound[i];
      const t2 = currentRound[i + 1];
      if (t2 === 'BYE') {
        nextRound.push(t1);
      } else if (t1 === 'BYE') {
        nextRound.push(t2);
      } else {
        matches.push(makeMatch(round, t1, t2));
        nextRound.push(`Winner of ${matches[matches.length - 1].id}`);
      }
    }
    currentRound = nextRound;
    round++;
  }
  return matches;
}

export function generateDoubleElimination(teams: Team[]): Match[] {
  matchCounter = 0;
  const names = shuffleArray(teams.map(t => t.name));
  const matches: Match[] = [];
  // Winners bracket round 1
  for (let i = 0; i < names.length; i += 2) {
    if (i + 1 < names.length) {
      matches.push(makeMatch(1, names[i], names[i + 1], 'winners'));
    }
  }
  // Simplified: generate placeholder rounds
  const wbRounds = Math.ceil(Math.log2(names.length));
  for (let r = 2; r <= wbRounds; r++) {
    const prevWinners = matches.filter(m => m.bracket === 'winners' && m.round === r - 1);
    for (let i = 0; i < prevWinners.length; i += 2) {
      if (i + 1 < prevWinners.length) {
        matches.push(makeMatch(r, `W-${prevWinners[i].id}`, `W-${prevWinners[i + 1].id}`, 'winners'));
      }
    }
  }
  // Losers bracket
  const lbMatches = Math.max(1, Math.floor(names.length / 2) - 1);
  for (let i = 0; i < lbMatches; i++) {
    matches.push(makeMatch(i + 1, `Loser TBD`, `Loser TBD`, 'losers'));
  }
  // Grand final
  matches.push(makeMatch(wbRounds + 1, 'WB Champion', 'LB Champion', 'final'));
  return matches;
}

export function generateLeague(teams: Team[]): Match[] {
  // Same as round robin but with home/away
  const rr = generateRoundRobin(teams);
  const reverse = rr.map(m => makeMatch(m.round + Math.ceil(rr.length / teams.length), m.team2, m.team1));
  return [...rr, ...reverse];
}

export function generateFixtures(teams: Team[], format: TournamentFormat): Match[] {
  switch (format) {
    case 'round-robin': return generateRoundRobin(teams);
    case 'single-elimination': return generateSingleElimination(teams);
    case 'double-elimination': return generateDoubleElimination(teams);
    case 'league': return generateLeague(teams);
  }
}

export function updateStandings(teams: Team[], matches: Match[], format: TournamentFormat): Team[] {
  const updated = teams.map(t => ({ ...t, wins: 0, losses: 0, draws: 0, points: 0, matchesPlayed: 0 }));
  const teamMap = new Map(updated.map(t => [t.name, t]));
  const winPts = format === 'league' ? 3 : 2;
  const drawPts = 1;

  matches.filter(m => m.played).forEach(m => {
    const t1 = teamMap.get(m.team1);
    const t2 = teamMap.get(m.team2);
    if (!t1 || !t2) return;
    t1.matchesPlayed++;
    t2.matchesPlayed++;
    if (m.score1! > m.score2!) {
      t1.wins++; t2.losses++;
      t1.points += winPts;
    } else if (m.score1! < m.score2!) {
      t2.wins++; t1.losses++;
      t2.points += winPts;
    } else {
      t1.draws++; t2.draws++;
      t1.points += drawPts; t2.points += drawPts;
    }
  });

  return updated.sort((a, b) => b.points - a.points || b.wins - a.wins);
}
