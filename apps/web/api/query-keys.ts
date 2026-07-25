export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  tests: {
    sessions: ["tests", "sessions"] as const,
    weakness: (testSessionId: string) =>
      ["tests", "weakness", testSessionId] as const,
    score: (testSessionId: string) =>
      ["tests", "score", testSessionId] as const,
    practice: (params: string) => ["tests", "practice", params] as const,
    practiceSection: (params: string) =>
      ["tests", "practice-section", params] as const,
  },
  questions: {
    list: (params: string) => ["questions", params] as const,
  },
  testResults: {
    list: (params: string) => ["test-results", params] as const,
    highest: ["test-results", "highest"] as const,
    improvement: ["test-results", "improvement"] as const,
    domainTrend: ["test-results", "domain-trend"] as const,
  },
  mistakes: {
    list: (params: string) => ["mistakes", params] as const,
    practice: (n: number) => ["mistakes", "practice", n] as const,
  },
  skillMastery: {
    list: ["skill-mastery"] as const,
    strengthsWeaknesses: ["skill-mastery", "strengths-weaknesses"] as const,
  },
  timeEfficiency: {
    list: ["time-efficiency"] as const,
    insights: ["time-efficiency", "insights"] as const,
  },
  analytics: {
    basic: ["analytics"] as const,
    advanced: (live: boolean) => ["analytics", "advanced", live] as const,
  },
  leaderboard: {
    main: (params: string) => ["leaderboard", params] as const,
    game: (type: string) => ["game-leaderboard", type] as const,
    league: (groupName: string) =>
      ["league", "leaderboard", groupName] as const,
  },
  gameRoom: {
    byId: (roomId: string) => ["gameroom", roomId] as const,
    profile: (userId: string) => ["gameroom", "profile", userId] as const,
  },
  gameHistory: {
    my: ["game-history", "my"] as const,
    myElo: (params: string) => ["game-history", "my-elo", params] as const,
    myXp: ["game-history", "my-xp"] as const,
    room: (roomId: string) => ["game-history", "room", roomId] as const,
  },
  history: {
    mine: ["history"] as const,
  },
  subscription: {
    mine: ["subscription", "my"] as const,
  },
  public: {
    profile: (username: string) => ["public", "profile", username] as const,
    legalList: ["public", "legal", "list"] as const,
    legalDoc: (key: string) => ["public", "legal", key] as const,
  },
  auditLogs: {
    list: (params: string) => ["audit-logs", params] as const,
  },
} as const
