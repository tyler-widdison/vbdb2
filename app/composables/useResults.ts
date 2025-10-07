export interface ResultMatch {
  set_1_team_1: number | null;
  set_1_team_2: number | null;
  set_2_team_1: number | null;
  set_2_team_2: number | null;
  set_3_team_1: number | null;
  set_3_team_2: number | null;
  set_4_team_1: number | null;
  set_4_team_2: number | null;
  set_5_team_1: number | null;
  set_5_team_2: number | null;
  location: string | null;
  live_stats_url: string | null;
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
  match_id: string;
  box_score: string | null;
  winner_id: string;
  time: string;
  team_1_rank: number | null;
  team_2_rank: number | null;
}

export const useResults = (division: Ref<string> = ref('D-I')) => {
  const url = computed(() => `https://api.volleyballdatabased.com/results?division=${division.value}`);
  
  const {
    data: results,
    error,
    refresh,
    status,
  } = useFetch<ResultMatch[]>(url, {
    key: computed(() => `results-data-${division.value}`),
    lazy: true,
    server: true,
    dedupe: "defer",
    deep: false,
    getCachedData(key) {
      return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
    },
    watch: [division],
  });

  const fetchResults = async (): Promise<ResultMatch[]> => {
    if (!results.value) {
      await refresh();
    }

    if (error.value) {
      console.error("Failed to fetch results:", error.value);
      return [];
    }

    return results.value || [];
  };

  const filterResults = (
    divisions: string[],
    conferences: string[],
    teamIds: string[]
  ): ResultMatch[] => {
    if (!results.value) return [];

    let filtered = results.value;

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

    return filtered;
  };

  const getResultsByDate = (dateString: string): ResultMatch[] => {
    if (!results.value) return [];
    return results.value.filter((match) => match.date === dateString);
  };

  const getResultsByTeam = (teamId: string): ResultMatch[] => {
    if (!results.value) return [];
    return results.value.filter(
      (match) => match.team_1_id === teamId || match.team_2_id === teamId
    );
  };

  return {
    results: readonly(results),
    fetchResults,
    filterResults,
    getResultsByDate,
    getResultsByTeam,
    refresh,
    status,
  };
};
