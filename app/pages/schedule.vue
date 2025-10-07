<script setup lang="ts">
const { fetchSchedule, filterSchedule, schedule, refresh } = useSchedule();
const pageHeaderRef = ref();
const loading = ref(false);

const selectedDivision = computed(
  () => pageHeaderRef.value?.selectedDivision ?? []
);
const selectedConference = computed(
  () => pageHeaderRef.value?.selectedConference ?? []
);
const selectedTeam = computed(() => pageHeaderRef.value?.selectedTeam ?? []);

const filteredSchedule = computed(() => {
  return filterSchedule(
    selectedDivision.value,
    selectedConference.value,
    selectedTeam.value
  );
});

const loadSchedule = async () => {
  loading.value = true;
  try {
    await fetchSchedule();
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadSchedule();
});

useHead({
  title: "Volleyball Schedule - College Volleyball Database",
  meta: [
    {
      name: "description",
      content:
        "Browse upcoming college volleyball schedules and games for NCAA, NAIA, NJCAA, and CCCAA divisions. Complete schedule with dates and times.",
    },
    {
      name: "keywords",
      content:
        "volleyball schedule, college volleyball schedule, NCAA volleyball schedule, upcoming volleyball games, volleyball calendar",
    },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://volleyballdatabased.com/schedule",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: "College Volleyball Schedule",
        description: "Upcoming college volleyball games and schedules",
        sport: "Volleyball",
      }),
    },
  ],
});

useSeoMeta({
  ogTitle: "Volleyball Schedule - College Volleyball Database",
  ogDescription: "Browse upcoming college volleyball schedules and games for NCAA, NAIA, NJCAA, and CCCAA divisions. Complete schedule with dates and times.",
  ogType: "website",
  ogUrl: "https://volleyballdatabased.com/schedule",
  twitterCard: "summary_large_image",
  twitterTitle: "Volleyball Schedule - College Volleyball Database",
  twitterDescription: "Browse upcoming college volleyball schedules and games for NCAA, NAIA, NJCAA, and CCCAA divisions.",
});
</script>

<template>
  <v-container>
    <PageHeader
      ref="pageHeaderRef"
      title="Schedule"
      :available-matches="schedule"
      :title-caption="`${filteredSchedule.length} matches`"
    />

    <v-progress-linear v-if="loading" indeterminate />

    <MatchCard
      v-if="filteredSchedule.length > 0"
      :matches="filteredSchedule"
      :loading="loading"
      match-type="schedule"
    />

    <v-alert v-else-if="!loading" type="info" class="mt-4">
      No scheduled matches found with current filters. Try adjusting your selection.
    </v-alert>
  </v-container>
</template>
