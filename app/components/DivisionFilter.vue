<script setup lang="ts">
const selectedDivision = ref<string[]>(['D-I'])

const divisionOptions = [
  { title: 'D-I', value: 'D-I' },
  { title: 'D-II', value: 'D-II' },
  { title: 'D-III', value: 'D-III' },
  { title: 'NAIA', value: 'NAIA' },
  { title: 'CCCAA', value: 'CCCAA' },
  { title: 'NJCAA D-1', value: 'NJCAA D-1' },
  { title: 'NJCAA D-2', value: 'NJCAA D-2' },
  { title: 'NJCAA D-3', value: 'NJCAA D-3' },
  { title: 'NCCAA', value: 'NCCAA' },
  { title: 'USCAA', value: 'USCAA' },
  { title: 'NWAC', value: 'NWAC' },
]

defineExpose({
  selectedDivision,
})
</script>

<template>
  <v-autocomplete
    v-model="selectedDivision"
    :items="divisionOptions"
    label="Division"
    multiple
    chips
    clearable
  />
</template>
