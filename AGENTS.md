# Agent Guidelines for vbdb

## Build/Test Commands

- **Dev**: `bun run dev` (or `npm run dev`)
- **Build**: `bun run build`
- **Typecheck**: `bun run typecheck`
- **Preview**: `bun run preview`
- No test framework configured yet

## Stack

- Nuxt 4 + Vue 3 + TypeScript + Vuetify 3
- Package manager: bun (bun.lock present)
- API: `https://api.volleyballdatabased.com` (teams, live matches, results, schedule, news)

## Architecture

- **SSR Enabled**: All data fetched server-side for SEO
- **Composables**: `useTeams`, `useLive`, `useResults`, `useSchedule`, `useNews`, `useVolleyballSeo` for shared state; all accept division parameter (default: 'D-I')
- **Division-based API**: Backend uses `?division={division}` parameter; composables fetch data per division for performance
- **Caching**: `useFetch` with keys for automatic caching; optimized for large datasets with dedupe, getCachedData, and deep: false
- **Auto-refresh**: Live matches refresh every 30 seconds client-side
- **Filters**: Multi-select for Division/Conference/Team with cascading logic; work across live, results, and schedule pages; when single division selected, composables fetch that division's data

## Code Style

- **TypeScript**: Strict mode enabled, use `noUncheckedIndexedAccess`
- **Imports**: Use Nuxt auto-imports; alias `~` or `@` for app directory
- **Components**: Place in `components/` for auto-import
- **Composables**: Place in `composables/` for auto-import; use `useFetch` with `lazy: true`, `server: true`, and unique keys; accept division parameter as `Ref<string>` with default 'D-I'
- **Vue SFC**: Use `<script setup lang="ts">` with Composition API
- **Module**: ESNext with `module: "preserve"`
- **Naming**: kebab-case for files/components, camelCase for functions/variables
- **Types**: Always provide explicit return types for exported functions; export interfaces from composables
- **Comments**: DO NOT ADD COMMENTS unless explicitly requested

## SEO Requirements

- **SSR Enabled**: Server-side rendering enabled for proper SEO and faster initial page loads
- **Meta Tags**: Every page must have title, description, keywords via `useHead()`
- **Open Graph**: Use `useSeoMeta()` for Open Graph and Twitter Card tags on all pages
- **Canonical URLs**: Add canonical link tags via `useHead({ link: [{ rel: 'canonical', href: ... }] })`
- **Structured Data**: Add JSON-LD via `useHead({ script: [{ type: 'application/ld+json', innerHTML: ... }] })`
- **Keywords**: Use `useVolleyballSeo()` composable for consistent SEO metadata
- **Performance**: Shared fetch state, client-side filtering, lazy loading for fast Core Web Vitals

## Composables

- **useTeams(division: Ref<string> = ref('D-I'))**: Fetches team data for specific division via API; provides filtering by division/conference
- **useLive(division: Ref<string> = ref('D-I'))**: Fetches live matches for specific division via API; provides status detection (live/completed/upcoming) and filtering
- **useResults(division: Ref<string> = ref('D-I'))**: Fetches historical match results for specific division via API; optimized for large datasets with shallow reactivity (deep: false)
- **useSchedule()**: Fetches all upcoming matches; provides division/conference/team filtering client-side; optimized for large datasets with shallow reactivity (deep: false)
- **useNews()**: Fetches all news articles; provides division-based filtering, labels, and logos via getNewsByDivision method
- **useVolleyballSeo**: Provides consistent SEO metadata for divisions, conferences, teams

## Components

- **MatchCard**: Unified match display component supporting LiveMatch, ResultMatch, and ScheduleMatch with 2-column layout, pagination, and full match details; handles type detection with type guards (isResultMatch, isScheduleMatch)
- **BodyComponent**: Legacy card grid component (deprecated in favor of MatchCard)
- **PageHeader**: Unified filters (Division/Conference/Team) with optional status checkboxes; supports LiveMatch, ResultMatch, and ScheduleMatch types
- **Filters**: DivisionFilter, ConferenceFilter, TeamFilter - all support multiple selections with chips and work with unified match types
- **Vuetify Defaults**: v-card/v-btn rounded-lg, v-autocomplete rounded and outlined (set in vuetify.config.ts)

## Pages

- **index.vue**: Home page with latest news by division; displays division logos and article cards with images
- **live.vue**: Live scores with auto-refresh (30s), filtering, and MatchCard display
- **scores.vue**: Historical results with filtering and MatchCard display; optimized for large datasets
- **schedule.vue**: Upcoming match schedule with filtering and MatchCard display; optimized for large datasets
- **teams.vue**: Teams directory with v-data-table, search, division/conference filters, and AVCA rankings; optimized for large datasets
- **teams/[id].vue**: Team detail page with logo, metadata, record, results, and upcoming schedule using MatchCard; dynamic routing by team_id

## Performance Optimization

- **Division-based Loading**: All composables accept division parameter; default to 'D-I' for fast initial load; fetch other divisions on-demand
- **Large Datasets**: Use `useFetch` with `lazy: true`, `server: true`, `dedupe: "defer"`, `deep: false`, and `getCachedData`
- **Reactive Division Switching**: Watch division filter changes; when single division selected, update API division parameter to fetch only that division's data
- **Client-side Filtering**: Conference/team filtering happens client-side after division fetch to avoid redundant API calls
- **Pagination**: MatchCard paginates at 16 items per page (8 per column on desktop)
- **Type Guards**: Use `isResultMatch()` and `isScheduleMatch()` patterns to safely distinguish between LiveMatch, ResultMatch, and ScheduleMatch types
