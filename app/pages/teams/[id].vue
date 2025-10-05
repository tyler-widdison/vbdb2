<script setup lang="ts">
import { useDisplay } from "vuetify";
const route = useRoute();
const teamId = computed(() => route.params.id as string);

const { teams, fetchTeams } = useTeams();
const { results, fetchResults, getResultsByTeam } = useResults();
const { schedule, fetchSchedule, getScheduleByTeam } = useSchedule();
const { smAndDown } = useDisplay();

await fetchTeams();
await fetchResults();
await fetchSchedule();

const team = computed(() => {
  if (!teams.value) return null;
  return teams.value.find((t) => t.team_id === teamId.value);
});

const teamResults = computed(() => {
  if (!results.value || !teamId.value) return [];
  return getResultsByTeam(teamId.value);
});

const teamSchedule = computed(() => {
  if (!schedule.value || !teamId.value) return [];
  return getScheduleByTeam(teamId.value);
});

const upcomingMatches = computed(() => {
  if (!teamSchedule.value) return [];
  
  const resultMatchIds = new Set(
    teamResults.value.map(match => match.match_id)
  );
  
  return teamSchedule.value.filter(
    scheduleMatch => !resultMatchIds.has(scheduleMatch.match_id)
  );
});

const allMatches = computed(() => {
  return [...teamResults.value, ...upcomingMatches.value];
});

const teamRecord = computed(() => {
  if (!teamResults.value || teamResults.value.length === 0)
    return { wins: 0, losses: 0 };

  let wins = 0;
  let losses = 0;

  teamResults.value.forEach((match) => {
    if (match.winner_id === teamId.value) {
      wins++;
    } else {
      losses++;
    }
  });

  return { wins, losses };
});

const seoTitle = computed(() => {
  if (!team.value) return "Team - College Volleyball Database";
  return `${team.value.name} Volleyball - ${team.value.division} ${team.value.conference}`;
});

const seoDescription = computed(() => {
  if (!team.value) return "View team information, schedule, and results.";
  const record = teamRecord.value;
  return `${team.value.name} volleyball team (${record.wins}-${record.losses}). View schedule, results, and team information for ${team.value.division} ${team.value.conference}.`;
});

useHead({
  title: seoTitle,
  meta: [
    {
      name: "description",
      content: seoDescription,
    },
    {
      name: "keywords",
      content: computed(() => {
        if (!team.value) return "";
        return `${team.value.name}, ${team.value.short_name}, ${team.value.division}, ${team.value.conference}, volleyball team`;
      }),
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() => {
        if (!team.value) return "";
        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          name: team.value.name,
          sport: "Volleyball",
          memberOf: {
            "@type": "SportsOrganization",
            name: team.value.conference,
          },
        });
      }),
    },
  ],
});
</script>

<template>
  <v-container>
    <v-card v-if="team" class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="auto">
            <v-avatar size="120">
              <v-img :src="team.logo" :alt="team.name" />
            </v-avatar>
          </v-col>
          <v-col>
            <h1 :class="smAndDown ? '' : 'text-h4 mb-1'">{{ team.name }}</h1>
            <div class="text-subtitle-1 text-medium-emphasis mb-2">
              Record: {{ teamRecord.wins }}-{{ teamRecord.losses }}
            </div>
            <v-chip class="mr-2" variant="outlined" size="small">
              {{ team.division }}
            </v-chip>
            <v-chip class="mr-2" variant="outlined" size="small">
              {{ team.conference }}
            </v-chip>
            <v-chip
              v-if="team.avca_ranking"
              color="warning"
              variant="tonal"
              size="small"
            >
              AVCA Rank #{{ team.avca_ranking }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-alert v-else type="warning" class="mb-4"> Team not found </v-alert>
    <MatchCard v-if="allMatches.length > 0" :matches="allMatches" hide-header />

    <v-alert v-else type="info" class="mt-4">
      No matches found for this team.
    </v-alert>
  </v-container>
</template>
