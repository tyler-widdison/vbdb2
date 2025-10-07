<script setup lang="ts">
const allDivisions = ['D-I', 'D-II', 'D-III', 'NAIA', 'NJCAA D-1', 'NJCAA D-2', 'NJCAA D-3', 'CCCAA'];

const liveComposables = allDivisions.map(div => ({
  division: div,
  composable: useLive(ref(div))
}));

const pageHeaderRef = ref();
const loading = ref(false);
const refreshInterval = ref<NodeJS.Timeout | null>(null);

const selectedDivision = computed(
  () => pageHeaderRef.value?.selectedDivision ?? []
);
const selectedConference = computed(
  () => pageHeaderRef.value?.selectedConference ?? []
);
const selectedTeam = computed(() => pageHeaderRef.value?.selectedTeam ?? []);
const statusFilters = computed(
  () =>
    pageHeaderRef.value?.statusFilters ?? {
      live: true,
      completed: true,
      upcoming: true,
    }
);

const allMatches = computed(() => {
  return liveComposables.flatMap(lc => lc.composable.matches.value || []);
});

const filteredMatches = computed(() => {
  let filtered = allMatches.value;

  if (selectedDivision.value && selectedDivision.value.length > 0) {
    filtered = filtered.filter(
      (match) =>
        selectedDivision.value.includes(match.team_1_division) ||
        selectedDivision.value.includes(match.team_2_division)
    );
  }

  if (selectedConference.value && selectedConference.value.length > 0) {
    filtered = filtered.filter(
      (match) =>
        selectedConference.value.includes(match.team_1_conference) ||
        selectedConference.value.includes(match.team_2_conference)
    );
  }

  if (selectedTeam.value && selectedTeam.value.length > 0) {
    filtered = filtered.filter(
      (match) =>
        selectedTeam.value.includes(match.team_1_id) || 
        selectedTeam.value.includes(match.team_2_id)
    );
  }

  filtered = filtered.filter((match) => {
    const getMatchStatus = (m: typeof match): "live" | "completed" | "upcoming" => {
      let setsPlayed = 0;
      let team1Wins = 0;
      let team2Wins = 0;

      for (let i = 1; i <= 5; i++) {
        const team1Score = m[`set_${i}_team_1` as keyof typeof m];
        const team2Score = m[`set_${i}_team_2` as keyof typeof m];

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
    
    const status = getMatchStatus(match);
    return statusFilters.value[status];
  });

  return filtered;
});

const loadMatches = async () => {
  loading.value = true;
  try {
    await Promise.all(liveComposables.map(lc => lc.composable.fetchLiveMatches()));
  } finally {
    loading.value = false;
  }
};

const refreshMatches = async () => {
  try {
    await Promise.all(liveComposables.map(lc => lc.composable.refresh()));
    console.log("Matches refreshed at", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error refreshing matches:", error);
  }
};

onMounted(async () => {
  await loadMatches();

  refreshInterval.value = setInterval(() => {
    refreshMatches();
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value);
  }
});

useHead({
  title: "Live Volleyball Scores - College Volleyball Database",
  meta: [
    {
      name: "description",
      content:
        "Watch live college volleyball scores and games in real-time across NCAA, NAIA, NJCAA, and CCCAA divisions.",
    },
    {
      name: "keywords",
      content:
        "live volleyball, live volleyball scores, college volleyball live, NCAA volleyball live, volleyball games today",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://volleyballdatabased.com/live",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: "Live College Volleyball",
        description: "Live college volleyball scores and games",
        sport: "Volleyball",
      }),
    },
  ],
});

useSeoMeta({
  ogTitle: "Live Volleyball Scores - College Volleyball Database",
  ogDescription: "Watch live college volleyball scores and games in real-time across NCAA, NAIA, NJCAA, and CCCAA divisions.",
  ogType: "website",
  ogUrl: "https://volleyballdatabased.com/live",
  twitterCard: "summary_large_image",
  twitterTitle: "Live Volleyball Scores - College Volleyball Database",
  twitterDescription: "Watch live college volleyball scores and games in real-time across NCAA, NAIA, NJCAA, and CCCAA divisions.",
});
</script>

<template>
  <v-container>
    <PageHeader
      ref="pageHeaderRef"
      show-status-filters
      title="Live Scores"
      :available-matches="allMatches"
      :title-caption="`${filteredMatches.length} matches`"
    />

    <v-progress-linear v-if="loading" indeterminate />

    <MatchCard
      v-if="filteredMatches.length > 0"
      :matches="filteredMatches"
      :loading="loading"
    />

    <v-alert v-else-if="!loading" type="info" class="mt-4">
      No matches found with current filters. Try adjusting your selection.
    </v-alert>
  </v-container>
</template>
