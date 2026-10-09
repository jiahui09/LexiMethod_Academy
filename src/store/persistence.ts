/**
 * 站内本机存储（P0-2，用户已拍板：推翻旧「零存储」条款）。
 *
 * 纪律：
 * - 只写浏览器本机 localStorage，**永不上行、不追踪、不发任何网络请求**；
 * - 键名带版本号，schema 变了就换版本，旧键直接丢弃；
 * - 是否持久化由 `settingsStore.persistProgress`（默认开）控制；
 * - 关闭开关 = 立即删除已存的进度/错题数据（本会话内存态保留，但刷新即归零）；
 * - `leximethod.prefs.v1` 只存这一个开关本身（否则关不掉），不含任何学习数据。
 */

export const PROGRESS_KEY = 'leximethod.progress.v1';
export const REVIEW_KEY = 'leximethod.review.v1';
/** 只存 { persistProgress } 的偏好键——关闭进度持久化时也保留，否则开关无法持久 */
export const PREFS_KEY = 'leximethod.prefs.v1';

/* 仅浏览器：Node（check:data / 构建期导入 store）里 typeof localStorage 可能存在但不可用，必须同时有 window */
const hasLS = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

export function readJSON<T>(key: string): T | null {
  if (!hasLS()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown): void {
  if (!hasLS()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 配额满 / 隐私模式：静默失败，站内内存态照常工作 */
  }
}

export function removeKey(key: string): void {
  if (!hasLS()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** 开关读取：默认开（学习进度应当跨会话保留） */
export function readPersistPref(): boolean {
  const prefs = readJSON<{ persistProgress?: boolean }>(PREFS_KEY);
  return prefs?.persistProgress !== false;
}

export function writePersistPref(on: boolean): void {
  writeJSON(PREFS_KEY, { persistProgress: on });
}

/** 删除全部学习数据键（含开关本身的偏好键，回到出厂默认） */
export function clearLocalData(): void {
  removeKey(PROGRESS_KEY);
  removeKey(REVIEW_KEY);
  removeKey(PREFS_KEY);
}

/** 关闭持久化时只清学习数据，保留开关本身 */
export function clearLearningData(): void {
  removeKey(PROGRESS_KEY);
  removeKey(REVIEW_KEY);
}

// ---------- 让各 store 注册「立即落盘」回调（开关打开时把当前内存态补写一次） ----------
type Saver = () => void;
const savers: Saver[] = [];

export function registerSaver(save: Saver): void {
  savers.push(save);
}

/** 立即把所有已注册 store 写入本机（设置页「开持久化」「清数据」后调用） */
export function saveAllNow(): void {
  for (const s of savers) s();
}
