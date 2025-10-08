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
    cloudflare: {
      pages: {
        routes: {
          include: ["/*"],
          exclude: ["/build/*", "/favicon.ico"],
        },
      },
    },
    experimental: {
      wasm: false,
    },
    minify: true,
    compatibilityDate: "2025-07-15",
    replace: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.ico" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
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
    vuetifyOptions: {
      ssr: true,
      treeshake: {
        components: true,
      },
    },
  },
});
