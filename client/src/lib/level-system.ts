export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNext: number;
  progressPercentage: number;
}

export const LEVEL_THRESHOLDS = [
  { level: 1, title: "Beginner", min: 0, max: 500 },
  { level: 2, title: "Novice", min: 500, max: 1500 },
  { level: 3, title: "Developer", min: 1500, max: 3000 },
  { level: 4, title: "Expert", min: 3000, max: 5000 },
  { level: 5, title: "Master", min: 5000, max: Infinity }
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

  return {
    level: currentLevelData.level,
    title: currentLevelData.title,
    currentXP: totalXP,
    xpForCurrentLevel,
    xpForNextLevel: nextLevelData ? xpForNextLevel : totalXP,
    progressToNext,
    progressPercentage
  };
}

export function getLevelBenefits(level: number): string[] {
  const benefits = {
    1: ["Access to Variables & Data Types section", "Basic Python syntax learning"],
    2: ["Unlocked Operations section", "Advanced calculations and math"],
    3: ["Unlocked String Manipulation", "Real-world text processing"],
    4: ["Unlocked Control Flow", "Conditionals and decision making"],
    5: ["Master status achieved", "Access to all advanced features", "Exclusive Python challenges"]
  };
  return benefits[level as keyof typeof benefits] || [];
}

export function getNextLevelBenefits(level: number): string[] {
  return getLevelBenefits(level + 1);
}