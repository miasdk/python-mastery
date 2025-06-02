export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNext: number;
  progressPercentage: number;
  nextUnlock?: string;
  xpToNextUnlock?: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, title: "Beginner", min: 0, max: 200 },
  { level: 2, title: "Student", min: 200, max: 600 },
  { level: 3, title: "Learner", min: 600, max: 1200 },
  { level: 4, title: "Developer", min: 1200, max: 2000 },
  { level: 5, title: "Programmer", min: 2000, max: 3200 },
  { level: 6, title: "Expert", min: 3200, max: 5000 },
  { level: 7, title: "Master", min: 5000, max: Infinity }
];

export const XP_UNLOCKS = [
  { xp: 500, feature: "Detailed code analysis" },
  { xp: 600, feature: "Hard difficulty problems" },
  { xp: 1000, feature: "AI-powered hints" },
  { xp: 1200, feature: "Bonus algorithm challenges" },
  { xp: 1500, feature: "Performance optimization tips" },
  { xp: 2000, feature: "Interview preparation problems" },
  { xp: 2500, feature: "Career guidance features" },
  { xp: 3200, feature: "Advanced optimization challenges" },
  { xp: 5000, feature: "Exclusive Master problem sets" }
];

export function calculateLevel(totalXP: number): LevelInfo {
  const currentLevelData = LEVEL_THRESHOLDS.find(
    threshold => totalXP >= threshold.min && totalXP < threshold.max
  ) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const nextLevelData = LEVEL_THRESHOLDS.find(
    threshold => threshold.level === currentLevelData.level + 1
  );

  const xpForCurrentLevel = currentLevelData.min;
  const xpForNextLevel = nextLevelData ? nextLevelData.min : currentLevelData.max;
  const progressToNext = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min((progressToNext / xpNeededForNext) * 100, 100);

  // Find next unlock
  const nextUnlock = XP_UNLOCKS.find(unlock => unlock.xp > totalXP);

  return {
    level: currentLevelData.level,
    title: currentLevelData.title,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel: nextLevelData ? xpForNextLevel : totalXP,
    progressToNext,
    progressPercentage,
    nextUnlock: nextUnlock?.feature,
    xpToNextUnlock: nextUnlock ? nextUnlock.xp - totalXP : undefined
  };
}

export function getLevelBenefits(level: number): string[] {
  const benefits = {
    1: ["Access to basic problems", "Python fundamentals"],
    2: ["Access to all Easy problems", "Code validation features"],
    3: ["Unlock Hard difficulty problems", "Advanced debugging tools"],
    4: ["Unlock bonus algorithm challenges", "Code optimization features"],
    5: ["Unlock interview preparation problems", "Performance analysis tools"],
    6: ["Unlock advanced optimization challenges", "Expert-level debugging"],
    7: ["Exclusive Master problem sets", "Early access to new features", "Profile achievement badges"]
  };
  return benefits[level as keyof typeof benefits] || [];
}

export function getNextLevelBenefits(level: number): string[] {
  return getLevelBenefits(level + 1);
}