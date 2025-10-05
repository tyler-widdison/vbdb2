<script setup lang="ts">
import { useDisplay } from "vuetify";

const { teams, fetchTeams, getDivisions, getAllConferences } = useTeams();
const { smAndDown } = useDisplay();
const search = ref("");
const selectedDivisions = ref<string[]>([]);
const selectedConferences = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerColumn = 12;

await fetchTeams();

const divisions = computed(() => getDivisions());
const conferences = computed(() => getAllConferences());

const filteredTeams = computed(() => {
  if (!teams.value) return [];

  let filtered = teams.value;

  if (selectedDivisions.value.length > 0) {
    filtered = filtered.filter((team) =>
      selectedDivisions.value.includes(team.division)
    );
  }

  if (selectedConferences.value.length > 0) {
    filtered = filtered.filter((team) =>
      selectedConferences.value.includes(team.conference)
    );
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (team) =>
        team.name.toLowerCase().includes(searchLower) ||
        team.short_name.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
});

const paginatedTeams = computed(() => {
  const itemsPerPage = smAndDown.value ? itemsPerColumn : itemsPerColumn * 2;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTeams.value.slice(start, end);
});

const teamColumns = computed(() => {
  if (smAndDown.value) {
    return [paginatedTeams.value];
  }

  const midPoint = Math.ceil(paginatedTeams.value.length / 2);
  return [
    paginatedTeams.value.slice(0, midPoint),
    paginatedTeams.value.slice(midPoint),
  ];
});

const totalPages = computed(() => {
  const itemsPerPage = smAndDown.value ? itemsPerColumn : itemsPerColumn * 2;
  return Math.ceil(filteredTeams.value.length / itemsPerPage);
});

useHead({
  title: "Volleyball Teams - College Volleyball Database",
  meta: [
    {
      name: "description",
      content:
        "Explore college volleyball teams from NCAA D-I, D-II, D-III, NAIA, NJCAA, and CCCAA divisions. Search by team name, division, or conference.",
    },
    {
      name: "keywords",
      content:
        "college volleyball teams, NCAA volleyball teams, volleyball team directory, volleyball team search, college volleyball roster",
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SportsOrganization",
        name: "College Volleyball Teams",
        description: "Directory of college volleyball teams",
        sport: "Volleyball",
      }),
    },
  ],
});
</script>

<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>Volleyball Teams</v-card-title>
      <v-card-subtitle>{{ filteredTeams.length }} teams</v-card-subtitle>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search teams"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="selectedDivisions"
              :items="divisions"
              label="Division"
              multiple
              chips
              clearable
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="selectedConferences"
              :items="conferences"
              label="Conference"
              multiple
              chips
              clearable
              hide-details
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row dense no-gutters>
      <v-col
        v-for="(column, colIndex) in teamColumns"
        :key="colIndex"
        :cols="smAndDown ? 12 : 6"
        :class="[
          !smAndDown && colIndex === 0 ? 'pr-1' : '',
          !smAndDown && colIndex === 1 ? 'pl-1' : '',
        ]"
      >
        <v-card>
          <v-card-title class="d-flex align-center pa-3 bg-grey-darken-3">
            <span class="text-subtitle-1">Teams</span>
          </v-card-title>

          <div v-for="(team, index) in column" :key="team.team_id">
            <div
              class="d-flex align-center pa-3 team-item"
              @click="$router.push(`/teams/${team.team_id}`)"
            >
              <v-avatar :size="smAndDown ? 40 : 48" class="mr-3 flex-shrink-0">
                <v-img :src="team.logo" :alt="team.name" />
              </v-avatar>

              <div class="flex-grow-1">
                <div
                  :class="smAndDown ? 'text-body-2' : 'text-subtitle-1'"
                  class="font-weight-medium"
                >
                  {{ team.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ team.conference }} | {{ team.division }}
                </div>
              </div>
            </div>
            <v-divider v-if="index < column.length - 1" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-if="totalPages > 1" class="mt-2">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="4"
        rounded="circle"
      />
    </v-card>
  </v-container>
</template>

<style scoped>
.team-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.team-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
