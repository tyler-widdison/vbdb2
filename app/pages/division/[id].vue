<script setup lang="ts">
const route = useRoute();
const division = route.params.id as string;

const { getDivisionSeo } = useVolleyballSeo();
const seo = getDivisionSeo(division);

useHead({
  title: seo.title,
  meta: [
    { name: "description", content: seo.description },
    { name: "keywords", content: seo.keywords },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SportsOrganization',
        name: `${division} Volleyball`,
        sport: 'Volleyball',
        description: seo.description,
      }),
    },
  ],
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>{{ division }} Volleyball</h1>
        <p>{{ seo.description }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>
