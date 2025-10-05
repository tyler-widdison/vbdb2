import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";

export default defineVuetifyConfiguration({
  theme: {
    defaultTheme: "dark",
  },
  defaults: {
    VAvatar: {
      tile: true,
    },
    VCard: {
      rounded: "lg",
    },
    VBtn: {
      rounded: "lg",
      variant: "outlined",
    },
    VAutocomplete: {
      rounded: true,
      variant: "outlined",
      density: "compact",
      hideDetails: true,
    },
    VCheckbox: {
      hideDetails: true,
      density: "compact",
    },
    VTextField: {
      rounded: true,
      variant: "outlined",
      density: "compact",
      hideDetails: true,
      clearable: true,
    },
  },
});
