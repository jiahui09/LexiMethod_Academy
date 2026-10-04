import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Mic, Square, Trash2, MessageCircleQuestion, Lightbulb } from 'lucide-react';
import { Chip, Narration } from '@/components/ui/Bits';
import PageIntro from '@/components/layout/PageIntro';
import NeonButton from '@/components/ui/NeonButton';
import { feynmanTasks, feynmanTask } from '@/data/feynman';
import { methods } from '@/data/methods';
import { useProgress } from '@/store/progressStore';
import { evaluateAchievements } from '@/lib/achievements';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

/** 自评量表 4 项（费曼学习法：讲规则 / 举例子 / 说例外 / 答追问） */
const SELF_ITEMS = [
  '我讲清了规则本身，不是照抄术语',
  '我给出了 3 个具体例子',
  '我点出了 1 个例外或易错点',
  '我能答上同学的追问',
];

/** 判定阈值 */
const KEYWORD_NEED = 4; // 关键词命中数
const EXAMPLE_WORD_NEED = 3; // 例子里至少几个英文词
const SELF_SCORE_NEED = 14; // 自评总分（满分 20）
const PASS_HITS = 3; // 4 项要求至少达标几项

const EXCEPTION_RE = /例外|误区|易错|注意|避免|不要|不能|反而|but|except|however|careful/i;

type Check = { key: string; label: string; ok: boolean; detail: string };

type Result = {
  checks: Check[];
  hits: string[];
  missing: string[];
  score: number;
  passed: boolean;
};

function judge(text: string, keywords: string[], score: number, rated: boolean): Result {
  const lower = text.toLowerCase();
  const hits = keywords.filter((k) => lower.includes(k.toLowerCase()));
  const missing = keywords.filter((k) => !hits.includes(k));
  const exampleWords = [...new Set(text.match(/[A-Za-z]{3,}/g) ?? [])];
  const hasException = EXCEPTION_RE.test(text);
  const selfOk = rated && score >= SELF_SCORE_NEED;

  const checks: Check[] = [
    {
      key: 'rule',
      label: '1. 讲清规则（关键词）',
      ok: hits.length >= KEYWORD_NEED,
      detail: `命中 ${hits.length}/${keywords.length}，至少要 ${KEYWORD_NEED} 个`,
    },
    {
      key: 'example',
      label: '2. 举出 3 个例子',
      ok: exampleWords.length >= EXAMPLE_WORD_NEED,
      detail: `识别到 ${exampleWords.length} 个英文例子词（如 ${exampleWords.slice(0, 3).join('、') || '—'}）`,
    },
    {
      key: 'exception',
      label: '3. 说明 1 个例外 / 误区',
      ok: hasException,
      detail: hasException ? '检测到例外或易错点的表述' : '没有出现“例外 / 误区 / 注意”这类提示',
    },
    {
      key: 'self',
      label: '4. 自评达标',
      ok: selfOk,
      detail: selfOk ? `自评 ${score}/20` : rated ? `自评只有 ${score}/20，低于 ${SELF_SCORE_NEED}` : '请先完成自评量表',
    },
  ];

  return {
    checks,
    hits,
    missing,
    score,
    passed: checks.filter((c) => c.ok).length >= PASS_HITS,
  };
}

/** 费曼关：用自己的话把刚学的规则讲出来，通过四项检查与自评 */
export default function Feynman() {
  const tier = useMotionTier();
  const [params, setParams] = useSearchParams();
  const progress = useProgress();
  const recordFeynman = useProgress((s) => s.recordFeynman);

  const [methodId, setMethodId] = useState(() => {
    const q = params.get('method');
    return feynmanTask(q) ? (q as string) : feynmanTasks[0].methodId;
  });
  const task = useMemo(() => feynmanTask(methodId) ?? feynmanTasks[0], [methodId]);

  const [text, setText] = useState('');
  const [ratings, setRatings] = useState<number[]>([0, 0, 0, 0]);
  const [result, setResult] = useState<Result | null>(null);
  const [showModel, setShowModel] = useState(false);
  const [unlocked, setUnlocked] = useState<string | null>(null);

  // 录音（仅存内存，关闭即销毁；不写入 localStorage，也不上传）
  const [recUrl, setRecUrl] = useState<string | null>(null);
  const [recMs, setRecMs] = useState(0);
  const [recState, setRecState] = useState<'idle' | 'recording' | 'denied' | 'unsupported'>('idle');
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startAtRef = useRef(0);

  useEffect(() => {
    return () => {
      recRef.current?.state === 'recording' && recRef.current.stop();
      if (recUrl) URL.revokeObjectURL(recUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rated = ratings.every((r) => r > 0);
  const score = ratings.reduce((a, b) => a + b, 0);
  const records = progress.feynmanRecords ?? [];
  const passedCount = records.filter((r) => r.passed).length;

  const switchMethod = (id: string) => {
    setMethodId(id);
    setResult(null);
    setShowModel(false);
    setParams({ method: id }, { replace: true });
  };

  const startRec = async () => {
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setRecState('unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      startAtRef.current = Date.now();
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        setRecMs(Date.now() - startAtRef.current);
        setRecUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setRecState('idle');
      };
      mr.start();
      recRef.current = mr;
      setRecState('recording');
    } catch {
      // 无麦克风 / 拒绝授权：降级为纯文字讲解，不打断流程
      setRecState('denied');
    }
  };

  const stopRec = () => {
    if (recRef.current && recRef.current.state === 'recording') recRef.current.stop();
  };

  const submit = () => {
    if (!text.trim()) return;
    const r = judge(text, task.keywords, score, rated);
    setResult(r);
    setShowModel(!r.passed);
    recordFeynman({ methodId, hits: r.hits.length, total: task.keywords.length, score, passed: r.passed, text: text.slice(0, 1500) });
    const newBadges = evaluateAchievements();
    setUnlocked(newBadges.includes('feynman1') ? '讲得出，才算会' : null);
    playSfx(r.passed ? 'complete' : 'wrong');
  };

  const anim = tier === 'off' ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        crumbs={[
          { label: '学习地图', to: '/' },
          { label: '方法课程', to: '/methods' },
          { label: '费曼关' },
        ]}
        kicker="Feynman Gate"
        title="费曼关：讲得出来，才算学会"
        desc="学完一课，用自己的话把规则讲一遍——讲解会在“提取”阶段暴露假记忆。四项检查 + 自评量表都过关，掌握标准才加上费曼这一项。讲解只存在于本次会话（零存储）。"
        next={{ label: '复习中心', to: '/review' }}
      />

      {/* 课次选择 */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="选择要讲解的课次">
        {feynmanTasks.map((t, i) => (
          <Chip key={t.methodId} active={t.methodId === methodId} onClick={() => switchMethod(t.methodId)}>
            {i + 1}. {methods.find((m) => m.id === t.methodId)?.title.split('：')[0] ?? t.methodId}
          </Chip>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* 左：讲解区 */}
        <motion.section className="glass p-5 md:p-6" {...anim}>
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neon">讲解任务</div>
              <p className="mt-1 text-sm text-slate-200">{task.prompt}</p>
            </div>
            <span className="shrink-0 rounded-full border border-white/12 px-2.5 py-1 text-[10px] text-slate-400">
              已通过 {passedCount} 次
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {task.keywords.map((k) => (
              <span
                key={k}
                data-kw={k}
                className={`rounded-full border px-2.5 py-1 text-[11px] ${
                  result
                    ? result.hits.includes(k)
                      ? 'border-success/60 bg-success/10 text-success'
                      : 'border-danger/50 bg-danger/10 text-danger'
                    : 'border-neon/40 bg-neon/10 text-neon'
                }`}
              >
                {k}
                {result && (result.hits.includes(k) ? ' ✓' : ' ✗')}
              </span>
            ))}
          </div>

          <div className="mt-3 grid gap-1.5 text-xs text-slate-400">
            <span>· {task.exampleHint}</span>
            <span>· {task.exceptionHint}</span>
          </div>

          <label className="mt-4 block text-xs font-semibold text-slate-300" htmlFor="feynman-text">
            你的讲解（建议 60~150 字，口语化即可）
          </label>
          <textarea
            id="feynman-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder="例如：单词是声音块不是字母串，每个音节里必须有一个元音核心……"
            className="mt-1.5 w-full resize-y rounded-2xl border border-white/12 bg-white/[0.04] p-3.5 text-sm leading-relaxed text-slate-100 outline-none transition focus:border-neon/60"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>已输入 {text.trim().length} 字</span>
            <span>要求：关键词 ≥ {KEYWORD_NEED} · 例子词 ≥ {EXAMPLE_WORD_NEED} · 自评 ≥ {SELF_SCORE_NEED}/20</span>
          </div>

          {/* 录音：可选，仅内存 */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mic size={14} aria-hidden /> 录音（可选）：录下你的讲解自己听一遍，不满意就重录。
            </div>
            <div className="flex items-center gap-2">
              {recState !== 'recording' ? (
                <NeonButton size="sm" variant="ghost" onClick={startRec}>
                  <Mic size={13} aria-hidden /> 开始录音
                </NeonButton>
              ) : (
                <NeonButton size="sm" onClick={stopRec}>
                  <Square size={13} aria-hidden /> 停止录音
                </NeonButton>
              )}
              {recUrl && (
                <>
                  <audio src={recUrl} controls className="h-8 max-w-[220px]" aria-label="录音回放" />
                  <button
                    type="button"
                    aria-label="销毁录音"
                    className="rounded-lg border border-white/12 p-1.5 text-slate-400 transition hover:border-danger/50 hover:text-danger"
                    onClick={() => {
                      URL.revokeObjectURL(recUrl);
                      setRecUrl(null);
                      setRecMs(0);
                    }}
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                </>
              )}
            </div>
            {recState === 'denied' && (
              <span className="w-full text-[11px] text-warn">未获得麦克风权限，已降级为纯文字讲解；你仍可正常通过费曼关。</span>
            )}
            {recState === 'unsupported' && (
              <span className="w-full text-[11px] text-warn">当前浏览器不支持录音，改用文字讲解即可。</span>
            )}
            {recMs > 0 && recState === 'idle' && <span className="text-[11px] text-slate-500">本段录音 {(recMs / 1000).toFixed(1)}s，仅保存在内存</span>}
          </div>

          {/* 自评量表 */}
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Lightbulb size={14} className="text-warn" aria-hidden /> 自评量表（1 = 完全没有，5 = 可以教别人）
            </div>
            <div className="flex flex-col gap-2">
              {SELF_ITEMS.map((label, i) => (
                <div key={label} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                  <span className="text-xs text-slate-300">{label}</span>
                  <div className="flex gap-1" role="group" aria-label={label}>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        data-rate={v}
                        data-item={i}
                        aria-label={`${label}：${v} 分`}
                        aria-pressed={ratings[i] === v}
                        onClick={() => {
                          playSfx('tick');
                          setRatings((r) => r.map((x, idx) => (idx === i ? v : x)));
                        }}
                        className={`h-7 w-7 rounded-lg border text-xs transition ${
                          ratings[i] === v
                            ? 'border-neon bg-neon/20 text-neon shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                            : 'border-white/12 text-slate-400 hover:border-neon/50'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <NeonButton onClick={submit} disabled={!text.trim()} className="disabled:cursor-not-allowed disabled:opacity-40">
              提交费曼关
            </NeonButton>
            <span className="text-xs text-slate-500">自评 {score}/20{rated ? '' : '（尚未全部评分）'}</span>
          </div>
        </motion.section>

        {/* 右：检查结果 / 对照 / 追问 / 历史 */}
        <motion.section className="flex flex-col gap-4" {...anim}>
          {!result && (
            <div className="glass p-5 text-sm leading-relaxed text-slate-400">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white">
                <MessageCircleQuestion size={14} className="text-neon" aria-hidden /> 还没有提交
              </div>
              四项要求里至少达标 3 项即通过：讲清规则、举出 3 个例子、说明 1 个例外、自评达标。
              未通过不会扣分，但会给出标准解释对照，请照着再讲一遍。
            </div>
          )}

          {result && (
            <div
              className={`glass p-5 ${result.passed ? 'border-[rgba(0,230,118,0.45)] shadow-[0_0_26px_rgba(0,230,118,0.16)]' : 'border-[rgba(255,77,109,0.35)]'}`}
            >
              <div className={`mb-3 font-display text-lg font-bold ${result.passed ? 'text-success' : 'text-danger'}`}>
                {result.passed ? '费曼关通过 ✓ 掌握标准 +1' : '还差一点 —— 请对照标准解释再讲一遍'}
              </div>
              <ul className="flex flex-col gap-2">
                {result.checks.map((c) => (
                  <li key={c.key} className="flex items-start gap-2 text-sm">
                    <span className={`mt-0.5 ${c.ok ? 'text-success' : 'text-danger'}`}>{c.ok ? <Check size={15} aria-hidden /> : <X size={15} aria-hidden />}</span>
                    <span className={c.ok ? 'text-slate-200' : 'text-slate-400'}>
                      <b className="font-semibold">{c.label}</b>
                      <span className="block text-xs text-slate-500">{c.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-xs text-slate-500">
                关键词命中 {result.hits.length}/{task.keywords.length}
                {result.missing.length > 0 && <>，还差：<b className="text-warn">{result.missing.join('、')}</b></>}
              </div>
              {unlocked && <div className="mt-3 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2 text-xs text-warn">新成就解锁：{unlocked}</div>}
              <button
                type="button"
                onClick={() => setShowModel((v) => !v)}
                className="mt-3 text-xs text-neon underline underline-offset-4 hover:text-white"
              >
                {showModel ? '收起标准解释对照' : '看标准解释对照'}
              </button>
            </div>
          )}

          {showModel && (
            <Narration text={task.modelAnswer} className="text-xs" />
          )}

          <div className="glass p-5">
            <div className="mb-2 text-xs font-semibold text-white">虚拟学生的追问（可以试着口头回答）</div>
            <ul className="flex flex-col gap-2 text-sm text-slate-300">
              {task.studentQuestions.map((q) => (
                <li key={q} className="flex gap-2">
                  <span className="text-neon">Q</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {records.length > 0 && (
            <div className="glass p-5">
              <div className="mb-2 text-xs font-semibold text-white">最近的讲解记录</div>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-400">
                {records.slice(0, 5).map((r) => (
                  <li key={r.at} className="flex items-center justify-between gap-2">
                    <span className="truncate">{new Date(r.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {r.methodId}</span>
                    <span className={r.passed ? 'text-success' : 'text-warn'}>
                      {r.passed ? '通过' : '未过'} · 关键词 {r.hits}/{r.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
