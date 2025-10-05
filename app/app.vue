<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";

useHead({
  titleTemplate: '%s | VBDB',
  meta: [
    { name: 'theme-color', content: '#1976d2' },
  ],
});

useSeoMeta({
  ogSiteName: 'College Volleyball Database',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <v-app>
    <AppHeader />

    <v-main class="main-content">
      <NuxtPage />
    </v-main>

    <!-- <AppFooter /> -->
  </v-app>
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 64px - 56px);
}
</style>
