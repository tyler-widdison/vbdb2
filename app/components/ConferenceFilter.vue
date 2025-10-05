<script setup lang="ts">
import type { LiveMatch } from '../composables/useLive'
import type { ResultMatch } from '../composables/useResults'
import type { ScheduleMatch } from '../composables/useSchedule'

type MatchType = LiveMatch | ResultMatch | ScheduleMatch;

const props = defineProps<{
  selectedDivision?: string[]
  availableMatches?: readonly MatchType[] | null
}>()

const selectedConference = ref<string[]>([])
const conferenceOptions = ref<string[]>([])
const loading = ref(false)

const loadConferences = () => {
  loading.value = true
  try {
    if (!props.availableMatches || props.availableMatches.length === 0) {
      conferenceOptions.value = []
      return
    }

    const conferencesSet = new Set<string>()

    props.availableMatches.forEach(match => {
      if (match.team_1_division && match.team_1_conference && (!props.selectedDivision || props.selectedDivision.length === 0 || props.selectedDivision.includes(match.team_1_division))) {
        conferencesSet.add(match.team_1_conference)
      }
      if (match.team_2_division && match.team_2_conference && (!props.selectedDivision || props.selectedDivision.length === 0 || props.selectedDivision.includes(match.team_2_division))) {
        conferencesSet.add(match.team_2_conference)
      }
    })

    conferenceOptions.value = Array.from(conferencesSet).sort()
    console.log('Conference options:', conferenceOptions.value.length, 'for divisions:', props.selectedDivision)
  } catch (error) {
    console.error('Error loading conferences:', error)
  } finally {
    loading.value = false
  }
}

watch([() => props.selectedDivision, () => props.availableMatches], () => {
  selectedConference.value = []
  loadConferences()
}, { immediate: true, deep: true })

defineExpose({
  selectedConference,
})
</script>

<template>
  <v-autocomplete
    v-model="selectedConference"
    :items="conferenceOptions"
    label="Conference"
    :loading="loading"
    multiple
    chips
    clearable
  />
</template>
