<script setup lang="ts">
const { fetchResults, filterResults, results, refresh } = useResults();
const pageHeaderRef = ref();
const loading = ref(false);

const selectedDivision = computed(
  () => pageHeaderRef.value?.selectedDivision ?? []
);
const selectedConference = computed(
  () => pageHeaderRef.value?.selectedConference ?? []
);
const selectedTeam = computed(() => pageHeaderRef.value?.selectedTeam ?? []);

const filteredResults = computed(() => {
  return filterResults(
    selectedDivision.value,
    selectedConference.value,
    selectedTeam.value
  );
});

const loadResults = async () => {
  loading.value = true;
  try {
    await fetchResults();
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadResults();
});

useHead({
  title: "Volleyball Scores & Results - College Volleyball Database",
  meta: [
    {
      name: "description",
      content:
        "View college volleyball scores and game results from NCAA, NAIA, NJCAA, and CCCAA divisions. Complete match scores, stats, and box scores.",
    },
    {
      name: "keywords",
      content:
        "volleyball scores, college volleyball results, NCAA volleyball scores, volleyball game results, college volleyball box scores",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: "College Volleyball Scores",
        description: "College volleyball game scores and results",
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
      title="Scores & Results"
      :available-matches="results"
      :title-caption="`${filteredResults.length} matches`"
    />

    <v-progress-linear v-if="loading" indeterminate />

    <MatchCard
      v-if="filteredResults.length > 0"
      :matches="filteredResults"
      :loading="loading"
      match-type="results"
    />

    <v-alert v-else-if="!loading" type="info" class="mt-4">
      No results found with current filters. Try adjusting your selection.
    </v-alert>
  </v-container>
</template>
