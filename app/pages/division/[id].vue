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
  ],
  link: [
    {
      rel: "canonical",
      href: `https://volleyballdatabased.com/division/${division}`,
    },
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

useSeoMeta({
  ogTitle: seo.title,
  ogDescription: seo.description,
  ogType: "website",
  ogUrl: `https://volleyballdatabased.com/division/${division}`,
  twitterCard: "summary_large_image",
  twitterTitle: seo.title,
  twitterDescription: seo.description,
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
