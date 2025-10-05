<script setup lang="ts">
const { getHomeSeo } = useVolleyballSeo();
const {
  news,
  fetchNews,
  getNewsByDivision,
  getDivisionLabel,
  getDivisionLogo,
} = useNews();
const { results, fetchResults } = useResults();
const { schedule, fetchSchedule } = useSchedule();
const { teams, fetchTeams } = useTeams();

await Promise.all([fetchNews(), fetchResults(), fetchSchedule(), fetchTeams()]);

const divisions = ["1", "2", "3", "naia", "njcaa", "3c2asports"];

const getDivisionStats = (division: string) => {
  const divisionMap: Record<string, string[]> = {
    "1": ["D-I"],
    "2": ["D-II"],
    "3": ["D-III"],
    naia: ["NAIA"],
    njcaa: ["NJCAA D-1", "NJCAA D-2", "NJCAA D-3"],
    "3c2asports": ["CCCAA"],
  };

  const divisionNames = divisionMap[division] || [];

  const teamsCount =
    teams.value?.filter((t) => divisionNames.includes(t.division)).length || 0;
  const matchesPlayed =
    results.value?.filter(
      (r) =>
        divisionNames.includes(r.team_1_division) ||
        divisionNames.includes(r.team_2_division)
    ).length || 0;
  const upcomingMatches =
    schedule.value?.filter(
      (s) =>
        (s.team_1_division && divisionNames.includes(s.team_1_division)) ||
        (s.team_2_division && divisionNames.includes(s.team_2_division))
    ).length || 0;

  return { teamsCount, matchesPlayed, upcomingMatches };
};

const newsByDivision = computed(() => {
  return divisions
    .map((division) => ({
      division,
      label: getDivisionLabel(division),
      logo: getDivisionLogo(division),
      articles: getNewsByDivision(division),
      stats: getDivisionStats(division),
    }))
    .filter((group) => group.articles.length > 0);
});

const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";

  try {
    const url = new URL(imageUrl);
    url.searchParams.set("max_width", "800");
    url.searchParams.set("max_height", "600");
    return url.toString();
  } catch (error) {
    console.warn("Failed to parse image URL:", error);
    return imageUrl;
  }
};

const seo = getHomeSeo();

useHead({
  title: seo.title,
  meta: [
    { name: "description", content: seo.description },
    { name: "keywords", content: seo.keywords },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "College Volleyball Database",
        description: seo.description,
        url: "https://volleyballdatabased.com",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://volleyballdatabased.com/teams?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }),
    },
  ],
});

useSeoMeta({
  ogTitle: seo.title,
  ogDescription: seo.description,
  ogType: 'website',
  ogUrl: 'https://volleyballdatabased.com',
  twitterTitle: seo.title,
  twitterDescription: seo.description,
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h6 text-center mb-2">VolleyballDatabased</h1>
        <p class="text-center text-medium-emphasis">
          Latest News from College Volleyball
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="divisionGroup in newsByDivision"
        :key="divisionGroup.division"
        cols="12"
        md="6"
      >
        <v-card class="h-100">
          <v-card-title class="d-flex align-center pa-4">
            <v-img
              :src="divisionGroup.logo.url"
              max-width="100"
              contain
              :alt="divisionGroup.label"
              class="mr-3 flex-shrink-0"
            />
            <div class="flex-grow-1">
              <div class="text-h6">{{ divisionGroup.label }}</div>
              <div class="text-caption text-medium-emphasis">
                {{ divisionGroup.stats.teamsCount }} teams ·
                {{ divisionGroup.stats.matchesPlayed }} matches played
              </div>
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-0">
            <div
              v-for="(article, index) in divisionGroup.articles.slice(0, 3)"
              :key="index"
            >
              <a
                :href="article.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-decoration-none"
              >
                <div class="pa-3 article-hover">
                  <v-row no-gutters align="center">
                    <v-col cols="7">
                      <v-img
                        v-if="article.img"
                        :src="getImageUrl(article.img)"
                        :alt="article.title"
                        cover
                        class="rounded"
                      />
                    </v-col>
                    <v-col class="pl-3">
                      <div class="text-body-2 font-weight-medium line-clamp-3">
                        {{ article.title }}
                      </div>
                      <div
                        v-if="article.pub_date"
                        class="text-caption text-medium-emphasis mt-1"
                      >
                        {{ new Date(article.pub_date).toLocaleDateString() }}
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </a>
              <v-divider
                v-if="index < Math.min(divisionGroup.articles.length, 3) - 1"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.article-hover {
  transition: background-color 0.2s;
}

.article-hover:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
