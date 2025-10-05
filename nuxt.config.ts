export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: true,

  features: {
    inlineStyles: false,
    devLogs: false,
  },

  nitro: {
    preset: "cloudflare-pages",
    rollupConfig: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "en",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  site: {
    url: "https://volleyballdatabased.com",
    name: "College Volleyball Database",
    description:
      "Your complete source for college volleyball scores, schedules, team information, and latest news across NCAA D-I, D-II, D-III, NAIA, NJCAA, and CCCAA divisions.",
    defaultLocale: "en",
  },

  ogImage: {
    enabled: true,
  },

  sitemap: {
    enabled: true,
    strictNuxtContentPaths: true,
  },

  robots: {
    enabled: true,
  },

  schemaOrg: {
    enabled: true,
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
  },

  css: [],
  modules: ["@nuxt/fonts", "vuetify-nuxt-module"],

  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        reloadOnFirstRequest: false,
        viewportSize: true,
        prefersColorScheme: false,

        prefersColorSchemeOptions: {
          useBrowserThemeOnly: false,
        },
      },

      styles: true,
    },
  },
});
