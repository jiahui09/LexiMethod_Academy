import type { Course } from '../courseSchema';

export const course06: Course = {
  id: 'spaced-repetition',
  order: 6,
  stage: 'encode',
  title: '间隔重复法',
  subtitle: '把复习排成一张时刻表的排期员',
  goal: '学完你能先回忆再揭示并诚实自评，还能排出属于自己的 1/3/7/14/30 复习表。',
  durationMin: 35,

  opening: {
    lead: '先默写上周学的三个词，再答五道复习习惯题，一分钟出你的复习系统报告。',
    questions: [
      {
        id: 'c06-diag-1',
        type: 'fill',
        prompt: '默写。上周学过的一个词，意思是「决定」，把它写出来。',
        narration: '不看任何资料，凭记忆写出这个英文单词。',
        answer: 'decision',
        hint: '先想它的动词形式怎么写，再改词尾。',
        explain:
          'decision 是「决定」的名词形式，动词 decide 把词尾换成 -sion 就是它。写不出或拼错，都说明这个词还没被提取过。',
      },
      {
        id: 'c06-diag-2',
        type: 'fill',
        prompt: '默写。上周学过的一个词，意思是「可见的」，把它写出来。',
        narration: '第二个词，同样凭记忆落笔。',
        answer: 'visible',
        hint: '词根 vis 表示看，配上形容词后缀 -ible。',
        explain:
          'visible 由词根 vis（看）加 -ible 构成，意思就是看得见的。只在列表里见过它，提笔时就容易断在中间。',
      },
      {
        id: 'c06-diag-3',
        type: 'fill',
        prompt: '默写。上周学过的一个词，意思是「建设、建筑」，把它写出来。',
        narration: '第三个词，写完这道就出报告。',
        answer: 'construction',
        hint: '动词是 construct，名词要在后面加后缀。',
        explain:
          'construction 是 construct 加 -ion 的名词。三个词里长的那个最容易掉队，因为它当时只混了个眼熟。',
      },
      {
        id: 'c06-diag-4',
        type: 'choice',
        prompt: '过去七天，你复习上周生词的默认动作是哪一种？',
        narration: '按真实情况选，这份报告只对你有用。',
        choices: [
          { label: '固定几天按表来看', correct: true },
          { label: '想起来才翻一次', correct: false },
          { label: '没有安排，靠碰', correct: false },
        ],
        answer: '固定几天按表来看',
        hint: '选你实际做的那一个，报告要靠它定位问题。',
        explain:
          '按表复习才算有系统。想起来才翻会漏掉大部分词，因为忘掉的时候你不会收到提醒。',
      },
      {
        id: 'c06-diag-5',
        type: 'choice',
        prompt: '复习一个词的时候，哪种做法真的在练提取？',
        narration: '三种做法都能完成，练到的东西不一样。',
        choices: [
          { label: '合上资料先自己想', correct: true },
          { label: '打开列表通读一遍', correct: false },
          { label: '把词抄三遍', correct: false },
        ],
        answer: '合上资料先自己想',
        hint: '想一想考场上那个你，手边有什么。',
        explain:
          '合上资料先想，练的是从记忆里往外取。通读和抄写只让眼睛和手忙起来，词还是取不出来。',
      },
      {
        id: 'c06-diag-6',
        type: 'choice',
        prompt: '复习时有个词怎么都想不起来，这张卡该怎么排？',
        narration: '给这张卡选一个下一步动作。',
        choices: [
          { label: '退回今天重新排', correct: true },
          { label: '留在原档继续', correct: false },
          { label: '直接标成已掌握', correct: false },
        ],
        answer: '退回今天重新排',
        hint: '想不起来，说明这次的间隔是长了还是短了。',
        explain:
          '提取失败说明间隔推得太快，今天把这张卡重新排，从今天数第 1 天再测。留在原档，下一次忘得更彻底。',
      },
      {
        id: 'c06-diag-7',
        type: 'choice',
        prompt: '某天到期的卡攒到 60 张，怎么处理更稳？',
        narration: '到期量大的那一天，最能看出排期习惯。',
        choices: [
          { label: '分批做完今天的量', correct: true },
          { label: '一口气全部刷完', correct: false },
          { label: '全部顺延到明天', correct: false },
        ],
        answer: '分批做完今天的量',
        hint: '越往后做，判断越容易走样。',
        explain:
          '本站把 50 张定为一次的上限，超过之后准确率明显下滑。分批守得住质量，顺延只会让卡越积越多。',
      },
      {
        id: 'c06-diag-8',
        type: 'choice',
        prompt: '自评打「记得」，应该以什么为准？',
        narration: '这一题决定你的自评可不可信。',
        choices: [
          { label: '不看答案能说出词义', correct: true },
          { label: '这个词看着挺熟', correct: false },
          { label: '上次答对过', correct: false },
        ],
        answer: '不看答案能说出词义',
        hint: '考场上没有「看着熟」这个选项。',
        explain:
          '自评以能否独立说出为准。看着熟、上次对过，都会把还没记住的卡推到更远的档位，代价在后面等着。',
      },
    ],
    bands: [
      {
        until: 8,
        verdict: '你已经有复习习惯，把动作换成回忆就齐了。',
        route: 'u4',
      },
      {
        until: 5,
        verdict: '你复习靠临时想起来，缺的是一张固定时刻表。',
        route: 'u2',
      },
      {
        until: 2,
        verdict: '上周的词基本没再碰，复习系统还没建起来。',
        route: 'u1',
      },
      {
        until: 0,
        verdict: '三个默写全空，回 U1 从遗忘曲线看起，别跳单元。',
      },
    ],
  },

  units: [
    {
      id: 'u1',
      title: '同样学 1 小时，7 天后差很远',
      durationMin: 5,
      claim: '遗忘先快后慢，第一次复习要赶在忘光之前。',
      blocks: [
        {
          kind: 'demo',
          ref: 'forgetting-curve',
          caption: '刚学完的几小时掉得最快，往后曲线越来越平缓。',
        },
        {
          kind: 'example',
          text: '刚背完的 decision 隔两天提笔就忘，中间没有排复习。',
          speak: 'decision',
        },
        {
          kind: 'warning',
          text: '只学不复习，一周后剩下的很有限。',
        },
      ],
      practice: {
        kind: 'diagnostic',
        title: '默写诊断揭晓',
        prompt: '对照开场三道默写题，记下答对几个、卡在哪个词，三个核对完再进下一单元。',
        debrief: '卡住的词说明它上周没被排进复习，这正是本课要修的地方。',
      },
      check: '我能说出遗忘曲线先陡后平，并指出自己上周卡在哪个词。',
    },
    {
      id: 'u2',
      title: '在曲线上找甜点合意难度',
      durationMin: 6,
      claim: '复习卡在快忘还没忘的位置最省力。',
      blocks: [
        {
          kind: 'demo',
          ref: 'desirable-difficulty',
          caption: '太早复习太轻松，太晚复习要重学，中间那段最省力。',
        },
        {
          kind: 'example',
          text: '今天学的词隔一天再来测，比当天通读更能看出记没记住。',
        },
        {
          kind: 'warning',
          text: '刚学完就反复看，力气全花在最轻松的区间。',
        },
      ],
      practice: {
        kind: 'recallTiming',
        title: '最佳复习时机',
        prompt: '在曲线上点出你认为最划算的复习时机，点中甜点区并说得出理由算过。',
        debrief: '太早太轻松，太晚要重学，快忘还没忘的那一段才是甜点。',
      },
      check: '我能指出曲线上的甜点位置，并说清太早和太晚各亏在哪。',
    },
    {
      id: 'u3',
      title: '回忆不等于重读',
      durationMin: 7,
      claim: '合上书把它想出来，才算练过一次记忆。',
      blocks: [
        {
          kind: 'demo',
          ref: 'recall-vs-reread',
          caption: '同一组词，先遮住再想和直接再看一遍，效果差得明显。',
        },
        {
          kind: 'example',
          text: '拿 construction 试一下，先遮住中文说出意思，再揭示核对。',
          speak: 'construction',
        },
        {
          kind: 'warning',
          text: '重读带来的熟悉感会被当成会了，考场上照样写不出。',
        },
      ],
      practice: {
        kind: 'revealSelf',
        title: '回忆、揭示、自评三拍',
        prompt:
          '三张卡逐张来，先遮住答案自己回忆，再揭示，最后如实打「记得」或「忘了」，三张做完算过。',
        debrief: '自评虚报会把卡推到更远的档位，本站把一致率验收线定在 90%，诚实比全对更重要。',
      },
      check: '我能完整走完一次回忆、揭示、自评三拍。',
      labLink: { tab: 'phonemes', label: '去实验室练回忆' },
    },
    {
      id: 'u4',
      title: '排期规则 1/3/7/14/30',
      durationMin: 7,
      claim: '答对升一档，答错退回今天，本站把间隔简化成五级。',
      blocks: [
        {
          kind: 'demo',
          ref: 'srs-timeline',
          caption: '新词今天入表，答对往后推一档，答错回到今天。',
        },
        {
          kind: 'list',
          items: [
            '第 1 天，堵住一夜之间的流失',
            '第 3 天，跨过最陡的那一段',
            '第 7 天，挂进每周的节律',
            '第 14 天，把词转成稳定记忆',
            '第 30 天，接近不用想就能用',
            '这五级是本站的简化模型',
            '正式算法有 SM-2、FSRS、Leitner',
            '间隔起效的现象叫 spacing effect',
            '五档都从起算那天数，答错从今天重数，第 1 天就是明天',
          ],
        },
        {
          kind: 'warning',
          text: '答错还留在原档，下次照样忘，卡片必须退回今天。',
        },
      ],
      practice: {
        kind: 'choice',
        title: '排期决策题',
        prompt: '四道情境题各选升档、降档或保持，四题全对算过。',
        debrief: '判断只看一件事，这次有没有靠自己独立想出来，首学、复习、过量学习各记各的账。',
      },
      check: '我能说出五档间隔，以及升降档各自的发生条件。',
    },
    {
      id: 'u5',
      title: '假复习甄别',
      durationMin: 5,
      claim: '通读、虚报、一次刷太多，这三种复习全是假动作。',
      blocks: [
        {
          kind: 'warning',
          text: '列表通读一遍就打勾，考场上照样提笔忘字。',
        },
        {
          kind: 'example',
          text: '自评说记得，合上书却说不出词义，这一档就被推远了。',
        },
        {
          kind: 'list',
          items: ['通读不算一次回忆', '虚报记得会推远档位', '一次超过 50 张要分批'],
        },
      ],
      practice: {
        kind: 'choice',
        title: '情境判别',
        prompt: '四段复习描述里挑出假复习，选对三段以上算过。',
        debrief: '假复习都带着完成感，只有当场提取能拆穿它。',
      },
      check: '我能当场认出通读、虚报、一次刷太多这三种假复习。',
    },
    {
      id: 'u6',
      title: '交接 你的复习时刻表',
      durationMin: 5,
      claim: '排出一张自己的时刻表，这门课教你的是排法。',
      blocks: [
        {
          kind: 'demo',
          ref: 'schedule-builder',
          caption: '给三个新词各排一张 30 天时刻表，答错自动退回今天。',
        },
        {
          kind: 'example',
          text: '把今天的三个新词写进自己的日历，第 1、3、7、14、30 天各回来一次。',
        },
        {
          kind: 'warning',
          text: '复习表写在纸上或日历里才留得住，只在心里过一遍不算排。',
        },
      ],
      practice: {
        kind: 'construct',
        title: '排你的时刻表',
        prompt: '给今天的三个新词各排一张 1/3/7/14/30 的时刻表，三张都写清日期算过。',
        debrief: '表排出来才算会排，接下来七天照着执行，日期要亲手写下来。',
      },
      check: '我有一张写明日期的复习表，也知道它要抄到纸上。',
    },
  ],

  exitTicket: {
    intro: '八道题覆盖本课目标，当场判分出一句诊断，顺手圈出你最弱的一环。',
    questions: [
      {
        id: 'c06-exit-1',
        type: 'choice',
        prompt: '刚学完的一批词，接下来的遗忘速度是什么样的？',
        narration: '回忆 U1 看过的那条曲线。',
        choices: [
          { label: '先陡后平', correct: true },
          { label: '先平后陡', correct: false },
          { label: '每天掉得一样多', correct: false },
        ],
        answer: '先陡后平',
        hint: '最开始那几个小时最要命。',
        explain:
          '曲线先陡后平，刚学完掉得最快，往后越来越慢。第一次复习因此要来得早，赶在陡坡上。',
      },
      {
        id: 'c06-exit-2',
        type: 'choice',
        prompt: '下面哪个时机复习同一个词最省力？',
        narration: '三个时机都在同一条曲线上，代价不同。',
        choices: [
          { label: '快忘还没忘的时候', correct: true },
          { label: '刚学完马上再看', correct: false },
          { label: '全忘光了再补', correct: false },
        ],
        answer: '快忘还没忘的时候',
        hint: '想想哪一种会让你费最多力气重新学。',
        explain:
          '刚学完太轻松，全忘光要重学，快忘还没忘那一段最省力。这个位置就是合意难度。',
      },
      {
        id: 'c06-exit-3',
        type: 'choice',
        prompt: '今天是第 7 天，这张卡你答对了，下次复习排在哪天？',
        narration: '按 1/3/7/14/30 的顺序往后推一档。',
        choices: [
          { label: '第 14 天', correct: true },
          { label: '第 10 天', correct: false },
          { label: '第 3 天', correct: false },
        ],
        answer: '第 14 天',
        hint: '档位只有五个，答对只往后推一档。',
        explain:
          '本站把档位简化成 1、3、7、14、30 天五级，第 7 天答对就推到第 14 天。',
      },
      {
        id: 'c06-exit-4',
        type: 'choice',
        prompt: '复习时有个词卡住了，正确的动作是？',
        narration: '卡住说明这次提取失败了。',
        choices: [
          { label: '退回今天重新排', correct: true },
          { label: '保持原档不动', correct: false },
          { label: '改成两天后再试', correct: false },
        ],
        answer: '退回今天重新排',
        hint: '判断这次的间隔是长了还是短了。',
        explain:
          '提取失败说明间隔太长，今天把这张卡重新排，从今天数第 1 天再测。保持原档，下一次照样卡住。',
      },
      {
        id: 'c06-exit-5',
        type: 'fill',
        prompt: '新词今天入表，第一次复习安排在第几天？',
        narration: '填一个数字就行。',
        answer: '1',
        hint: '刚学完的东西，隔一夜就该回来一次。',
        explain:
          '第一次复习在第 1 天，用来堵住一夜之间的流失，之后再按 3、7、14、30 往后走。',
      },
      {
        id: 'c06-exit-6',
        type: 'fill',
        prompt: '先朗读这个词，再写出拼写，它的意思是「时刻表」。',
        narration: '读出声，再落笔写拼写。',
        speak: 'schedule',
        answer: 'schedule',
        hint: '打开手机日历，那个功能名就是它。',
        explain:
          'schedule 的意思正是时刻表、安排，也是本课的最终产出。读音英美有别，拼写只有一个。',
      },
      {
        id: 'c06-exit-7',
        type: 'choice',
        prompt: '某天到期的卡有 60 张，正确的做法是？',
        narration: '这一天的量已经超过了本站上限。',
        choices: [
          { label: '分两批做完', correct: true },
          { label: '一次全部刷完', correct: false },
          { label: '先放着不管', correct: false },
        ],
        answer: '分两批做完',
        hint: '记住本站那条 50 张的上限。',
        explain:
          '一次超过 50 张，后面的卡基本靠猜，自评也跟着失真。分两批做，才能保住判断质量。',
      },
      {
        id: 'c06-exit-8',
        type: 'fill',
        prompt: '自评「记得」的比例和实际能想起来的比例，一致率至少要到多少？',
        narration: '填一个百分比。',
        answer: '90%',
        hint: '本站定的验收线，是个整数百分比。',
        explain:
          '一致率至少 90%。低于这条线说明你在虚报「记得」，卡片会被推到太远的档位，下次集中崩。',
      },
    ],
    bands: [
      {
        until: 6,
        verdict: '规则你已经接上了，接下来照排出的表连做七天。',
        route: 'u6',
      },
      {
        until: 3,
        verdict: '升降档还含糊，回 U4 重做排期决策题。',
        route: 'u4',
      },
      {
        until: 0,
        verdict: '曲线和档位都没接上，从 U1 重新走一遍。',
      },
    ],
  },

  selfCheck: [
    '我能不看资料说出 1/3/7/14/30 各档的意思吗？',
    '复习时我先合上资料自己回忆，再揭示答案吗？',
    '我知道自己的「记得」自评和实测一致率够不够 90% 吗？',
    '面对一次到期超过 50 张卡，我会分批做完吗？',
    '我能当场排出一个新词未来 30 天的复习时刻表吗？',
  ],
};
