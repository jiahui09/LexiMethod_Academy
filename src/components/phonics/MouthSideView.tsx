import { motion } from 'framer-motion';
import type { Articulation } from '@/types';
import { useMotionTier } from '@/hooks/useMotionTier';

type Props = {
  geo: Articulation;
  voiced: boolean;
  playing?: boolean;
  /** 侧视图 + 正视口型 */
  showFront?: boolean;
};

/** 根据发音部位返回口腔内的“阻塞/摩擦点”坐标（侧视 viewBox 0 0 420 270） */
function closurePoint(place: Articulation['place']): [number, number] {
  switch (place) {
    case 'bilabial':
      return [70, 122];
    case 'labiodental':
      return [80, 128];
    case 'dental':
      return [96, 122];
    case 'alveolar':
      return [114, 116];
    case 'postalveolar':
      return [138, 110];
    case 'palatal':
      return [172, 104];
    case 'velar':
      return [232, 108];
    case 'glottal':
      return [266, 196];
    default:
      return [150, 112];
  }
}

/**
 * 口腔侧视图动画（辞书版式：印刷解剖图）：
 * - 下颌开合 / 唇形圆展 / 舌位高低前后（由 geo 参数驱动）——动画逻辑原样保留
 * - 气流粒子：肺 → 咽 → 口腔/鼻腔；受阻点聚集，摩擦缝挤出
 * - 声带振动：浊音脉冲，清音静止
 * 配色：墨 = 轮廓，结构蓝 = 器官/结构标注，批注红 = 气流与发音焦点；无发光、无模糊、无渐变。
 */
export default function MouthSideView({ geo, voiced, playing = true, showFront = true }: Props) {
  const tier = useMotionTier();
  const dur = tier === 'off' ? 0 : 0.55;

  const jawY = geo.jawOpen * 22;
  const tongueX = (geo.tongueFront - 0.5) * 46; // 前 → 左移（更靠近牙齿）
  const tongueY = -geo.tongueHigh * 34;
  const tongueScaleY = 0.8 + geo.tongueHigh * 0.5;
  const lipOut = geo.lipRound * 14;
  const closure = geo.closure ?? 0;

  const [cx, cy] = closurePoint(geo.place);
  const nasalFlow = Boolean(geo.nasal);

  // 气流路径：气管 → 咽 → （鼻腔 | 口腔）→ 出口
  const oralPath = `M 268 268 L 268 205 C 268 170, 258 150, 236 138 C 190 122, 130 122, 92 126 L ${64 - lipOut} 124`;
  const nasalPath = `M 268 268 L 268 205 C 268 168, 252 146, 232 132 C 210 116, 196 96, 170 88 C 130 76, 92 80, 68 84`;
  const blockedPath = `M 268 268 L 268 205 C 268 172, 258 152, 238 140 C ${180 + cx / 4} 126, ${cx + 70} 122, ${cx + 6} ${cy + 6}`;
  const flowPath = closure >= 0.98 ? blockedPath : nasalFlow ? nasalPath : oralPath;

  // 纸面印刷图：气流与声带振动 = 墨；结构 = 结构蓝；运动本身编码状态
  const flowColor = '#17140E';

  return (
    <div className="relative overflow-hidden rounded-[4px] border border-rule bg-under/60">
      <svg viewBox="0 0 420 270" className="w-full" role="img" aria-label="口腔侧视图动画，展示舌位、口型与气流">
        {/* 鼻腔 */}
        <path
          d="M 66 86 C 96 74, 136 70, 172 80 C 204 88, 220 106, 236 128 L 250 140"
          fill="rgba(42,75,215,0.07)"
          stroke="rgba(42,75,215,0.55)"
          strokeWidth={1.5}
        />
        {/* 上颚（硬腭→软腭） */}
        <path
          d="M 74 118 C 100 100, 140 96, 176 100 C 210 104, 234 116, 250 136 C 258 148, 262 158, 262 170"
          fill="none"
          stroke="rgba(22,19,15,0.7)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* 软腭开合（鼻音时下垂，打开鼻腔通道）——结构标注走结构蓝 */}
        <motion.path
          d="M 246 132 C 256 144, 260 156, 258 168"
          fill="none"
          stroke={nasalFlow ? '#2A4BD7' : 'rgba(22,19,15,0.7)'}
          strokeWidth={4}
          strokeLinecap="round"
          animate={{ rotate: nasalFlow ? 14 : -4, opacity: 1 }}
          style={{ originX: '246px', originY: '132px' }}
          transition={{ duration: dur }}
        />

        {/* 上齿 */}
        <path d="M 92 116 L 104 116 L 98 130 Z" fill="#FBF9F2" stroke="rgba(22,19,15,0.55)" strokeWidth={1} />
        {/* 下齿（随下颌下移） */}
        <motion.g animate={{ y: jawY * 0.85 }} transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}>
          <path d="M 94 150 L 106 150 L 100 137 Z" fill="#FBF9F2" stroke="rgba(22,19,15,0.55)" strokeWidth={1} />
        </motion.g>

        {/* 舌：整体随前后/高低移动，形体随舌高缩放（结构蓝墨线） */}
        <motion.g
          animate={{ x: tongueX, y: tongueY, scaleY: tongueScaleY }}
          style={{ originX: '170px', originY: '180px' }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
        >
          <path
            d="M 92 178 C 104 156, 132 146, 168 146 C 208 146, 238 158, 246 178 C 250 192, 244 204, 230 208 L 110 208 C 96 204, 88 192, 92 178 Z"
            fill="rgba(42,75,215,0.12)"
            stroke="#2A4BD7"
            strokeWidth={1.5}
          />
          {/* 舌位焦点（发音焦点 = 批注红） */}
          <motion.ellipse
            cx={geo.tongueFront > 0.6 ? 118 : geo.tongueFront > 0.4 ? 168 : 222}
            cy={geo.tongueHigh > 0.5 ? 158 : 182}
            rx={34}
            ry={16}
            fill="#17140E"
            opacity={0.5}
            animate={{ opacity: playing ? [0.3, 0.75, 0.3] : 0.35 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>

        {/* 下颌（开口度） */}
        <motion.path
          d="M 76 138 C 86 176, 96 200, 120 214 C 156 234, 214 236, 252 224"
          fill="none"
          stroke="rgba(22,19,15,0.55)"
          strokeWidth={4}
          strokeLinecap="round"
          animate={{ y: jawY, rotate: geo.jawOpen * 5 }}
          style={{ originX: '76px', originY: '138px' }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* 唇（侧视：圆展 → 外突/贴合） */}
        <motion.g animate={{ x: -lipOut }} transition={{ duration: dur }}>
          <path d={`M 74 112 C 66 116, 62 122, 64 128 C 58 134, 62 142, 72 146`} fill="none" stroke="rgba(22,19,15,0.8)" strokeWidth={5} strokeLinecap="round" />
        </motion.g>

        {/* 气流粒子 */}
        {playing && (
          <g aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} r={4 - (i % 2)} fill={flowColor} opacity={0.85}>
                <animateMotion
                  dur={`${1.8 + (i % 3) * 0.35}s`}
                  begin={`${-i * 0.3}s`}
                  repeatCount="indefinite"
                  path={flowPath}
                  rotate="auto"
                />
              </circle>
            ))}
            {/* 受阻处：粒子聚集 / 摩擦缝挤出 */}
            {closure >= 0.9 && (
              <g>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={`c${i}`}
                    cx={cx + (i - 1) * 7}
                    cy={cy + (i % 2) * 4}
                    r={4}
                    fill={flowColor}
                    animate={geo.manner === 'plosive' ? { opacity: [0.2, 1, 0.2], scale: [0.6, 1.25, 0.6] } : { opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: geo.manner === 'plosive' ? 0.9 : 1.4, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
                {geo.manner === 'plosive' && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="none"
                    stroke="#17140E"
                    strokeWidth={2}
                  >
                    {/* r 属性用 SMIL 动画：framer-motion 会把 r 写成 "undefined" 触发浏览器报错 */}
                    {tier !== 'off' && (
                      <>
                        <animate attributeName="r" values="4;26" dur="1.7s" begin="0s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0" dur="1.7s" begin="0s" repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                )}
              </g>
            )}
            {closure > 0.4 && closure < 0.9 && (
              <circle
                cx={cx}
                cy={cy}
                r={5}
                fill={flowColor}
              >
                {tier !== 'off' && (
                  <>
                    <animate attributeName="r" values="4;7;4" dur="0.75s" begin="0s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.95;0.3" dur="0.75s" begin="0s" repeatCount="indefinite" />
                  </>
                )}
              </circle>
            )}
          </g>
        )}

        {/* 声带 */}
        <g>
          <line x1={256} y1={206} x2={282} y2={206} stroke="rgba(22,19,15,0.7)" strokeWidth={3} strokeLinecap="round" />
          <line x1={256} y1={214} x2={282} y2={214} stroke="rgba(22,19,15,0.7)" strokeWidth={3} strokeLinecap="round" />
          {voiced ? (
            <motion.ellipse
              cx={269}
              cy={210}
              rx={13}
              ry={9}
              fill="#17140E"
              opacity={0.65}
              animate={playing ? { opacity: [0.25, 0.9, 0.25], scale: [0.85, 1.2, 0.85] } : { opacity: 0.3 }}
              transition={{ duration: 0.34, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '269px', originY: '210px' }}
            />
          ) : (
            <text x={269} y={236} textAnchor="middle" fill="#57503F" fontSize={12}>
              不振动
            </text>
          )}
        </g>

        {/* 标注 */}
        <text x={300} y={40} fill="#57503F" fontSize={12} fontFamily="ui-monospace, monospace">
          {geo.nasal ? '气流 → 鼻腔' : closure >= 0.9 ? `气流受阻 @ ${geo.place}` : closure > 0.4 ? '气流摩擦挤出' : '气流 → 口腔'}
        </text>
        <text x={300} y={58} fill={voiced ? '#17140E' : '#57503F'} fontSize={12} fontFamily="ui-monospace, monospace">
          声带{voiced ? '振动（浊音）' : '静止（清音）'}
        </text>
        <text x={20} y={258} fill="#57503F" fontSize={12}>
          侧面剖视 · 舌位高光 = 发音焦点
        </text>
      </svg>

      {/* 正视口型（唇形圆展） */}
      {showFront && (
        <div className="absolute right-3 top-3 rounded-[4px] border border-rule bg-under/95 p-2">
          <svg width={96} height={78} viewBox="0 0 96 78" role="img" aria-label="正面口型">
            <text x={48} y={12} textAnchor="middle" fill="#57503F" fontSize={12}>
              正面口型
            </text>
            {/* 上唇 */}
            <motion.ellipse
              cx={48}
              cy={34 + jawY * 0.25}
              rx={30 - geo.lipRound * 14}
              ry={9 + geo.jawOpen * 2}
              fill="#FBF9F2"
              stroke="rgba(22,19,15,0.7)"
              strokeWidth={1}
              /* rx 用 CSS 过渡：framer-motion 动画 SVG 几何属性会写入 "undefined" 并触发浏览器报错 */
              style={{ transition: `rx ${dur}s ease, ry ${dur}s ease` }}
            />
            {/* 口裂（下颌开合 + 圆展） */}
            <motion.ellipse
              cx={48}
              cy={44 + jawY * 0.3}
              rx={26 - geo.lipRound * 15 + geo.jawOpen * 4}
              ry={3 + geo.jawOpen * 14}
              fill="#17140E"
              stroke="rgba(22,19,15,0.55)"
              strokeWidth={2}
              transition={{ duration: dur }}
            />
            {/* 下唇 */}
            <motion.ellipse
              cx={48}
              cy={58 + jawY * 0.45}
              rx={30 - geo.lipRound * 14}
              ry={9}
              fill="#FBF9F2"
              stroke="rgba(22,19,15,0.7)"
              strokeWidth={1}
              transition={{ duration: dur }}
            />
            {/* 舌尖可见（前元音/齿音时露出）——发音焦点走墨色 */}
            <motion.ellipse
              cx={48}
              cy={47 + jawY * 0.3 - geo.tongueHigh * 4}
              rx={12 + geo.tongueFront * 6}
              ry={3 + geo.jawOpen * 4}
              fill="#17140E"
              animate={{ opacity: geo.tongueFront > 0.55 || geo.place === 'dental' ? 0.95 : 0.25 }}
              transition={{ duration: dur }}
            />
          </svg>
        </div>
      )}
    </div>
  );
}
