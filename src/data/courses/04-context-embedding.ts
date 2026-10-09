import type { Course } from '../courseSchema';

export const course04: Course = {
  id: 'context-embedding',
  order: 4,
  stage: 'encode',
  title: '语境记忆法',
  subtitle: '句中求生，把词放回句子，连搭配、句型和朗读节奏一起存进去。',
  goal: '学完你能给每个新词至少带上一个真实搭配块，并为它造出两个不同场景的句子。',
  durationMin: 34,

  opening: {
    lead: '读一句你背过的词造的句子，7 道题当场测出你能不能秒懂，答完给一份裂缝报告。',
    questions: [
      {
        id: 'c04-diag-1',
        type: 'contextChoice',
        prompt: '读 The ship was visible from the shore. 句中的 visible 最接近哪个意思？',
        narration: '先把整句读一遍，再判断 visible 在这句里取哪个义项。',
        speak: 'The ship was visible from the shore.',
        choices: [
          { label: '看得见的', correct: true },
          { label: '有名的', correct: false },
          { label: '重要的', correct: false },
        ],
        answer: '看得见的',
        hint: '把 from the shore 连起来想，谁站在哪里，看见了什么。',
        explain:
          'visible 的核心义是能被看见，这句说的是从岸上望过去那条船映入眼帘，取看得见的这个义项，有名气和重要都与看无关。',
      },
      {
        id: 'c04-diag-2',
        type: 'choice',
        prompt: 'The ship was visible from the shore. 描绘的场景是哪一个？',
        narration: '先在脑子里把这句画成一幅画面，再去选项里找它。',
        speak: 'The ship was visible from the shore.',
        choices: [
          { label: '岸上的人望得见那条船', correct: true },
          { label: '船靠岸时搁浅在礁石上', correct: false },
          { label: '船被大雾挡得看不见了', correct: false },
        ],
        answer: '岸上的人望得见那条船',
        hint: 'visible 说的是看得见，句子没有提到起雾或撞岸。',
        explain:
          'visible from the shore 交代的是观察位置，从岸这个角度能看见船，另外两个选项都把画面写成了看不见。',
      },
      {
        id: 'c04-diag-3',
        type: 'contextChoice',
        prompt: '下面哪一句里 visible 用得最自然？',
        narration: '三个选项都带 visible，挑一句母语者真会写出来的。',
        speak: 'There has been a visible improvement in her work.',
        choices: [
          { label: 'There has been a visible improvement in her work.', correct: true },
          { label: 'She made a visible to improve her work.', correct: false },
          { label: 'Her work is visible very much.', correct: false },
        ],
        answer: 'There has been a visible improvement in her work.',
        hint: 'visible 是形容词，它要么贴在名词前面，要么跟在 be 后面。',
        explain:
          'visible 作形容词修饰 improvement，第二句把它当成了名词来接，第三句的 very much 和形容词 visible 搭不上。',
      },
      {
        id: 'c04-diag-4',
        type: 'choice',
        prompt: 'She refused to answer the question. 里 refuse 右边接的是什么？',
        narration: '盯住 refuse 后面紧跟的成分，判断它属于哪个句型。',
        speak: 'She refused to answer the question.',
        choices: [
          { label: '不定式 to 加动词原形', correct: true },
          { label: '动名词 doing', correct: false },
          { label: 'that 引导的从句', correct: false },
        ],
        answer: '不定式 to 加动词原形',
        hint: 'refuse to do 和 refuse doing 两个句型里，只有一个常见。',
        explain:
          'refuse 最常接不定式，refuse to answer 就是拒绝回答，接名词时直接把东西放后面，例如 refuse the offer。',
      },
      {
        id: 'c04-diag-5',
        type: 'contextChoice',
        prompt: 'He refused the offer. 中 refused the offer 指他做了什么？',
        narration: 'offer 在这句里是个名词，跟着 refuse 一起读完整。',
        speak: 'He refused the offer.',
        choices: [
          { label: '他拒绝了这个提议', correct: true },
          { label: '他提议别人去拒绝', correct: false },
          { label: '他把提议改写了一遍', correct: false },
        ],
        answer: '他拒绝了这个提议',
        hint: '名词跟在动词后面时，通常扮演被动作碰到的那一方。',
        explain: 'refuse 直接接名词，offer 就是被拒的对象，所以这句说的是他不接受这个提议。',
      },
      {
        id: 'c04-diag-6',
        type: 'choice',
        prompt: 'learn knowledge 这个说法站不住脚，病灶在哪里？',
        narration: '这句按中文直觉翻过去很顺口，英文却不对。',
        choices: [
          { label: '中文的学知识按字面搬进了英文', correct: true },
          { label: 'knowledge 前面少写了定冠词', correct: false },
          { label: 'learn 的时态用错了', correct: false },
        ],
        answer: '中文的学知识按字面搬进了英文',
        hint: '想想英文里知识一般和哪个动词常年连用。',
        explain:
          '英文固定说 gain knowledge 或 acquire knowledge，learn 后面接的是技能、语言、课程这类能学得会的内容。',
      },
      {
        id: 'c04-diag-7',
        type: 'contextChoice',
        prompt: 'She made up the story before the meeting. 中 made up 是什么意思？',
        narration: 'make up 有好几个义项，靠它后面接的 story 来定方向。',
        speak: 'She made up the story before the meeting.',
        choices: [
          { label: '编造', correct: true },
          { label: '化妆', correct: false },
          { label: '弥补', correct: false },
        ],
        answer: '编造',
        hint: '宾语是 story，想一想哪个义项和它配得上。',
        explain:
          'make up a story 是把故事凭空编出来，接脸面才是化妆，接损失或时间才是弥补，宾语换了义项就换了。',
      },
    ],
    bands: [
      { until: 7, verdict: '句义、搭配、直译三处都通，直接进第二单元看用法义。', route: 'u2' },
      { until: 4, verdict: '词义记得住，句子反应慢，从双句型那一步开始补。', route: 'u2' },
      { until: 0, verdict: '词义和句子还对不上，回第一单元把 visible 这句读透。', route: 'u1' },
    ],
  },

  units: [
    {
      id: 'u1',
      title: '背过但用不了',
      durationMin: 5,
      claim: '词义背得再熟，句子里反应不过来，缺的是用法信息。',
      blocks: [
        {
          kind: 'example',
          text: 'The ship was visible from the shore.',
          speak: 'The ship was visible from the shore.',
          note: 'visible 读 /ˈvɪzəbl/，你背过它，整句却要逐词翻译才懂。',
        },
        {
          kind: 'demo',
          ref: 'visible-read-aloud',
          caption: '同一个句子读两遍，一遍逐词对照，一遍整句连读，比谁先反应过来。',
        },
        { kind: 'warning', text: '只记住等于看得见，句子一换场景你还是停在半路。' },
      ],
      practice: {
        kind: 'diagnostic',
        title: '句读理解自测',
        prompt: '7 道题一次做完，全对进第二单元，错三道以上就先留在这句上。',
        debrief: '错题当场揭晓，卡点多半出在把搭配拆开读和按中文语序套英文这两处。',
      },
      check: '读完一句先说得出场景，再说得出词义，两步都顺才算读懂。',
    },

    {
      id: 'u2',
      title: '字典义 ≠ 用法义',
      durationMin: 6,
      claim: '字典只给义项，搭配和句型才把词钉在句子里。',
      blocks: [
        {
          kind: 'example',
          text: 'She refused to answer the question. He refused the offer.',
          speak: 'She refused to answer the question. He refused the offer.',
          note: '同一个 refuse，后面接 to do 和接名词各管一边。',
        },
        {
          kind: 'list',
          items: [
            'refuse to do 拒绝去做一件事',
            'refuse sth 拒绝一个东西或提议',
            'make up a story 编一段故事',
            'make up for a loss 弥补一次损失',
          ],
        },
        {
          kind: 'demo',
          ref: 'make-up-three-scenes',
          caption: 'make up 落在故事、脸、损失三个场景里，点句看是哪个搭配把它按住。',
        },
      ],
      practice: {
        kind: 'contextChoice',
        title: '语境选义',
        prompt: '三道语境选义一次做完，全对才算你看得出搭配在定方向。',
        debrief: '错的人是把义项列表背下来了，句子里定方向的其实是它右边贴着的词。',
      },
      check: '遇到多义词先看它右边贴着谁，再定这句取哪个义项。',
    },

    {
      id: 'u3',
      title: '打捞搭配块',
      durationMin: 6,
      claim: '整块打捞搭配，连节奏一起读进记忆。',
      blocks: [
        {
          kind: 'demo',
          ref: 'three-color-blocks',
          caption: '句中三色圈块，搭配、修饰、介词各占一色，整块高亮后跟着读。',
        },
        {
          kind: 'example',
          text: 'The ship was clearly visible from the shore.',
          speak: 'The ship was clearly visible from the shore.',
          note: 'be visible 系住主语，clearly 加强度，from the shore 指明位置。',
        },
        { kind: 'warning', text: '只圈不读，节奏没进记忆，复习时你还是在看一行字。' },
      ],
      practice: {
        kind: 'sentenceBlocks',
        title: '句中圈块',
        prompt: '给句子里的三类块分别上色并整块跟读，三块都圈对再进下一单元。',
        debrief: '整块打捞的好处是调用时成块出手，用不着在句中现拼搭配。',
      },
      check: '合上句子，你弹出来的应该是一块一块的搭配。',
    },

    {
      id: 'u4',
      title: '造句三问',
      durationMin: 6,
      claim: '造句过三关才放行，搭配、词性、场景。',
      blocks: [
        {
          kind: 'list',
          items: [
            '搭配对，refuse 后面仍接 to answer 吗',
            '词性对，visible 是形容词不做动词',
            '像真人说话，句子要有具体场景',
          ],
        },
        {
          kind: 'example',
          text: 'The warning light on the dashboard was clearly visible at night.',
          speak: 'The warning light on the dashboard was clearly visible at night.',
          note: '场景具体到仪表盘和夜里，这句才留得住。',
        },
        {
          kind: 'demo',
          ref: 'sentence-builder-gate',
          caption: '三问各打一个勾才放行，缺一勾就退回重写。',
        },
      ],
      practice: {
        kind: 'sentenceBuilder',
        title: '造句自检台',
        prompt: '用 visible 造一个不少于四个词的句子，三问全勾才算过。',
        debrief: '最常卡住的是第一关，句子读着顺，搭配却是当场拼出来的。',
      },
      check: '句子写完先念出声，拗口就回去改搭配。',
    },

    {
      id: 'u5',
      title: '排雷，假语境与中文迁移',
      durationMin: 5,
      claim: '空句和直译句帮不上忙，遇到就改掉。',
      blocks: [
        {
          kind: 'example',
          text: 'I use the word visible.',
          speak: 'I use the word visible.',
          note: '语法挑不出错，读者却看不到任何画面。',
        },
        {
          kind: 'list',
          items: ['空句，句子合法却没有场景', '直译，中文搭配逐字搬进英文', '单句依赖，只背一个例句'],
        },
        {
          kind: 'demo',
          ref: 'fake-context-autopsy',
          caption: '假语境与直译句摆在现场，点开看它病在哪，再对照改好的版本。',
        },
        { kind: 'warning', text: '把中文语序搬进英文，句子看着成立，母语者读着别扭。' },
      ],
      practice: {
        kind: 'fakeContext',
        title: '假语境找茬',
        prompt: '从四个句子里挑出生病的那句并指出病灶，两轮全对才收工。',
        debrief: '病句的共同点是词进去了、场景没进去，改的时候先给它补一个画面。',
      },
      check: '判断假语境看两点，有没有具体场景，搭配是不是直译。',
    },

    {
      id: 'u6',
      title: '把 plant 种进两个场景',
      durationMin: 6,
      claim: 'plant 取哪个义项，由它落在哪个场景决定。',
      blocks: [
        {
          kind: 'example',
          text: 'The power plant provides electricity to the town.',
          speak: 'The power plant provides electricity to the town.',
          note: 'plant 在这句里是发电厂。',
        },
        {
          kind: 'example',
          text: 'They planted trees behind the house.',
          speak: 'They planted trees behind the house.',
          note: '同一个 plant，这句换成了种树。',
        },
        {
          kind: 'demo',
          ref: 'plant-two-scenes',
          caption: '两个场景并排摆着，点句看义项怎么随场景切换。',
        },
      ],
      practice: {
        kind: 'sentenceBuilder',
        title: '双场景造句',
        prompt: '给 plant 造两个句子，一个写工厂，一个写种植，三问自检后提交。',
        debrief: '两个场景逼着你去核对搭配，义项由语境决定这件事当场兑现。',
      },
      check: '收工前确认一句，plant 的两个句子场景互不重复。',
    },
  ],

  exitTicket: {
    intro:
      '8 题当场判分给一句诊断，打完记下你最弱的一环在哪里。',
    questions: [
      {
        id: 'c04-exit-1',
        type: 'contextChoice',
        prompt: 'The power plant provides electricity to the town. 中 plant 指什么？',
        narration: '整句读完，判断 plant 在这句里落到了哪个场景。',
        speak: 'The power plant provides electricity to the town.',
        choices: [
          { label: '发电厂', correct: true },
          { label: '植物', correct: false },
          { label: '种植动作', correct: false },
        ],
        answer: '发电厂',
        hint: '看它前面的 power 和后面的 electricity，两个词是同一伙的。',
        explain: 'power plant 是发电厂的固定说法，plant 表植物或种植时，句子会给出花园、种子这类线索。',
      },
      {
        id: 'c04-exit-2',
        type: 'choice',
        prompt: '下面哪一块能整个搬走当搭配记？',
        narration: '三个选项都含同一个动词，差别藏在中间。',
        speak: 'make a decision',
        choices: [
          { label: 'make a decision', correct: true },
          { label: 'make decision', correct: false },
          { label: 'do a decision', correct: false },
        ],
        answer: 'make a decision',
        hint: 'decision 是可数名词，想想它前面该不该带冠词。',
        explain:
          'make a decision 才是固定搭配，缺了 a 母语者会觉得句子没写完，decision 也不和 do 连用。',
      },
      {
        id: 'c04-exit-3',
        type: 'contextChoice',
        prompt: 'The stars are visible to the naked eye. 中 visible to 说的是什么？',
        narration: '把 to 后面的 naked eye 一起读进来判断。',
        speak: 'The stars are visible to the naked eye.',
        choices: [
          { label: '肉眼能够看见', correct: true },
          { label: '肉眼觉得重要', correct: false },
          { label: '肉眼已经习惯了', correct: false },
        ],
        answer: '肉眼能够看见',
        hint: 'visible 是看得见，to 引出的是拥有这个能力的一方。',
        explain: 'be visible to someone 表示能被某方看见，这句说的是星星凭肉眼就能看到。',
      },
      {
        id: 'c04-exit-4',
        type: 'fill',
        prompt: '补全句子中缺少的部分。She refused ___ (answer) the question.',
        narration: '按 refuse 的句型把空填上，动词以 answer 为准。',
        speak: 'She refused to answer the question.',
        answer: 'to answer',
        hint: 'refuse 后面接动词时走的是不定式那条路。',
        explain: 'refuse to do 是标准句型，所以填 to answer，接名词时才直接把东西放后面。',
      },
      {
        id: 'c04-exit-5',
        type: 'choice',
        prompt: '哪一句是没有场景的假语境？',
        narration: '三句都语法成立，看哪句拍不出画面。',
        choices: [
          { label: 'I use the word visible.', correct: true },
          { label: 'There were no visible signs of damage.', correct: false },
          { label: 'The warning light made the rocks visible at night.', correct: false },
        ],
        answer: 'I use the word visible.',
        hint: '真假语境看句子里有没有具体的时间、地点或画面。',
        explain:
          '第一句只在谈论用词本身，没交代任何场景，后两句分别写出损坏迹象和夜里灯光，都能拍成一张图。',
      },
      {
        id: 'c04-exit-6',
        type: 'fill',
        prompt: '用惯用动词补全句子。He ___ knowledge about finance every week.',
        narration: '动词要和英语的习惯搭配对上，同时跟着主语变位。',
        answer: 'gains',
        hint: 'gain 和 knowledge 是老搭档，He 作主语，动词记得跟着变位。',
        explain:
          'learn knowledge 是中文逐字搬来的，英文固定说 gain knowledge，第三人称单数写成 gains。',
      },
      {
        id: 'c04-exit-7',
        type: 'choice',
        prompt: '哪一组才算给 visible 造了两个不同场景的句子？',
        narration: '三组都是两个句子，判断场景有没有真的换开。',
        choices: [
          { label: '一句写天上的星星，一句写损坏的迹象', correct: true },
          { label: '两句都是写星星，只差单复数', correct: false },
          { label: '两句都在重复同一个短语', correct: false },
        ],
        answer: '一句写天上的星星，一句写损坏的迹象',
        hint: '场景指的是画面不同，不是同一个画面换个说法。',
        explain:
          '两个场景要求句子落在不同的画面上，星星和损坏迹象分属两处，单复数变化和短语重复都还停在一个场景里。',
      },
      {
        id: 'c04-exit-8',
        type: 'construct',
        prompt: '用 make up 造一个和说谎无关的句子，比如化妆或弥补的场景。',
        narration: '这次造句要换一个义项，三问照旧自检。',
        speak: 'She made up her face before the interview.',
        answer: '参考句 She made up her face before the interview.',
        hint: 'make up 接脸面是化妆，接时间或损失是弥补。',
        explain:
          '换场景就换义项，化妆常说 make up her face，补时间常说 make up for lost time，语境替你把意思定下来。',
      },
    ],
    bands: [
      { until: 8, verdict: '搭配块和双场景都拿下了，这一课的路你已经走通。' },
      { until: 5, verdict: '搭配块有了，造句还差一个场景，回第六单元再种一次。', route: 'u6' },
      { until: 0, verdict: '先回第二单元补句型和搭配，再回来打这张出门条。', route: 'u2' },
    ],
  },

  selfCheck: [
    '我能为刚学的词说出至少一个真实搭配块吗？',
    '我能用同一个词造出两个不同场景的句子吗？',
    '遇到 refuse，我能立刻说出它接 to do 还是直接接名词吗？',
    '我能一眼认出没有场景的空句，并说出它病在哪里吗？',
    '我核对过自己造的句，搭配是按英语习惯记的吗？',
  ],
};
