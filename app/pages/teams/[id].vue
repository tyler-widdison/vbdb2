<script setup lang="ts">
import { useDisplay } from "vuetify";
const route = useRoute();
const teamId = computed(() => route.params.id as string);

const teamDivision = ref('D-I');

const allDivisions = ['D-I', 'D-II', 'D-III', 'NAIA', 'NJCAA D-1', 'NJCAA D-2', 'NJCAA D-3', 'CCCAA'];
const teamsComposables = allDivisions.map(div => ({
  division: div,
  composable: useTeams(ref(div))
}));

const resultsComposable = useResults(teamDivision);
const scheduleComposable = useSchedule();
const { smAndDown } = useDisplay();

await Promise.all([
  ...teamsComposables.map(tc => tc.composable.fetchTeams()),
  scheduleComposable.fetchSchedule()
]);

const allTeams = computed(() => {
  return teamsComposables.flatMap(tc => tc.composable.teams.value || []);
});

const team = computed(() => {
  return allTeams.value.find((t) => t.team_id === teamId.value) || null;
});

if (team.value) {
  teamDivision.value = team.value.division;
  await resultsComposable.fetchResults();
}

watch(team, async (newTeam) => {
  if (newTeam && newTeam.division !== teamDivision.value) {
    teamDivision.value = newTeam.division;
    await resultsComposable.fetchResults();
  }
});

const teamResults = computed(() => {
  if (!resultsComposable.results.value || !teamId.value) return [];
  return resultsComposable.getResultsByTeam(teamId.value);
});

const teamSchedule = computed(() => {
  if (!scheduleComposable.schedule.value || !teamId.value) return [];
  return scheduleComposable.getScheduleByTeam(teamId.value);
});

const upcomingMatches = computed(() => {
  if (!teamSchedule.value) return [];
  
  const resultMatchIds = new Set(
    teamResults.value.map(match => match.match_id)
  );
  
  const resultMatchKeys = new Set(
    teamResults.value.map(match => {
      const date = match.date.split(' ')[0];
      return `${match.team_1_id}-${match.team_2_id}-${date}`;
    })
  );
  
  return teamSchedule.value.filter(scheduleMatch => {
    if (resultMatchIds.has(scheduleMatch.match_id)) {
      return false;
    }
    
    const date = scheduleMatch.date.split(' ')[0];
    const key1 = `${scheduleMatch.team_1_id}-${scheduleMatch.team_2_id}-${date}`;
    const key2 = `${scheduleMatch.team_2_id}-${scheduleMatch.team_1_id}-${date}`;
    
    return !resultMatchKeys.has(key1) && !resultMatchKeys.has(key2);
  });
});

const allMatches = computed(() => {
  const combined = [...teamResults.value, ...upcomingMatches.value];
  return combined.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
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
  link: [
    {
      rel: "canonical",
      href: computed(() => `https://volleyballdatabased.com/teams/${teamId.value}`),
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

useSeoMeta({
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: "website",
  ogUrl: computed(() => `https://volleyballdatabased.com/teams/${teamId.value}`),
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
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
