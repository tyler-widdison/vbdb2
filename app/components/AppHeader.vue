<script setup lang="ts">
const drawer = ref(false);
</script>

<template>
  <v-app-bar>
    <v-app-bar-title class="title-link" @click="$router.push('/')">
      VBDB
    </v-app-bar-title>

    <v-spacer />

    <div class="hidden-sm-and-down">
      <v-btn to="/">Home</v-btn>
      <v-btn to="/live">Live</v-btn>
      <v-btn to="/scores">Scores</v-btn>
      <v-btn to="/schedule">Schedule</v-btn>
      <v-btn to="/teams">Teams</v-btn>
    </div>

    <v-app-bar-nav-icon class="hidden-md-and-up" @click="drawer = !drawer" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" location="right" temporary>
    <v-list>
      <v-list-item to="/" title="Home" @click="drawer = false" />
      <v-list-item to="/live" title="Live" @click="drawer = false" />
      <v-list-item to="/scores" title="Scores" @click="drawer = false" />
      <v-list-item to="/schedule" title="Schedule" @click="drawer = false" />
      <v-list-item to="/teams" title="Teams" @click="drawer = false" />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.title-link {
  cursor: pointer;
  transition: opacity 0.2s;
}

.title-link:hover {
  opacity: 0.8;
}
</style>
