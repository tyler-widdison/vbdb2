export interface LiveMatch {
  set_1_team_1: string | null;
  set_1_team_2: string | null;
  set_2_team_1: string | null;
  set_2_team_2: string | null;
  set_3_team_1: string | null;
  set_3_team_2: string | null;
  set_4_team_1: string | null;
  set_4_team_2: string | null;
  set_5_team_1: string | null;
  set_5_team_2: string | null;
  location: string | null;
  live_stats_url: string;
  team_1_id: string;
  team_2_id: string;
  team_1_name: string;
  team_2_name: string;
  team_1_division: string;
  team_1_conference: string;
  team_2_division: string;
  team_2_conference: string;
  team_1_logo: string;
  team_2_logo: string;
  date: string;
  time: string;
}

export const useLive = () => {
  const {
    data: matches,
    error,
    refresh,
  } = useFetch<LiveMatch[]>("https://api.volleyballdatabased.com/live", {
    key: "live-matches",
    lazy: true,
  });

  const fetchLiveMatches = async (): Promise<LiveMatch[]> => {
    if (!matches.value) {
      await refresh();
    }

    if (error.value) {
      console.error("Failed to fetch live matches:", error.value);
      return [];
    }

    return matches.value || [];
  };

  const getMatchStatus = (
    match: LiveMatch
  ): "live" | "completed" | "upcoming" => {
    let setsPlayed = 0;
    let team1Wins = 0;
    let team2Wins = 0;

    for (let i = 1; i <= 5; i++) {
      const team1Score = match[`set_${i}_team_1` as keyof LiveMatch];
      const team2Score = match[`set_${i}_team_2` as keyof LiveMatch];

      if (team1Score !== null && team2Score !== null) {
        setsPlayed++;
        const score1 = parseInt(team1Score as string);
        const score2 = parseInt(team2Score as string);
        if (score1 > score2) team1Wins++;
        if (score2 > score1) team2Wins++;
      }
    }

    if (setsPlayed === 0) return "upcoming";
    if (team1Wins >= 3 || team2Wins >= 3) return "completed";
    return "live";
  };

  const filterMatches = (
    divisions: string[],
    conferences: string[],
    teamIds: string[],
    statusFilters: { live: boolean; completed: boolean; upcoming: boolean }
  ): LiveMatch[] => {
    if (!matches.value) return [];

    let filtered = matches.value;

    if (divisions && divisions.length > 0) {
      filtered = filtered.filter(
        (match) =>
          divisions.includes(match.team_1_division) ||
          divisions.includes(match.team_2_division)
      );
    }

    if (conferences && conferences.length > 0) {
      filtered = filtered.filter(
        (match) =>
          conferences.includes(match.team_1_conference) ||
          conferences.includes(match.team_2_conference)
      );
    }

    if (teamIds && teamIds.length > 0) {
      filtered = filtered.filter(
        (match) =>
          teamIds.includes(match.team_1_id) || teamIds.includes(match.team_2_id)
      );
    }

    filtered = filtered.filter((match) => {
      const status = getMatchStatus(match);
      return statusFilters[status];
    });

    return filtered;
  };

  return {
    matches: readonly(matches),
    fetchLiveMatches,
    getMatchStatus,
    filterMatches,
    refresh,
  };
};
