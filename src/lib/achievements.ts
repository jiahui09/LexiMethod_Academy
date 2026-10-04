import { achievements } from '@/data/achievements';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';

/**
 * 成就评估：根据当前进度/复习/训练数据判定 17 枚徽章
 * 每次答题、完成步骤、标记音标、结束复习、通过费曼关后调用；返回本次新解锁的成就 id。
 */
export function evaluateAchievements(): string[] {
  const p = useProgress.getState();
  const r = useReview.getState();

  const totalSteps = Object.values(p.completedSteps).reduce((acc, arr) => acc + arr.length, 0);
  const typeStats = Object.values(p.stats);
  const attempts = typeStats.reduce((a, s) => a + (s?.total ?? 0), 0);
  const correct = typeStats.reduce((a, s) => a + (s?.correct ?? 0), 0);

  const cond: Record<string, boolean> = {
    start: p.xp > 0,
    step5: totalSteps >= 5,
    method1: p.completedMethods.length >= 1,
    phoneme10: p.phonemesLearned.length >= 10,
    streak3: p.streakCurrent >= 3,
    streak7: p.streakCurrent >= 7,
    streak14: p.streakLongest >= 14,
    perfect: attempts >= 20 && correct / attempts >= 0.9,
    combo10: p.bestCombo >= 10,
    analyze10: p.analyzedWords.length >= 10,
    dictation20: p.labDictationCount >= 20,
    review10: r.reviewed >= 10,
    'all-methods': p.completedMethods.length >= 8,
    phoneme48: p.phonemesLearned.length >= 48,
    practice100: attempts >= 100,
    'lab-master': p.phonemesLearned.length >= 48 && p.labDictationCount >= 20,
    feynman1: (p.feynmanRecords ?? []).some((rec) => rec.passed),
  };

  const unlocked: string[] = [];
  for (const a of achievements) {
    if (!cond[a.id]) continue;
    if (useProgress.getState().achievements.includes(a.id)) continue;
    if (useProgress.getState().unlockAchievement(a.id)) unlocked.push(a.id);
  }
  return unlocked;
}
