// src/lib/calculations.ts

/**
 * 授業コマ数と欠席上限を計算する
 */
export function calculateAbsenceLimit(
  credits: number,
  isHalfCourse: boolean,
  makeupClasses: number = 0,
  canceledClasses: number = 0
) {
  // 基本ルール: 1単位 = 15回(30コマ)
  const basePeriods = isHalfCourse ? (30 * credits) / 2 : 30 * credits;
  const totalPeriods = basePeriods + makeupClasses - canceledClasses;
  
  // 3分の1まで休むことが可能（切り捨て）
  const limit = Math.floor(totalPeriods / 3);
  
  return { totalPeriods, limit };
}

/**
 * 目標（60点）に到達するために、残りのテストで必要な「1回あたりの目標点数」を逆算する
 * @returns 必要な点数(0〜100)。nullの場合は落単確定。
 */
export function calculateRequiredTestScore(
  testWeight: number,
  reportWeight: number,
  totalTests: number,
  currentScores: number[],
  expectedReportScore: number // 100点満点での平常点予想
): number | null {
  const targetScore = 60; // 合格ライン

  // 平常点による獲得スコア
  const currentReportPoints = expectedReportScore * (reportWeight / 100);

  // これまでのテストによる獲得スコア
  const currentTestPoints = currentScores.reduce((sum, score) => {
    return sum + score * (testWeight / 100 / totalTests);
  }, 0);

  const currentTotal = currentReportPoints + currentTestPoints;
  const remainingPointsNeeded = targetScore - currentTotal;

  // すでに60点を超えている場合
  if (remainingPointsNeeded <= 0) return 0;

  const remainingTests = totalTests - currentScores.length;

  // 残りテストがないのに60点未満の場合（落単確定）
  if (remainingTests <= 0) return null;

  // 残りのテスト1回あたりに必要な素点（100点満点換算）
  const requiredScorePerTest = remainingPointsNeeded / ((testWeight / 100 / totalTests) * remainingTests);

  return requiredScorePerTest;
}