export interface Team {
  team_id: string
  short_name: string
  name: string
  division: string
  conference: string
  logo: string
  avca_ranking: string | null
}

export const useTeams = (division: Ref<string> = ref('D-I')) => {
  const url = computed(() => `https://api.volleyballdatabased.com/teams?division=${division.value}`);
  
  const { data: teams, error, refresh, status } = useFetch<Team[]>(url, {
    key: computed(() => `teams-data-${division.value}`),
    lazy: true,
    server: true,
    dedupe: 'defer',
    deep: false,
    getCachedData(key) {
      return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
    },
    watch: [division],
  })

  const fetchTeams = async (): Promise<Team[]> => {
    if (!teams.value) {
      await refresh()
    }
    
    if (error.value) {
      console.error('Failed to fetch teams:', error.value)
      return []
    }

    return teams.value || []
  }

  const getConferencesByDivision = (division: string | null): string[] => {
    if (!teams.value) return []
    
    const filtered = division 
      ? teams.value.filter(team => team.division === division)
      : teams.value

    const conferences = [...new Set(filtered.map(team => team.conference))]
    return conferences.sort()
  }

  const getAllConferences = (): string[] => {
    if (!teams.value) return []
    const conferences = [...new Set(teams.value.map(team => team.conference))]
    return conferences.sort()
  }

  const getDivisions = (): string[] => {
    if (!teams.value) return []
    const divisions = [...new Set(teams.value.map(team => team.division))]
    return divisions.sort()
  }

  const getTeamsByConference = (conference: string): Team[] => {
    if (!teams.value) return []
    return teams.value.filter(team => team.conference === conference)
  }

  const getTeamsByDivision = (division: string): Team[] => {
    if (!teams.value) return []
    return teams.value.filter(team => team.division === division)
  }

  return {
    teams: readonly(teams),
    fetchTeams,
    getConferencesByDivision,
    getAllConferences,
    getDivisions,
    getTeamsByConference,
    getTeamsByDivision,
    refresh,
    status,
  }
}
