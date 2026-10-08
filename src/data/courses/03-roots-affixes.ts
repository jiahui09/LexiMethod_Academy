import type { Course } from '../courseSchema';

/**
 * 03 词根词缀拆解法（零件流水线）。
 * 专属结构 = 流水线，三条送料线（前缀、词根、后缀）→ 组装 → 质检（防假词素）→ 出货（闭环核对）。
 * 事实沿用旧课 roots-affixes 与 affixes.ts / rules.ts / words.ts，表达全部重写。
 */
export const course03: Course = {
  id: 'roots-affixes',
  order: 3,
  stage: 'deconstruct',
  title: '词根词缀拆解法',
  subtitle: '一条零件流水线，长词进来，拆开的三块和一个能核对的猜测出去。',
  goal:
    '学完你拆陌生学术词的成功率 ≥70%，词性判断 ≥90%，并能独立走完拆解、猜义、核对的闭环。',
  durationMin: 38,

  opening: {
    lead: '先当场拆 contradiction，8 道题测你敢不敢下刀，做完立刻给你一份分数带报告。',
    questions: [
      {
        id: 'c03-diag-1',
        type: 'affixAssemble',
        prompt: '把 contradiction 拆成你能认出的零件，依次装进槽位。',
        narration: '一个生词进场，先按前缀、词根、后缀三格切块。',
        affixUnits: [
          { text: 'contra', type: 'prefix', meaning: '相反' },
          { text: 'dict', type: 'root', meaning: '说' },
          { text: 'ion', type: 'suffix', meaning: '名词' },
        ],
        answer: 'contra-dict-ion',
        speak: 'contradiction',
        hint: '先切词尾的 -ion，再认中间的 dict，剩下的整块就是前缀。',
        explain:
          'contra-（相反）加 dict（说）加 -ion（名词），三块合起来是相反的说法，词义为矛盾。',
      },
      {
        id: 'c03-diag-2',
        type: 'choice',
        prompt: 'contradiction 拆完三块之后，词义最接近哪一项？',
        narration: '切完零件要合成一个大概意思，这一步就是猜义。',
        choices: [
          { label: '相反的说法，也就是矛盾', correct: true },
          { label: '把货物从一处运到另一处', correct: false },
          { label: '提前把要说的话讲出来', correct: false },
        ],
        answer: '相反的说法，也就是矛盾',
        hint: 'contra- 管方向，dict 管动作。',
        explain: '相反加说，就是两边顶起来的说法，词典给的词义正是矛盾。',
      },
      {
        id: 'c03-diag-3',
        type: 'choice',
        prompt: '-ion 这块零件告诉你 contradiction 的什么信息？',
        narration: '三块零件各管一摊，这块管的是身份。',
        choices: [
          { label: '词性是名词', correct: true },
          { label: '方向朝外', correct: false },
          { label: '重音落在第一个音节', correct: false },
        ],
        answer: '词性是名词',
        hint: '它管词的身份，不管方向。',
        explain: '-ion 是名词后缀，看到它先按名词处理，contradiction 正是名词。',
      },
      {
        id: 'c03-diag-4',
        type: 'affixAssemble',
        prompt: '把 transformation 切块装进槽位。',
        narration: '再上一个长词，切法一样。',
        affixUnits: [
          { text: 'trans', type: 'prefix', meaning: '跨越，转变' },
          { text: 'form', type: 'root', meaning: '形状' },
          { text: 'ation', type: 'suffix', meaning: '名词' },
        ],
        answer: 'trans-form-ation',
        speak: 'transformation',
        hint: '词尾整块 -ation 先切走，开头的 trans- 你多半见过。',
        explain: 'trans-（转变）加 form（形状）加 -ation（名词），换成另一种形状的过程就是转变。',
      },
      {
        id: 'c03-diag-5',
        type: 'choice',
        prompt: 'inspection 里哪一块是决定核心意思的词根？',
        narration: '三块零件里，只有一块携带整族词的公共含义。',
        choices: [
          { label: 'spect，表示看', correct: true },
          { label: 'in-，表示进入', correct: false },
          { label: '-ion，表示名词', correct: false },
        ],
        answer: 'spect，表示看',
        hint: '前缀给方向，后缀给词性，中间那块给核心义。',
        explain: 'spect 是「看」，往里看是检查，整族词的核心义都由它扛。',
      },
      {
        id: 'c03-diag-6',
        type: 'choice',
        prompt: '看到一个以 -ly 结尾的生词，先判断它是什么词性？',
        narration: '词性判断是拆解流水线出货前的一道快检。',
        choices: [
          { label: '副词', correct: true },
          { label: '名词', correct: false },
          { label: '形容词', correct: false },
        ],
        answer: '副词',
        hint: '想想 quickly、carefully。',
        explain: '-ly 把形容词变成副词，carefully 说明动作是怎么做的。',
      },
      {
        id: 'c03-diag-7',
        type: 'choice',
        prompt: '在 inspect、transport、predict 这些词里，port 这块零件的意思是？',
        narration: '词根的含义在整族词里保持稳定。',
        choices: [
          { label: '搬运，携带', correct: true },
          { label: '港口，码头', correct: false },
          { label: '一部分，份额', correct: false },
        ],
        answer: '搬运，携带',
        hint: 'port 单独当单词时另有意思，看它在这几个词里的共同点。',
        explain: 'port 作词根一律是搬运，export 运出去、import 运进来、portable 能搬走。',
      },
      {
        id: 'c03-diag-8',
        type: 'choice',
        prompt: '面对一个没见过的学术词，第一步做什么？',
        narration: '这题测你现在的习惯，不测词汇量。',
        choices: [
          { label: '先切成前缀、词根、后缀几块', correct: true },
          { label: '先把字母抄十遍', correct: false },
          { label: '先背词典里的中文释义', correct: false },
        ],
        answer: '先切成前缀、词根、后缀几块',
        hint: '切开才能猜方向，猜完还有一步等着你。',
        explain: '先切块才能给词义定向，猜完再回词典核对，这条流水线就是本课内容。',
      },
    ],
    bands: [
      {
        until: 8,
        verdict: '八题全对，你敢拆也拆得准，接下来练的是速度和核对。',
        route: '直接进 U2 前缀送料线',
      },
      {
        until: 6,
        verdict: '方向有了，词性和词根还会串线，跟着三条送料线补齐。',
        route: '按 U2 到 U4 的顺序走',
      },
      {
        until: 3,
        verdict: '你多半还在整词硬背，先把 contradiction 拆开成三块。',
        route: '回 U1 看拆解示范',
      },
      {
        until: 0,
        verdict: '见词还不敢下刀，从第一单元的拆解秀开始，一条线一条线走。',
      },
    ],
  },

  units: [
    /* ---------------------------------------------------------- U1 */
    {
      id: 'u1',
      title: '生词拆解秀',
      durationMin: 5,
      claim: '生词先切块再猜义，contradiction 三刀就能拆开。',
      blocks: [
        {
          kind: 'example',
          text: 'contradiction 切成 contra-（相反）、dict（说）、-ion（名词），合起来是相反的说法。',
          speak: 'contradiction',
        },
        {
          kind: 'demo',
          ref: 'pipeline-overview',
          caption: '流水线总览，三条送料线供件，组装后过质检再出货。',
        },
        {
          kind: 'warning',
          text: '拆完就当结论最危险，猜出的词义必须回词典核对。',
        },
      ],
      practice: {
        kind: 'diagnostic',
        title: '拆解自测',
        prompt: '当场拆 contradiction，能切几块切几块，8 道题做完立刻看分数带。',
        debrief: '分数低说明你还在整词硬背，分数高说明敢下刀，接下来练的是准头。',
      },
      check: '我能不看示范把 contradiction 切成三块。',
    },

    /* ---------------------------------------------------------- U2 */
    {
      id: 'u2',
      title: '送料线 A，前缀定方向',
      durationMin: 7,
      claim: '24 个高频前缀归成 6 个语义家族，方向一眼定。',
      blocks: [
        {
          kind: 'list',
          items: [
            '否定与拒绝，un- dis- non- anti-',
            '时间与空间，pre- sub- inter- trans-',
            '方向与进出，in- im- ex- ab-',
            '程度数量，over- under- multi- semi-',
            '共同与促成，com- con- pro- en-',
            '错误与反复，mis- re- de-',
          ],
        },
        {
          kind: 'example',
          text: 'export 拆成 ex-（向外）和 port（运），方向一给，词义立刻收窄。',
          speak: 'export',
          ipa: '/ˈekspɔːt/',
        },
        {
          kind: 'demo',
          ref: 'prefix-family-board',
          caption: '前缀家族板，24 个高频前缀按语义分成 6 组上墙。',
        },
      ],
      practice: {
        kind: 'affixAssemble',
        title: '前缀与词义配对',
        prompt: '把 6 个前缀分进对应的语义家族，全对才算这条送料线通了。',
        debrief: '前缀管方向，家族记牢了，词义的大致方位就不会错。',
      },
      check: '看到 trans-、ex-、mis-，我能两秒说出方向。',
    },

    /* ---------------------------------------------------------- U3 */
    {
      id: 'u3',
      title: '送料线 B，词根定核心',
      durationMin: 7,
      claim: '词根定核心义，30 个高频词根各带一整族词。',
      blocks: [
        {
          kind: 'demo',
          ref: 'word-family-spect',
          caption: 'spect 家族树，从「看」这一根长出五根枝。',
        },
        {
          kind: 'example',
          text: 'predict 提前说，contradict 反着说，dict 永远是「说」。',
          speak: 'predict',
        },
        {
          kind: 'demo',
          ref: 'word-family-port',
          caption: 'port 家族树，前缀换方向，搬运这层意思不动。',
        },
        {
          kind: 'warning',
          text: '孤立背 spect 最亏，inspect、respect 一起背才留得住。',
        },
      ],
      practice: {
        kind: 'wordFamilyTree',
        title: '词族树生长',
        prompt: '种下 spect 词根，长出五个同根词枝，每枝说出词义。',
        debrief: '一根五枝，以后碰到新词先问它属不属于这棵树。',
      },
      check: '我能从 spect 长出五个同根词并讲清语义联系。',
    },

    /* ---------------------------------------------------------- U4 */
    {
      id: 'u4',
      title: '送料线 C，后缀定词性',
      durationMin: 6,
      claim: '后缀定词性，看到 -tion 就先当名词处理。',
      blocks: [
        {
          kind: 'list',
          items: [
            '-tion -sion 变名词',
            '-ize -ify 变动词',
            '-ly 变副词',
            '-able -ous 变形容词',
          ],
        },
        {
          kind: 'example',
          text: 'transportation 尾巴是 -ation，重音被压到它前一个音节。',
          speak: 'transportation',
          ipa: '/ˌtrænspɔːˈteɪʃn/',
        },
        {
          kind: 'demo',
          ref: 'suffix-pos-tags',
          caption: '后缀标签台，词性三选一，先看尾巴再看句子位置。',
        },
      ],
      practice: {
        kind: 'choice',
        title: '词性判断',
        prompt: '给 6 个词只看词尾判词性，六连对才算过关。',
        debrief: '词性判对，句子成分才不会安错位置。',
      },
      check: '我看到 -tion、-ly、-ize 能立刻报出词性。',
    },

    /* ---------------------------------------------------------- U5 */
    {
      id: 'u5',
      title: '质检，假词素与同化前缀',
      durationMin: 6,
      claim: '质检拦两类错，假词素与同化前缀都要过一遍。',
      blocks: [
        {
          kind: 'example',
          text: 'condition 拆成 con- 加 dit 加 -ion 不成立，dit 扛不起「说」的意思。',
          speak: 'condition',
        },
        {
          kind: 'list',
          items: [
            'in- 后接 p、b 写成 im-',
            'in- 后接 l 写成 il-',
            'in- 后接 r 写成 ir-',
            'com- 常同化成 con-、col-',
          ],
        },
        {
          kind: 'warning',
          text: '拆错比不拆更糟，假词素带出的词义会把整句理解带偏。',
        },
      ],
      practice: {
        kind: 'morphemeJudge',
        title: '真假拆解判别',
        prompt: '逐题判断划出的这块属真词素还是假词素，全部判对才算质检通过。',
        debrief: 'condition 这类词整体记，硬拆只会拆出假零件。',
      },
      check: '我能说出 im-、il-、ir- 是同一个否定前缀。',
    },

    /* ---------------------------------------------------------- U6 */
    {
      id: 'u6',
      title: '出货，拆解→猜义→核对闭环',
      durationMin: 7,
      claim: '出货前必须核对，猜出的词义要回词典对答案。',
      blocks: [
        {
          kind: 'list',
          items: ['拆，切出前缀词根后缀', '猜，按零件给一个词义', '核，回词典对答案找差距'],
        },
        {
          kind: 'example',
          text: 'contradiction 先猜「相反的说法」，核对后补上词义是矛盾。',
          speak: 'contradiction',
        },
        {
          kind: 'demo',
          ref: 'loop-timer-three-words',
          caption: '三个陌生词连跑三拍，计时看拆、猜、核的节奏。',
        },
      ],
      practice: {
        kind: 'loopTimer',
        title: '闭环计时',
        prompt:
          '三个生词连跑拆、猜、核三拍，每词都回答语义跳跃在哪，全部完成才算出货。',
        debrief: '核对时说清语义跳跃在哪，下次猜义就更贴词典。',
      },
      check: '我能对一个生词走完拆、猜、核三拍。',
    },
  ],

  exitTicket: {
    intro: '8 道题覆盖拆解、词性与闭环，当场判分并给你一句诊断。',
    questions: [
      {
        id: 'c03-exit-1',
        type: 'affixAssemble',
        prompt: '把 transportation 切块装进槽位。',
        narration: '长词进场，先按三格切开。',
        affixUnits: [
          { text: 'trans', type: 'prefix', meaning: '跨越，转变' },
          { text: 'port', type: 'root', meaning: '搬运' },
          { text: 'ation', type: 'suffix', meaning: '名词' },
        ],
        answer: 'trans-port-ation',
        speak: 'transportation',
        hint: '词尾 -ation 整块切走，port 是你见过的搬运。',
        explain: 'trans- 加 port 加 -ation，横着搬过去的过程，词义是运输，词性是名词。',
      },
      {
        id: 'c03-exit-2',
        type: 'choice',
        prompt: '只看尾巴，transportation 应该先当什么词性处理？',
        narration: '词性先由后缀定，再看句子位置。',
        choices: [
          { label: '名词', correct: true },
          { label: '动词', correct: false },
          { label: '形容词', correct: false },
        ],
        answer: '名词',
        hint: '-ation 属于 -tion 家族。',
        explain: '-ation 是名词后缀，重音也落在它前一个音节，先按名词处理不会错。',
      },
      {
        id: 'c03-exit-3',
        type: 'affixAssemble',
        prompt: '把 inspection 切块装进槽位。',
        narration: '同族词换一身衣服，切法不变。',
        affixUnits: [
          { text: 'in', type: 'prefix', meaning: '进入，向内' },
          { text: 'spect', type: 'root', meaning: '看' },
          { text: 'ion', type: 'suffix', meaning: '名词' },
        ],
        answer: 'in-spect-ion',
        speak: 'inspection',
        hint: '开头 in-，中间那块你在 spect 家族见过。',
        explain: 'in- 向里加 spect 看加 -ion 名词，往里看就是检查，词性是名词。',
      },
      {
        id: 'c03-exit-4',
        type: 'choice',
        prompt: 'inspect、respect、prospect 共享的 spect 是什么意思？',
        narration: '词根含义整族不变，这题测你的词族记忆。',
        choices: [
          { label: '看', correct: true },
          { label: '说', correct: false },
          { label: '搬运', correct: false },
        ],
        answer: '看',
        hint: '往里看、反复看、向前看，动作都一样。',
        explain: 'spect 是「看」，respect 反复看引申为尊重，prospect 向前看引申为前景。',
      },
      {
        id: 'c03-exit-5',
        type: 'choice',
        prompt: '下面哪种拆法切出了假词素？',
        narration: '质检工位要拦的就是这种看着合理的错拆。',
        choices: [
          { label: 'condition 拆出 dit 表「说」', correct: true },
          { label: 'impossible 拆出 im- 表「不」', correct: false },
          { label: 'export 拆出 ex- 表「向外」', correct: false },
        ],
        answer: 'condition 拆出 dit 表「说」',
        hint: '先问这一块在别的词里还能不能找到。',
        explain: 'im- 和 ex- 都是真前缀，condition 里的 dit 扛不起词义，这个词整体记更稳。',
      },
      {
        id: 'c03-exit-6',
        type: 'choice',
        prompt: 'carefully 结尾的 -ly 说明它是什么词性？',
        narration: '词性题看尾巴，快而准。',
        choices: [
          { label: '副词', correct: true },
          { label: '名词', correct: false },
          { label: '介词', correct: false },
        ],
        answer: '副词',
        hint: '它修饰动词，说明动作怎么做。',
        explain: '-ly 把形容词变成副词，carefully 描写动作的方式。',
      },
      {
        id: 'c03-exit-7',
        type: 'choice',
        prompt: 'rewrite、rebuild 里的 re- 给词义加了什么？',
        narration: '前缀只加方向，词根动作不变。',
        choices: [
          { label: '再次，重新', correct: true },
          { label: '向外，离开', correct: false },
          { label: '共同，一起', correct: false },
        ],
        answer: '再次，重新',
        hint: '再写一遍，再建一遍。',
        explain: 're- 表重复，write 重写、build 重建，前缀加的是次数与方向。',
      },
      {
        id: 'c03-exit-8',
        type: 'choice',
        prompt: '拆解猜义之后回词典核对，重点回答哪一个问题？',
        narration: '闭环最后一拍，核对要带问题去。',
        choices: [
          { label: '我猜的意思和词典义差在哪', correct: true },
          { label: '这个单词有几个字母', correct: false },
          { label: '它的字母来自什么语言', correct: false },
        ],
        answer: '我猜的意思和词典义差在哪',
        hint: '差距就是你下次要补的那一步。',
        explain:
          'contradiction 猜到相反的说法，词典给矛盾，核对补上的正是这处语义跳跃。',
      },
    ],
    bands: [
      { until: 8, verdict: '全对，流水线已经跑通，剩下的靠题量把速度练起来。' },
      {
        until: 6,
        verdict: '拆解没问题，词性或质检还有一道缝，回对应单元补一遍再测。',
      },
      {
        until: 0,
        verdict: '整词硬背还在，回 U1 把 contradiction 重新拆开三块。',
        route: '从拆解示范重看',
      },
    ],
  },

  selfCheck: [
    '我能把一个陌生学术词切成前缀、词根、后缀三块吗？',
    '我说得出 24 个高频前缀里任意一个的方向吗？',
    '我不看笔记就能说出 -tion、-ize、-ly 各自的词性吗？',
    '遇到 im-、il-、ir-，我能认出它们是同一个否定前缀吗？',
    '拆完一个词之后，我会主动回词典核对猜义吗？',
  ],
};
