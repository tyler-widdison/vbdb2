<script setup lang="ts">
import type { LiveMatch } from "../composables/useLive";
import type { ResultMatch } from "../composables/useResults";
import type { ScheduleMatch } from "../composables/useSchedule";

type MatchType = LiveMatch | ResultMatch | ScheduleMatch;

const props = defineProps<{
  selectedDivision?: string[];
  selectedConference?: string[];
  availableMatches?: readonly MatchType[] | null;
}>();

const selectedTeam = ref<string[]>([]);
const teamOptions = ref<{ title: string; value: string }[]>([]);
const loading = ref(false);

const loadTeams = () => {
  loading.value = true;
  try {
    if (!props.availableMatches || props.availableMatches.length === 0) {
      teamOptions.value = [];
      return;
    }

    const teamsMap = new Map<
      string,
      { name: string; division: string; conference: string }
    >();

    props.availableMatches.forEach((match) => {
      if (match.team_1_id && match.team_1_division && match.team_1_conference) {
        teamsMap.set(match.team_1_id, {
          name: match.team_1_name,
          division: match.team_1_division,
          conference: match.team_1_conference,
        });
      }
      if (match.team_2_id && match.team_2_division && match.team_2_conference) {
        teamsMap.set(match.team_2_id, {
          name: match.team_2_name,
          division: match.team_2_division,
          conference: match.team_2_conference,
        });
      }
    });

    let filtered = Array.from(teamsMap.entries());

    if (props.selectedDivision && props.selectedDivision.length > 0) {
      filtered = filtered.filter(([_, team]) =>
        props.selectedDivision!.includes(team.division)
      );
    }

    if (props.selectedConference && props.selectedConference.length > 0) {
      filtered = filtered.filter(([_, team]) =>
        props.selectedConference!.includes(team.conference)
      );
    }

    teamOptions.value = filtered
      .map(([id, team]) => ({
        title: team.name,
        value: id,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    console.log(
      "Team options:",
      teamOptions.value.length,
      "from",
      props.availableMatches.length,
      "matches"
    );
  } catch (error) {
    console.error("Error loading teams:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  [
    () => props.selectedDivision,
    () => props.selectedConference,
    () => props.availableMatches,
  ],
  () => {
    selectedTeam.value = [];
    loadTeams();
  },
  { immediate: true, deep: true }
);

defineExpose({
  selectedTeam,
});
</script>

<template>
  <v-autocomplete
    v-model="selectedTeam"
    :items="teamOptions"
    label="Team"
    :loading="loading"
    multiple
    chips
    clearable
  />
</template>
