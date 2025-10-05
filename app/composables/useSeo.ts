export const useVolleyballSeo = () => {
  const divisionKeywords = {
    'D-I': [
      'NCAA Division I Women\'s Volleyball',
      'NCAA Division I Volleyball',
      'D1 Women\'s Volleyball',
      'D1 Volleyball',
      'NCAA DI Women\'s Volleyball',
      'NCAA DI Volleyball',
    ],
    'D-II': [
      'NCAA Division II Women\'s Volleyball',
      'NCAA Division II Volleyball',
      'D2 Women\'s Volleyball',
      'D2 Volleyball',
      'NCAA DII Women\'s Volleyball',
      'NCAA DII Volleyball',
    ],
    'D-III': [
      'NCAA Division III Women\'s Volleyball',
      'NCAA Division III Volleyball',
      'D3 Women\'s Volleyball',
      'D3 Volleyball',
      'NCAA DIII Women\'s Volleyball',
      'NCAA DIII Volleyball',
    ],
    'NAIA': [
      'NAIA Women\'s Volleyball',
      'NAIA Volleyball',
      'NAIA College Volleyball',
    ],
    'CCCAA': [
      'CCCAA Women\'s Volleyball',
      'CCCAA Volleyball',
      'California Community College Women\'s Volleyball',
      'California Community College Volleyball',
    ],
    'NJCAA D-1': [
      'NJCAA Division I Women\'s Volleyball',
      'NJCAA Division I Volleyball',
      'NJCAA DI Women\'s Volleyball',
      'NJCAA DI Volleyball',
    ],
    'NJCAA D-2': [
      'NJCAA Division II Women\'s Volleyball',
      'NJCAA Division II Volleyball',
      'NJCAA DII Women\'s Volleyball',
      'NJCAA DII Volleyball',
    ],
    'NJCAA D-3': [
      'NJCAA Division III Women\'s Volleyball',
      'NJCAA Division III Volleyball',
      'NJCAA DIII Women\'s Volleyball',
      'NJCAA DIII Volleyball',
    ],
  }

  const baseKeywords = [
    'Women\'s College Volleyball',
    'College Volleyball',
    'Girls College Volleyball',
    'College Volleyball Scores',
    'College Volleyball Schedule',
    'College Volleyball Teams',
    'Live College Volleyball',
  ]

  const getDivisionSeo = (division: string) => {
    const keywords = divisionKeywords[division as keyof typeof divisionKeywords] || []
    return {
      title: `${division} Volleyball - Scores, Schedule & Teams`,
      description: `Complete ${division} volleyball coverage including live scores, schedules, team stats, and standings. Your source for ${keywords[0] || 'college volleyball'}.`,
      keywords: [...keywords, ...baseKeywords].join(', '),
    }
  }

  const getHomeSeo = () => {
    const allKeywords = Object.values(divisionKeywords).flat()
    const newsKeywords = [
      'College Volleyball News',
      'NCAA Volleyball News',
      'NAIA Volleyball News',
      'NJCAA Volleyball News',
      'College Volleyball Updates',
      'Volleyball Rankings',
      'College Volleyball Power Rankings',
    ]
    return {
      title: 'College Volleyball Database - NCAA, NAIA, NJCAA & CCCAA Scores & News',
      description: 'Your complete source for college volleyball scores, schedules, team information, and latest news across NCAA D-I, D-II, D-III, NAIA, NJCAA, and CCCAA divisions.',
      keywords: [...allKeywords, ...baseKeywords, ...newsKeywords].join(', '),
    }
  }

  const getConferenceSeo = (conference: string, division?: string) => {
    const divisionText = division ? `${division} ` : ''
    return {
      title: `${conference} ${divisionText}Volleyball - Teams, Scores & Schedule`,
      description: `Complete ${conference} ${divisionText}volleyball coverage including teams, scores, schedules, and standings. Your source for ${conference} volleyball.`,
      keywords: `${conference}, ${conference} volleyball, ${conference} women's volleyball, ${conference} teams, ${conference} scores, ${conference} schedule`,
    }
  }

  const getTeamSeo = (teamName: string, division: string, conference: string) => {
    return {
      title: `${teamName} Volleyball - ${division} ${conference}`,
      description: `${teamName} volleyball team information, roster, schedule, and scores. Member of ${conference} in ${division}.`,
      keywords: `${teamName}, ${teamName} volleyball, ${teamName} women's volleyball, ${division}, ${conference}`,
    }
  }

  return {
    getDivisionSeo,
    getHomeSeo,
    getConferenceSeo,
    getTeamSeo,
    divisionKeywords,
    baseKeywords,
  }
}
