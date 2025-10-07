<script setup lang="ts">
const allDivisions = ['D-I', 'D-II', 'D-III', 'NAIA', 'NJCAA D-1', 'NJCAA D-2', 'NJCAA D-3', 'CCCAA'];

const resultsComposables = allDivisions.map(div => ({
  division: div,
  composable: useResults(ref(div))
}));

const pageHeaderRef = ref();
const loading = ref(false);

const selectedDivision = computed(
  () => pageHeaderRef.value?.selectedDivision ?? []
);
const selectedConference = computed(
  () => pageHeaderRef.value?.selectedConference ?? []
);
const selectedTeam = computed(() => pageHeaderRef.value?.selectedTeam ?? []);

const allResults = computed(() => {
  return resultsComposables.flatMap(rc => rc.composable.results.value || []);
});

const filteredResults = computed(() => {
  let filtered = allResults.value;

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

  return filtered;
});

const loadResults = async () => {
  loading.value = true;
  try {
    await Promise.all(resultsComposables.map(rc => rc.composable.fetchResults()));
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
  link: [
    {
      rel: "canonical",
      href: "https://volleyballdatabased.com/scores",
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

useSeoMeta({
  ogTitle: "Volleyball Scores & Results - College Volleyball Database",
  ogDescription:
    "View college volleyball scores and game results from NCAA, NAIA, NJCAA, and CCCAA divisions. Complete match scores, stats, and box scores.",
  ogType: "website",
  ogUrl: "https://volleyballdatabased.com/scores",
  twitterCard: "summary_large_image",
  twitterTitle: "Volleyball Scores & Results - College Volleyball Database",
  twitterDescription:
    "View college volleyball scores and game results from NCAA, NAIA, NJCAA, and CCCAA divisions.",
});
</script>

<template>
  <v-container>
    <PageHeader
      ref="pageHeaderRef"
      title="Scores & Results"
      :available-matches="allResults"
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
