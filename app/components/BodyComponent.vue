<script setup lang="ts">
import type { LiveMatch } from "../composables/useLive";

const props = defineProps<{
  content: LiveMatch[];
  columns?: number;
}>();

const { getMatchStatus } = useLive();

const cols = computed(() => props.columns || 12);

const getSets = (match: LiveMatch) => {
  const sets = [];
  for (let i = 1; i <= 5; i++) {
    const team1Score = match[`set_${i}_team_1` as keyof LiveMatch];
    const team2Score = match[`set_${i}_team_2` as keyof LiveMatch];

    if (team1Score !== null && team2Score !== null) {
      const score1 = parseInt(team1Score as string);
      const score2 = parseInt(team2Score as string);
      sets.push({
        set: i,
        team1: team1Score,
        team2: team2Score,
        winner: score1 > score2 ? 1 : score2 > score1 ? 2 : 0,
      });
    }
  }
  return sets;
};

const getSetColor = (set: { winner: number }, matchWinner: number) => {
  if (matchWinner === 0) return undefined;
  return set.winner === matchWinner ? "success" : undefined;
};

const getWinner = (match: LiveMatch) => {
  let team1Wins = 0;
  let team2Wins = 0;

  for (let i = 1; i <= 5; i++) {
    const team1Score = parseInt(
      (match[`set_${i}_team_1` as keyof LiveMatch] as string) || "0"
    );
    const team2Score = parseInt(
      (match[`set_${i}_team_2` as keyof LiveMatch] as string) || "0"
    );

    if (team1Score > team2Score) team1Wins++;
    if (team2Score > team1Score) team2Wins++;
  }

  if (team1Wins >= 3) return 1;
  if (team2Wins >= 3) return 2;
  return 0;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "live":
      return "success";
    case "completed":
      return "primary";
    case "upcoming":
      return "warning";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "live":
      return "mdi-access-point";
    case "completed":
      return "mdi-check-circle";
    case "upcoming":
      return "mdi-calendar-clock";
    default:
      return "mdi-information";
  }
};
</script>

<template>
  <v-row>
    <v-col v-for="(match, index) in content" :key="index" :cols="12" :md="cols">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-caption">{{ match.date }} - {{ match.time }}</span>
          <div class="d-flex gap-2">
            <v-chip
              :color="getStatusColor(getMatchStatus(match))"
              :prepend-icon="getStatusIcon(getMatchStatus(match))"
              size="small"
            >
              {{ getMatchStatus(match).toUpperCase() }}
            </v-chip>
            <v-chip
              v-if="match.team_1_division === match.team_2_division"
              size="small"
            >
              {{ match.team_1_division }}
            </v-chip>
            <template v-else>
              <v-chip size="small">{{ match.team_1_division }}</v-chip>
              <v-chip size="small">{{ match.team_2_division }}</v-chip>
            </template>
          </div>
        </v-card-title>

        <v-card-text class="py-2">
          <v-row align="center" class="mb-2">
            <v-col cols="5" class="text-center py-1">
              <v-avatar size="40" class="mb-1">
                <v-img :src="match.team_1_logo" :alt="match.team_1_name" />
              </v-avatar>
              <div
                class="text-body-2"
                :class="{
                  'font-weight-bold': getWinner(match) === 1,
                  'text-success': getWinner(match) === 1,
                }"
              >
                {{ match.team_1_name }}
              </div>
              <div class="text-caption text-truncate">
                {{ match.team_1_conference }}
              </div>
            </v-col>

            <v-col cols="2" class="text-center py-1">
              <div class="text-body-1">VS</div>
            </v-col>

            <v-col cols="5" class="text-center py-1">
              <v-avatar size="40" class="mb-1">
                <v-img :src="match.team_2_logo" :alt="match.team_2_name" />
              </v-avatar>
              <div
                class="text-body-2"
                :class="{
                  'font-weight-bold': getWinner(match) === 2,
                  'text-success': getWinner(match) === 2,
                }"
              >
                {{ match.team_2_name }}
              </div>
              <div class="text-caption text-truncate">
                {{ match.team_2_conference }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-2" />

          <div v-if="getSets(match).length > 0" class="mb-1">
            <div class="text-caption mb-1">Sets</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="set in getSets(match)"
                :key="set.set"
                size="x-small"
                :color="getSetColor(set, getWinner(match))"
              >
                {{ set.set }}: {{ set.team1 }}-{{ set.team2 }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="py-1">
          <v-btn
            :href="match.live_stats_url"
            target="_blank"
            size="x-small"
            prepend-icon="mdi-chart-box"
          >
            Stats
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
