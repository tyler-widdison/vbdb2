<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { LiveMatch } from "../composables/useLive";
import type { ResultMatch } from "../composables/useResults";
import type { ScheduleMatch } from "../composables/useSchedule";

type MatchType = LiveMatch | ResultMatch | ScheduleMatch;

const props = defineProps<{
  showStatusFilters?: boolean;
  title?: string;
  availableMatches?: readonly MatchType[] | null;
  titleCaption?: string;
}>();

const divisionFilterRef = ref();
const conferenceFilterRef = ref();
const teamFilterRef = ref();
const { smAndDown } = useDisplay();

const selectedDivision = computed(
  () => divisionFilterRef.value?.selectedDivision ?? null
);
const selectedConference = computed(
  () => conferenceFilterRef.value?.selectedConference ?? null
);
const selectedTeam = computed(() => teamFilterRef.value?.selectedTeam ?? null);

const getDefaultStatusFilters = () => {
  const now = new Date();
  const mdtOffset = -6;
  const utcHour = now.getUTCHours();
  const mdtHour = (utcHour + mdtOffset + 24) % 24;

  if (mdtHour >= 2 && mdtHour <= 14) {
    return {
      live: false,
      completed: false,
      upcoming: true,
    };
  } else {
    return {
      live: true,
      completed: false,
      upcoming: false,
    };
  }
};

const statusFilters = ref(getDefaultStatusFilters());

defineExpose({
  selectedDivision,
  selectedConference,
  selectedTeam,
  statusFilters,
});
</script>

<template>
  <v-card class="mb-4">
    <div class="d-flex align-center">
      <v-card-title class="pb-0">
        {{ title }}
      </v-card-title>
      <v-card-subtitle class="mt-3">
        {{ titleCaption }}
      </v-card-subtitle>
    </div>
    <v-card-text class="pt-2">
      <v-row dense :no-gutters="smAndDown ? true : false" class="pa-0">
        <v-col
          :class="smAndDown ? 'px-1 py-1' : ''"
          :cols="smAndDown ? 6 : 12"
          md="4"
        >
          <DivisionFilter ref="divisionFilterRef" />
        </v-col>
        <v-col
          :class="smAndDown ? 'px-1 py-1' : ''"
          :cols="smAndDown ? 6 : 12"
          md="4"
        >
          <ConferenceFilter
            ref="conferenceFilterRef"
            :selected-division="selectedDivision"
            :available-matches="availableMatches"
          />
        </v-col>
        <v-col
          :class="smAndDown ? 'px-1 py-1' : ''"
          :cols="smAndDown ? 6 : 12"
          md="4"
        >
          <TeamFilter
            ref="teamFilterRef"
            :selected-division="selectedDivision"
            :selected-conference="selectedConference"
            :available-matches="availableMatches"
          />
        </v-col>
      </v-row>

      <div v-if="showStatusFilters" class="d-flex align-center">
        <v-checkbox v-model="statusFilters.live" label="Live" class="mx-2" />
        <v-checkbox
          v-model="statusFilters.completed"
          label="Completed"
          class="mx-2"
        />
        <v-checkbox
          v-model="statusFilters.upcoming"
          label="Upcoming"
          class="mx-2"
        />
      </div>
    </v-card-text>
  </v-card>
</template>
