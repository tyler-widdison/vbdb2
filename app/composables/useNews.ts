export interface NewsArticle {
  title: string;
  link: string;
  division: string;
  pub_date: string | null;
  img: string;
}

export const useNews = () => {
  const {
    data: news,
    error,
    refresh,
    status,
  } = useFetch<NewsArticle[]>("https://api.volleyballdatabased.com/news", {
    key: "news-data",
    lazy: true,
    server: true,
    dedupe: "defer",
    deep: false,
    getCachedData(key) {
      return useNuxtApp().payload.data[key] || useNuxtApp().static.data[key];
    },
  });

  const fetchNews = async (): Promise<NewsArticle[]> => {
    if (!news.value) {
      await refresh();
    }

    if (error.value) {
      console.error("Failed to fetch news:", error.value);
      return [];
    }

    return news.value || [];
  };

  const getNewsByDivision = (division: string): NewsArticle[] => {
    if (!news.value) return [];
    return news.value.filter((article) => article.division === division);
  };

  const getDivisionLabel = (division: string): string => {
    const labels: Record<string, string> = {
      "1": "NCAA Division I",
      "2": "NCAA Division II",
      "3": "NCAA Division III",
      naia: "NAIA",
      njcaa: "NJCAA",
      "3c2asports": "CCCAA",
    };
    return labels[division] || division;
  };

  const getDivisionLogo = (
    division: string
  ): { url: string; width: number } => {
    const logos: Record<string, { url: string; width: number }> = {
      "1": {
        url: "https://content.sportslogos.net/logos/85/5463/full/national_collegiate_athletic_association_logo_secondary_2021_sportslogosnet-4441.png",
        width: 120,
      },
      "2": {
        url: "https://content.sportslogos.net/logos/85/5463/full/national_collegiate_athletic_association_logo_secondary_2021_sportslogosnet-4441.png",
        width: 120,
      },
      "3": {
        url: "https://content.sportslogos.net/logos/85/5463/full/national_collegiate_athletic_association_logo_secondary_2021_sportslogosnet-4441.png",
        width: 120,
      },
      naia: {
        url: "https://naiastats.prestosports.com/assets/images/NAIA_Bridge_logo_whiteR.png",
        width: 120,
      },
      njcaa: {
        url: "https://www.njcaa.org/images/setup/footer-logo-njcaa.png?max_width=auto&max_height=auto&crop=false",
        width: 120,
      },
      "3c2asports": {
        url: "https://www.cccaasports.org/assets/Alternative_Logo.png",
        width: 120,
      },
    };
    return logos[division] || { url: "", width: 40 };
  };

  return {
    news: readonly(news),
    fetchNews,
    getNewsByDivision,
    getDivisionLabel,
    getDivisionLogo,
    refresh,
    status,
  };
};
