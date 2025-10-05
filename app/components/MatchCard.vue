<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { LiveMatch } from "../composables/useLive";
import type { ResultMatch } from "../composables/useResults";
import type { ScheduleMatch } from "../composables/useSchedule";

type UnifiedMatch = LiveMatch | ResultMatch | ScheduleMatch;

interface SetScore {
  set: number;
  team1Score: number;
  team2Score: number;
  winner: number;
}

interface FormattedMatch {
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  team1ShortName: string;
  team2ShortName: string;
  team1Img: string;
  team2Img: string;
  team1Division: string;
  team2Division: string;
  team1Conference: string;
  team2Conference: string;
  team1SetsWon: number;
  team2SetsWon: number;
  individualSets: SetScore[];
  status: "live" | "completed" | "upcoming";
  currentSet: number | null;
  winnerId: string | null;
  time: string;
  date: string;
  live_stats_url: string | null;
  team1Rank: number | null;
  team2Rank: number | null;
}

const props = defineProps<{
  matches: UnifiedMatch[];
  loading?: boolean;
  showUpcoming?: boolean;
  matchType?: "live" | "results" | "schedule";
  hideHeader?: boolean;
}>();

const { smAndDown } = useDisplay();
const router = useRouter();
const { teams, fetchTeams } = useTeams();

await fetchTeams();

const currentPage = ref(1);
const itemsPerColumn = 8;

const getTeamShortName = (teamId: string, fullName: string): string => {
  if (!teams.value) return fullName;
  const team = teams.value.find((t) => t.team_id === teamId);
  return team?.short_name || fullName;
};

const isResultMatch = (match: UnifiedMatch): match is ResultMatch => {
  return "winner_id" in match;
};

const isScheduleMatch = (match: UnifiedMatch): match is ScheduleMatch => {
  return "title" in match && !("set_1_team_1" in match);
};

const getMatchStatus = (
  match: UnifiedMatch
): "live" | "completed" | "upcoming" => {
  if (isResultMatch(match)) {
    return "completed";
  }

  if (isScheduleMatch(match)) {
    return "upcoming";
  }

  let setsPlayed = 0;
  let team1Wins = 0;
  let team2Wins = 0;

  for (let i = 1; i <= 5; i++) {
    const team1Score = match[`set_${i}_team_1` as keyof UnifiedMatch];
    const team2Score = match[`set_${i}_team_2` as keyof UnifiedMatch];

    if (team1Score !== null && team2Score !== null) {
      setsPlayed++;
      const score1 =
        typeof team1Score === "string" ? parseInt(team1Score) : team1Score;
      const score2 =
        typeof team2Score === "string" ? parseInt(team2Score) : team2Score;
      if (score1 > score2) team1Wins++;
      if (score2 > score1) team2Wins++;
    }
  }

  if (setsPlayed === 0) return "upcoming";
  if (team1Wins >= 3 || team2Wins >= 3) return "completed";
  return "live";
};

const formatMatch = (match: UnifiedMatch): FormattedMatch => {
  const individualSets: SetScore[] = [];
  let team1SetsWon = 0;
  let team2SetsWon = 0;
  let currentSet: number | null = null;

  if (!isScheduleMatch(match)) {
    for (let i = 1; i <= 5; i++) {
      const team1Score = match[`set_${i}_team_1` as keyof UnifiedMatch];
      const team2Score = match[`set_${i}_team_2` as keyof UnifiedMatch];

      if (team1Score !== null && team2Score !== null) {
        const score1 =
          typeof team1Score === "string" ? parseInt(team1Score) : team1Score;
        const score2 =
          typeof team2Score === "string" ? parseInt(team2Score) : team2Score;

        individualSets.push({
          set: i,
          team1Score: score1,
          team2Score: score2,
          winner: score1 > score2 ? 1 : score2 > score1 ? 2 : 0,
        });

        if (score1 > score2) team1SetsWon++;
        if (score2 > score1) team2SetsWon++;
      }
    }
  }

  const status = getMatchStatus(match);

  if (status === "live" && individualSets.length > 0) {
    currentSet = individualSets.length;
  }

  let winnerId: string | null = null;
  if (isResultMatch(match)) {
    winnerId = match.winner_id;
  } else if (status === "completed") {
    winnerId = team1SetsWon >= 3 ? match.team_1_id : match.team_2_id;
  }

  const liveStatsUrl = isScheduleMatch(match)
    ? match.box_score
    : isResultMatch(match)
    ? match.box_score
    : match.live_stats_url;

  const team1Rank = isResultMatch(match) ? match.team_1_rank : null;
  const team2Rank = isResultMatch(match) ? match.team_2_rank : null;

  const team1Id = isScheduleMatch(match)
    ? match.team_1_id || ""
    : match.team_1_id;
  const team2Id = isScheduleMatch(match)
    ? match.team_2_id || ""
    : match.team_2_id;
  const team1Img = isScheduleMatch(match)
    ? match.team_1_logo || ""
    : match.team_1_logo;
  const team2Img = isScheduleMatch(match)
    ? match.team_2_logo || ""
    : match.team_2_logo;
  const team1Division = isScheduleMatch(match)
    ? match.team_1_division || ""
    : match.team_1_division;
  const team2Division = isScheduleMatch(match)
    ? match.team_2_division || ""
    : match.team_2_division;
  const team1Conference = isScheduleMatch(match)
    ? match.team_1_conference || ""
    : match.team_1_conference;
  const team2Conference = isScheduleMatch(match)
    ? match.team_2_conference || ""
    : match.team_2_conference;

  let cleanedTime = match.time || "";
  if (cleanedTime) {
    cleanedTime = cleanedTime.replace(/Attend:.*$/i, "").trim();
  }

  let formattedDate: string = match.date || "";
  if (formattedDate && formattedDate.includes(" ")) {
    formattedDate = formattedDate.split(" ")[0];
  }

  return {
    team1Id,
    team2Id,
    team1Name: match.team_1_name,
    team2Name: match.team_2_name,
    team1ShortName: getTeamShortName(team1Id, match.team_1_name),
    team2ShortName: getTeamShortName(team2Id, match.team_2_name),
    team1Img,
    team2Img,
    team1Division,
    team2Division,
    team1Conference,
    team2Conference,
    team1SetsWon,
    team2SetsWon,
    individualSets,
    status,
    currentSet,
    winnerId,
    time: cleanedTime,
    date: formattedDate,
    live_stats_url: liveStatsUrl,
    team1Rank,
    team2Rank,
  };
};

const formattedMatches = computed(() => {
  const formatted = props.matches.map(formatMatch);

  return formatted.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateA - dateB;
  });
});

const paginatedMatches = computed(() => {
  const itemsPerPage = smAndDown.value ? itemsPerColumn : itemsPerColumn * 2;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return formattedMatches.value.slice(start, end);
});

const matchColumns = computed(() => {
  if (smAndDown.value) {
    return [paginatedMatches.value];
  }

  const midPoint = Math.ceil(paginatedMatches.value.length / 2);
  return [
    paginatedMatches.value.slice(0, midPoint),
    paginatedMatches.value.slice(midPoint),
  ];
});

const totalPages = computed(() => {
  const itemsPerPage = smAndDown.value ? itemsPerColumn : itemsPerColumn * 2;
  return Math.ceil(formattedMatches.value.length / itemsPerPage);
});

const getTeamNameColor = (teamId: string, match: FormattedMatch): string => {
  if (match.status === "upcoming") {
    return "font-weight-light";
  }

  if (match.status === "live") {
    if (match.team1SetsWon > match.team2SetsWon && teamId === match.team1Id) {
      return "text-success";
    } else if (
      match.team2SetsWon > match.team1SetsWon &&
      teamId === match.team2Id
    ) {
      return "text-success";
    }
    return "text-medium-emphasis";
  }

  if (match.winnerId === teamId) {
    return "text-success";
  } else if (match.winnerId && match.winnerId !== teamId) {
    return "text-error";
  }

  return "text-success";
};

const getSetScoreColor = (teamScore: number, opponentScore: number): string => {
  if (teamScore > opponentScore) {
    return "text-primary";
  }
  return "text-medium-emphasis";
};

const navigateToBoxScore = (event: Event, item: FormattedMatch): void => {
  if (item.live_stats_url) {
    event.stopPropagation();
    window.open(item.live_stats_url, "_blank");
  }
};

const handlePageChange = (page: number): void => {
  currentPage.value = page;
};

const getTeamAbbreviation = (teamName: string): string => {
  const words = teamName.split(" ");
  if (words.length === 1) {
    return teamName.length > 10 ? teamName.substring(0, 10) : teamName;
  }
  return words
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};
</script>

<template>
  <div>
    <v-card
      v-if="!formattedMatches || formattedMatches.length === 0"
      class="mt-4 pa-0"
    >
      <v-card-text class="text-center py-8 text-medium-emphasis">
        No matches found
      </v-card-text>
    </v-card>

    <v-row v-else dense class="mt-4" no-gutters>
      <v-col
        v-for="(column, colIndex) in matchColumns"
        :key="colIndex"
        :cols="smAndDown ? 12 : 6"
        :class="[
          !smAndDown && colIndex === 0 ? 'pr-1' : '',
          !smAndDown && colIndex === 1 ? 'pl-1' : '',
        ]"
      >
        <v-card>
          <v-card-title
            v-if="!hideHeader"
            class="d-flex align-center pa-3 bg-grey-darken-3"
          >
            <span class="text-subtitle-1" style="flex: 1">Teams</span>
            <span class="text-subtitle-1 text-right" style="flex: 1"
              >Sets & Score</span
            >
          </v-card-title>

          <div v-for="(item, index) in column" :key="index">
            <div class="d-flex align-stretch pa-3">
              <div class="d-flex align-center" style="flex: 1">
                <div style="flex: 1">
                  <div class="d-flex align-center mb-2">
                    <v-avatar
                      :size="smAndDown ? 38 : 40"
                      class="mr-2 flex-shrink-0"
                    >
                      <v-img
                        v-if="item.team1Img"
                        :src="item.team1Img"
                        :alt="item.team1Name"
                      />
                      <v-icon v-else :size="smAndDown ? 20 : 24">
                        mdi-school
                      </v-icon>
                    </v-avatar>

                    <div>
                      <span
                        :class="[
                          smAndDown ? 'text-body-2' : 'text-subtitle-1',
                          'button-like',
                          getTeamNameColor(item.team1Id, item),
                          'text-wrap',
                        ]"
                        @click="router.push(`/teams/${item.team1Id}`)"
                      >
                        {{ smAndDown ? item.team1ShortName : item.team1Name }}
                      </span>
                      <div class="text-caption text-grey">
                        {{ item.team1Conference }}
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-center">
                    <v-avatar
                      :size="smAndDown ? 38 : 40"
                      class="mr-2 flex-shrink-0"
                    >
                      <v-img
                        v-if="item.team2Img"
                        :src="item.team2Img"
                        :alt="item.team2Name"
                      />
                      <v-icon v-else :size="smAndDown ? 20 : 24"
                        >mdi-school</v-icon
                      >
                    </v-avatar>

                    <div>
                      <span
                        :class="[
                          smAndDown ? 'text-body-2' : 'text-subtitle-1',
                          'button-like',
                          getTeamNameColor(item.team2Id, item),
                          'text-wrap',
                        ]"
                        @click="router.push(`/teams/${item.team2Id}`)"
                      >
                        {{ smAndDown ? item.team2ShortName : item.team2Name }}
                      </span>
                      <div class="text-caption text-grey">
                        {{ item.team2Conference }}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="item.status === 'live' && item.currentSet"
                  class="flex-shrink-0 ml-3"
                >
                  <v-chip color="primary" size="small" variant="tonal">
                    Set {{ item.currentSet }}
                  </v-chip>
                </div>
              </div>

              <div class="d-flex align-center justify-end" style="flex: 1">
                <div v-if="item.status !== 'upcoming'" class="text-right">
                  <div
                    :class="smAndDown ? 'text-body-2' : 'text-subtitle-1'"
                    class="button-like"
                    @click="navigateToBoxScore($event, item)"
                  >
                    <span class="text-body-2">{{ item.date }}</span>
                    <div class="d-flex align-center justify-end mb-1">
                      <div class="d-flex align-center">
                        <span class="mr-1">[</span>
                        <template
                          v-for="(set, setIndex) in item.individualSets"
                          :key="`team1-set-${setIndex}`"
                        >
                          <span
                            :class="[
                              'text-body-1 mx-1',
                              getSetScoreColor(set.team1Score, set.team2Score),
                            ]"
                          >
                            {{ set.team1Score }}
                          </span>
                        </template>
                        <span class="ml-1 mr-2">]</span>
                        <span
                          :class="[
                            smAndDown ? 'text-body-1' : 'text-subtitle-1',
                            getTeamNameColor(item.team1Id, item),
                            'font-weight-medium',
                          ]"
                        >
                          ({{ item.team1SetsWon }})
                        </span>
                      </div>
                    </div>

                    <div class="d-flex align-center justify-end">
                      <div class="d-flex align-center">
                        <span class="mr-1">[</span>
                        <template
                          v-for="(set, setIndex) in item.individualSets"
                          :key="`team2-set-${setIndex}`"
                        >
                          <span
                            :class="[
                              'text-body-1 mx-1',
                              getSetScoreColor(set.team2Score, set.team1Score),
                            ]"
                          >
                            {{ set.team2Score }}
                          </span>
                        </template>
                        <span class="ml-1 mr-2">]</span>
                        <span
                          :class="[
                            smAndDown ? 'text-body-1' : 'text-subtitle-1',
                            getTeamNameColor(item.team2Id, item),
                            'font-weight-medium',
                          ]"
                        >
                          ({{ item.team2SetsWon }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <v-row
                  v-else-if="item.time"
                  justify="end"
                  no-gutters
                  class="align-center"
                >
                  <v-col cols="auto">
                    <template v-if="item.team1Division === item.team2Division">
                      <v-chip variant="outlined" color="white" size="small">
                        {{ item.team1Division }}
                      </v-chip>
                    </template>

                    <template v-else>
                      <v-chip variant="outlined" color="white" size="small">
                        {{ item.team1Division }}
                      </v-chip>
                      <v-chip variant="text" size="small"> vs </v-chip>
                      <v-chip variant="outlined" color="white" size="small">
                        {{ item.team2Division }}
                      </v-chip>
                    </template>
                  </v-col>

                  <v-col cols="auto" class="ml-3">
                    <div class="text-right">
                      <div class="text-caption text-medium-emphasis mb-1">
                        {{ item.date }}
                      </div>
                      <v-chip
                        color="success"
                        variant="elevated"
                        prepend-icon="mdi-clock-outline"
                        size="small"
                      >
                        {{ item.time }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
                <div v-else class="text-right">
                  <div class="text-caption text-medium-emphasis mb-2">
                    {{ item.date }}
                  </div>
                  <v-row justify="end" no-gutters class="align-center">
                    <v-col cols="auto">
                      <template
                        v-if="item.team1Division === item.team2Division"
                      >
                        <v-chip variant="outlined" color="white" size="small">
                          {{ item.team1Division }}
                        </v-chip>
                      </template>

                      <template v-else>
                        <v-chip variant="outlined" color="white" size="small">
                          {{ item.team1Division }}
                        </v-chip>
                        <v-chip variant="text" size="small"> vs </v-chip>
                        <v-chip variant="outlined" color="white" size="small">
                          {{ item.team2Division }}
                        </v-chip>
                      </template>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>

            <v-divider v-if="index < column.length - 1"></v-divider>
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
        @update:model-value="handlePageChange"
      ></v-pagination>
    </v-card>

    <span v-if="showUpcoming" class="text-subtitle-2 font-weight-light">
      NCAA Times taken from
      https://stats.ncaa.org/contests/livestream_scoreboards?sport_code=WVB
    </span>
  </div>
</template>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button-like {
  cursor: pointer;
  transition: opacity 0.2s;
}

.button-like:hover {
  opacity: 0.8;
}
</style>
