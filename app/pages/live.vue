<script setup lang="ts">
const { fetchLiveMatches, filterMatches, matches, refresh } = useLive();
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

const filteredMatches = computed(() => {
  return filterMatches(
    selectedDivision.value,
    selectedConference.value,
    selectedTeam.value,
    statusFilters.value
  );
});

const loadMatches = async () => {
  loading.value = true;
  try {
    await fetchLiveMatches();
  } finally {
    loading.value = false;
  }
};

const refreshMatches = async () => {
  try {
    await refresh();
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
</script>

<template>
  <v-container>
    <PageHeader
      ref="pageHeaderRef"
      show-status-filters
      title="Live Scores"
      :available-matches="matches"
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
