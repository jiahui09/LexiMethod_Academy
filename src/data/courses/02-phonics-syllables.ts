import type { Course } from '../courseSchema';

/**
 * 02 自然拼读法 音节划分与重音（划词算法）
 * 专属结构 = 算法递进。三步算法逐步组装，每装一步立刻跑题：
 *   U2 装第 1 步（数元音核心）→ U3 装第 2 步（分辅音）→ U4 装第 3 步（定重音）
 *   U5 补 -tion / -sion 家族的兑现规则 → U6 三步连跑 + 出门条
 */
export const course02: Course = {
  id: 'phonics-syllables',
  order: 2,
  stage: 'pathway',
  title: '自然拼读法 音节划分与重音',
  subtitle: '数元音核心、分辅音、定重音，三步把长词切成能读出声的音节块。',
  goal: '面对陌生的三到四音节词，你能在 10 秒内给出音节划分与重音位置并读出声。',
  durationMin: 37,

  opening: {
    lead: '先按你现在的习惯给 decision 划音节并点重音，交卷后当场对照音标，报告会指出你从没走过的那一步。',
    questions: [
      {
        id: 'c02-diag-1',
        type: 'syllableSplit',
        prompt: '按你现在的习惯划分 decision 的音节，切几块就摆几块。',
        narration: '先照常发挥，交卷后立刻给出音标对照。',
        syllableUnits: ['de', 'ci', 'sion'],
        answer: 'de-ci-sion',
        speak: 'decision',
        hint: '先数清元音字母有几个，再决定切口落在哪里。',
        explain: 'decision 划成 de-ci-sion 三块，读作 /dɪˈsɪʒən/，重音在 ci 上。',
      },
      {
        id: 'c02-diag-2',
        type: 'stressPosition',
        prompt: '点出 decision 的重读音节。',
        narration: '三块里只有一块读得响又长。',
        syllableUnits: ['de', 'ci', 'sion'],
        answer: '1',
        speak: 'decision',
        hint: '重读音节更响更长，其余音节会弱读成 /ə/。',
        explain: 'decision 重读第 2 音节 ci，/dɪˈsɪʒən/，de 与 sion 都弱读。',
      },
      {
        id: 'c02-diag-3',
        type: 'choice',
        prompt: 'decision 里有几个元音核心？',
        narration: '元音核心决定音节数，第一步数错后面全跟着错。',
        choices: [
          { label: '3 个，e、i 和 io', correct: true },
          { label: '4 个，e、i、i、o', correct: false },
          { label: '2 个，e 和 io', correct: false },
        ],
        answer: '3 个，e、i 和 io',
        hint: '读一读，能听见几段元音声音就数几个核心。',
        explain: 'decision 的核心是 e、i 和 io 共 3 个，所以切成 3 个音节。',
      },
      {
        id: 'c02-diag-4',
        type: 'choice',
        prompt: 'baby 里的 y 算不算元音核心？',
        narration: 'y 在词中和词尾都能当一个音节的核心。',
        choices: [
          { label: '算，baby 切成 ba-by 两块', correct: true },
          { label: '不算，baby 只有一个音节', correct: false },
          { label: '只在词尾才算，词中一律当辅音', correct: false },
        ],
        answer: '算，baby 切成 ba-by 两块',
        hint: '回想 gym、rhythm 这类词里 y 站的位置。',
        explain: 'baby 的 y 承担一个音节的核心，切成 ba-by，数核心时要把它算进去。',
      },
      {
        id: 'c02-diag-5',
        type: 'syllableSplit',
        prompt: '凭直觉划分 construction。',
        narration: '这个词中间挤着一串辅音，切口位置最见习惯。',
        syllableUnits: ['con', 'struc', 'tion'],
        answer: 'con-struc-tion',
        speak: 'construction',
        hint: '先数元音核心，再想 str 三个辅音怎么分更好读。',
        explain: 'construction 切成 con-struc-tion，str 整体给后一节，重读 struc。',
      },
      {
        id: 'c02-diag-6',
        type: 'stressPosition',
        prompt: '点出 construction 的重读音节。',
        narration: '三块里挑一块读得最响。',
        syllableUnits: ['con', 'struc', 'tion'],
        answer: '1',
        speak: 'construction',
        hint: '结尾的 -tion 会把重音压到它前面那一节。',
        explain: 'construction 重读第 2 音节 struc，/kənˈstrʌkʃən/，con 与 tion 弱读。',
      },
      {
        id: 'c02-diag-7',
        type: 'choice',
        prompt: '看到 -tion 结尾的多音节词，重音通常落在哪里？',
        narration: '-tion 家族的重音位置有固定答案。',
        choices: [
          { label: '它前面的那个音节', correct: true },
          { label: '第一个音节', correct: false },
          { label: '最后一个音节', correct: false },
        ],
        answer: '它前面的那个音节',
        hint: 'construction 和 decision 已经给过提示。',
        explain: 'construction、decision、transportation 的重音都落在 -tion 或 -sion 的前一节。',
      },
    ],
    bands: [
      { until: 7, verdict: '三步你都会走，直接进 U6 连跑计时。', route: 'u6' },
      { until: 4, verdict: '能划开词，元音核心没数稳，回 U2 补第一步。', route: 'u2' },
      { until: 0, verdict: '你还在逐字母看词，从 U1 的对比看起。', route: 'u1' },
    ],
  },

  units: [
    /* ---------------------------------------------------------- */
    {
      id: 'u1',
      title: '逐字母背为什么崩',
      durationMin: 5,
      claim: 'decision 按字母背要记住八个先后顺序，按音节只背三块。',
      blocks: [
        {
          kind: 'demo',
          ref: 'letter-vs-block-contrast',
          caption: '同一个 decision，左排 8 个字母，右排 3 个音节块，记忆量差别一眼可见。',
        },
        {
          kind: 'example',
          text: 'decision 切成 de、ci、sion 三块，每块都能读出声。',
          speak: 'decision',
          ipa: '/dɪˈsɪʒən/',
        },
        {
          kind: 'list',
          items: ['算法步 1 数元音核心', '算法步 2 分辅音', '算法步 3 定重音'],
        },
      ],
      practice: {
        kind: 'diagnostic',
        title: '划词自测',
        prompt: '按现在的习惯给 decision 划音节并点重音，交卷后当场对照音标。',
        debrief: '分数已进开场报告，哪一步先失手，下面三步算法逐个补上。',
      },
      check: '自问一句，刚才划词时你数过元音核心吗？',
    },

    /* ---------------------------------------------------------- */
    {
      id: 'u2',
      title: '算法步 1 数元音核心',
      durationMin: 8,
      claim: '先数元音核心，数出几个核心就有几个音节。',
      blocks: [
        {
          kind: 'demo',
          ref: 'vowel-core-counter',
          caption: '在 construction 上圈出 o、u、io 三个核心，音节数当场数出来。',
        },
        {
          kind: 'example',
          text: 'baby 的 y 也扛一个核心，所以切成 ba-by 两块。',
          speak: 'baby',
        },
        {
          kind: 'warning',
          text: '-tion 整块只提供一个核心，块里的 io 读成 /ə/，逐字母数会多算。',
        },
      ],
      practice: {
        kind: 'vowelCore',
        title: '圈元音核心',
        prompt: '圈出每个词的全部元音核心，核心数与音节数对上才算过。',
        debrief: '数错的核心多半是漏掉 y，或者把 -tion 拆成字母分开数。',
      },
      check: '不看屏幕，你能说出 construction 的核心数是三吗？',
    },

    /* ---------------------------------------------------------- */
    {
      id: 'u3',
      title: '算法步 2 分辅音',
      durationMin: 6,
      claim: '中间的辅音分给谁，看后一个音节能不能读出声。',
      blocks: [
        {
          kind: 'demo',
          ref: 'consonant-split-str',
          caption: 'construction 中间的 str 整体给后一节，con、struc、tion 三块成形。',
        },
        {
          kind: 'example',
          text: 'str 能当起音就整体给后一节，前一节只留 con。',
          speak: 'construction',
          ipa: '/kənˈstrʌkʃən/',
        },
        {
          kind: 'warning',
          text: '把辅音全塞给前一节，后一节起不了音，读到那里就会卡住。',
        },
      ],
      practice: {
        kind: 'syllableSplit',
        title: '音块归槽划音节',
        prompt: '把音块按顺序点进槽位拼回原词，切完读一遍，后一节要能起音。',
        debrief: 'str 能整体起音就整体给后一节，切口落在它前头。',
      },
      check: 'construction 你能一口气读顺 con-struc-tion 吗？',
    },

    /* ---------------------------------------------------------- */
    {
      id: 'u4',
      title: '算法步 3 定重音',
      durationMin: 7,
      claim: '重音落点由后缀、词性、词根三条线索共同给出。',
      blocks: [
        {
          kind: 'demo',
          ref: 'stress-three-clues',
          caption: 'record 名词重第一音节、动词重第二音节，三条线索逐条点亮。',
        },
        {
          kind: 'example',
          text: 'record 作名词时重音在前，作动词时重音移到后一节。',
          speak: 'record',
          ipa: '/ˈrekɔːd/',
          speakAudio: 'record-noun',
          note: '这里播的是名词读音，动词读音在出门条的重音题里。',
        },
        {
          kind: 'list',
          items: [
            '-tion 与 -sion 把重音定在前一节',
            '两音节动词常重后一个音节',
            '词根扛底音，transport 重音在 port',
            '重读音节更响更长',
          ],
        },
      ],
      practice: {
        kind: 'stressPosition',
        title: '点选重音',
        prompt: '给 record 与 construction 点出重读音节，并说出你用的是哪条线索。',
        debrief: '后缀先出手，见到 -tion 就先把重音放在它前一节。',
      },
      check: '看到 record，你能先说词性再点重音吗？',
    },

    /* ---------------------------------------------------------- */
    {
      id: 'u5',
      title: '焊点 -tion 与 -sion 家族',
      durationMin: 5,
      claim: '看到 -tion 就读 /ʃən/，重音落在它前一个音节。',
      blocks: [
        {
          kind: 'demo',
          ref: 'tion-family-map',
          caption: 'construction、information、education 的 -tion 同读 /ʃən/，重音同落前一节。',
        },
        {
          kind: 'example',
          text: 'question 是例外，-tion 前面是 s 加元音时读 /tʃən/。',
          speak: 'question',
          ipa: '/ˈkwestʃən/',
        },
        {
          kind: 'warning',
          text: '按字母名读成 t-i-o-n，朗读和听写会一起错。',
        },
      ],
      practice: {
        kind: 'listenWriteWord',
        title: '家族听写',
        prompt: '听音写出 -tion 家族的词，正确率达到 80% 算过。',
        debrief: '听到 /ʃən/ 直接落笔 tion，听到 /tʃən/ 先想到 question 这类例外。',
      },
      labLink: { tab: 'mapping', label: '去实验室加练音标拼写对应' },
      check: '听到 /ʃən/，你会先落笔 tion 并把重音放前一节吗？',
    },

    /* ---------------------------------------------------------- */
    {
      id: 'u6',
      title: '长词通关和出门条',
      durationMin: 6,
      claim: '三步连跑，陌生四音节词 10 秒给出划分与重音并读出。',
      blocks: [
        {
          kind: 'demo',
          ref: 'algorithm-full-run',
          caption: 'transportation 三步连跑，数核心、分辅音、定重音一次做完。',
        },
        {
          kind: 'example',
          text: 'incomprehensible 六个音节，主重音在 hen，前缀 in- 只带次重音。',
          speak: 'incomprehensible',
          ipa: '/ˌɪnkɒmprɪˈhensəbl/',
        },
        {
          kind: 'list',
          items: ['数元音核心定音节数', '分辅音让后节读得出', '定重音并读出声'],
        },
        {
          kind: 'list',
          items: [
            '开音节，元音念字母音，name',
            '闭音节，元音念短音，cat、dog',
            'magic e 拉长元音，kite、home',
            '字母组合整块读，ph 读 /f/',
            '例外词单记，question 读 /tʃən/',
            '四个词类各拿两个词，出声读到顺',
          ],
        },
      ],
      practice: {
        kind: 'algorithmRun',
        title: '算法跟跑计时',
        prompt: '连续跑 10 个生词，每个在 10 秒内给出划分、标出重音并读出声。',
        debrief: '哪一步卡住就回哪个单元，整词不用重背。',
      },
      check: '出门条的三道四音节题，你能在 10 秒内交卷吗？',
    },
  ],

  exitTicket: {
    intro: '8 题当场判分，重点看陌生四音节词能不能 10 秒划开并点中重音，最后给你一句诊断。',
    questions: [
      {
        id: 'c02-exit-1',
        type: 'syllableSplit',
        prompt: '现场划分 transportation，数清核心再下刀。',
        narration: '第一个四音节词，按三步算法走。',
        syllableUnits: ['trans', 'por', 'ta', 'tion'],
        answer: 'trans-por-ta-tion',
        speak: 'transportation',
        hint: 'a、o、a 加 -tion 整块，先数出四个核心。',
        explain: 'transportation 划成 trans-por-ta-tion，/ˌtrænspɔːˈteɪʃən/，重音在 ta。',
      },
      {
        id: 'c02-exit-2',
        type: 'stressPosition',
        prompt: '点出 transportation 的重读音节。',
        narration: '四块里挑一块读得最响。',
        syllableUnits: ['trans', 'por', 'ta', 'tion'],
        answer: '2',
        speak: 'transportation',
        hint: '重音仍找 -tion 前面那一节，trans- 只带次重音。',
        explain: 'transportation 重读第 3 音节 ta，重音落在 -tion 前一节，前缀 trans- 读次重音。',
      },
      {
        id: 'c02-exit-3',
        type: 'syllableSplit',
        prompt: '现场划分 information。',
        narration: '第二个四音节词，先数核心。',
        syllableUnits: ['in', 'for', 'ma', 'tion'],
        answer: 'in-for-ma-tion',
        speak: 'information',
        hint: '-tion 整块只算一个核心，前面还剩三个核心。',
        explain: 'information 划成 in-for-ma-tion，/ˌɪnfəˈmeɪʃən/，四个核心对四个音节。',
      },
      {
        id: 'c02-exit-4',
        type: 'stressPosition',
        prompt: '点出 information 的重读音节。',
        narration: '用后缀线索定落点。',
        syllableUnits: ['in', 'for', 'ma', 'tion'],
        answer: '2',
        speak: 'information',
        hint: '看到 -tion，先在它前一节做记号。',
        explain: 'information 重读第 3 音节 ma，重音同样落在 -tion 前一节。',
      },
      {
        id: 'c02-exit-5',
        type: 'syllableSplit',
        prompt: '现场划分 geography。',
        narration: '第三个四音节词，词尾换成 -graphy。',
        syllableUnits: ['ge', 'og', 'ra', 'phy'],
        answer: 'ge-og-ra-phy',
        speak: 'geography',
        hint: 'g 和 ph 各带辅音，切口要让后一节起得了音。',
        explain: 'geography 划成 ge-og-ra-phy，/dʒiˈɒɡrəfi/，四个核心对四个音节。',
      },
      {
        id: 'c02-exit-6',
        type: 'stressPosition',
        prompt: '点出 geography 的重读音节。',
        narration: '-graphy 结尾，重音往前推。',
        syllableUnits: ['ge', 'og', 'ra', 'phy'],
        answer: '1',
        speak: 'geography',
        hint: '倒着数，-phy 往前两格。',
        explain: 'geography 重读第 2 音节 og，/dʒiˈɒɡrəfi/，重音由 -graphy 后缀往词根方向推。',
      },
      {
        id: 'c02-exit-7',
        type: 'choice',
        prompt: 'question 结尾的 -tion 读哪个音？',
        narration: '-tion 家族有一个常见例外。',
        choices: [
          { label: '/tʃən/，如 question', correct: true },
          { label: '/ʃən/，如 construction', correct: false },
          { label: '/tiːən/，照字母名读', correct: false },
        ],
        answer: '/tʃən/，如 question',
        hint: 's 出现在 -tion 前面时，读音会变。',
        explain: 'question 读 /ˈkwestʃən/，-tion 前面是 s 加元音时读 /tʃən/，其余多读 /ʃən/。',
      },
      {
        id: 'c02-exit-8',
        type: 'stressPosition',
        prompt: 'record 作动词（录制）时，点出重读音节。',
        narration: '同一个拼写，词性一换重音换位。',
        syllableUnits: ['re', 'cord'],
        answer: '1',
        speak: 'record',
        speakAudio: 'record-verb',
        hint: '两音节动词常把重音放在后一节。',
        explain: 'record 作名词重读第 1 音节（/ˈrekɔːd/），作动词重音移到第 2 音节 cord。',
      },
    ],
    bands: [
      { until: 8, verdict: '四音节词 10 秒内出结果，这条目标已经拿到。' },
      { until: 5, verdict: '划分没问题，重音线索还不稳，回 U4 再跑一遍。', route: 'u4' },
      { until: 0, verdict: '三步算法还没走顺，回 U2 从数核心重装。', route: 'u2' },
    ],
  },

  selfCheck: [
    '拿到陌生的四音节词，我会先数元音核心再动手吗？',
    '切开音节时，我能说出辅音归前还是归后的依据吗？',
    '看到 -tion 或 -sion，我能立刻说出重音落点吗？',
    'record 这类名动同形词，我能分别点出重音位置吗？',
    '划分完我会把词读出声，再用音标核对一遍吗？',
  ],
};
