export interface ScheduleMatch {
  date: string;
  box_score: string | null;
  division: string;
  title: string;
  match_id: string;
  team_1: string;
  team_2: string;
  team_1_id: string | null;
  team_1_logo: string | null;
  team_1_conference: string | null;
  team_1_division: string | null;
  team_1_name: string;
  team_2_id: string | null;
  team_2_logo: string | null;
  team_2_conference: string | null;
  team_2_division: string | null;
  team_2_name: string;
  time: string | null;
}

export const useSchedule = () => {
  const {
    data: schedule,
    error,
    refresh,
    status,
  } = useFetch<ScheduleMatch[]>("https://api.volleyballdatabased.com/schedule", {
    key: "schedule-data",
    lazy: true,
    server: true,
    dedupe: "defer",
    deep: false,
    getCachedData(key) {
      return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
    },
  });

  const fetchSchedule = async (): Promise<ScheduleMatch[]> => {
    if (!schedule.value) {
      await refresh();
    }

    if (error.value) {
      console.error("Failed to fetch schedule:", error.value);
      return [];
    }

    return schedule.value || [];
  };

  const filterSchedule = (
    divisions: string[],
    conferences: string[],
    teamIds: string[]
  ): ScheduleMatch[] => {
    if (!schedule.value) return [];

    let filtered = schedule.value;

    if (divisions && divisions.length > 0) {
      filtered = filtered.filter(
        (match) =>
          (match.team_1_division && divisions.includes(match.team_1_division)) ||
          (match.team_2_division && divisions.includes(match.team_2_division))
      );
    }

    if (conferences && conferences.length > 0) {
      filtered = filtered.filter(
        (match) =>
          (match.team_1_conference && conferences.includes(match.team_1_conference)) ||
          (match.team_2_conference && conferences.includes(match.team_2_conference))
      );
    }

    if (teamIds && teamIds.length > 0) {
      filtered = filtered.filter(
        (match) =>
          (match.team_1_id && teamIds.includes(match.team_1_id)) ||
          (match.team_2_id && teamIds.includes(match.team_2_id))
      );
    }

    return filtered;
  };

  const getScheduleByDate = (dateString: string): ScheduleMatch[] => {
    if (!schedule.value) return [];
    return schedule.value.filter((match) => match.date.startsWith(dateString));
  };

  const getScheduleByTeam = (teamId: string): ScheduleMatch[] => {
    if (!schedule.value) return [];
    return schedule.value.filter(
      (match) => match.team_1_id === teamId || match.team_2_id === teamId
    );
  };

  return {
    schedule: readonly(schedule),
    fetchSchedule,
    filterSchedule,
    getScheduleByDate,
    getScheduleByTeam,
    refresh,
    status,
  };
};
