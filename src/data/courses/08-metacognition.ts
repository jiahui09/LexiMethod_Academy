import type { Course } from '../courseSchema';

export const course08: Course = {
  id: 'metacognition',
  order: 8,
  stage: 'capstone',
  title: '元认知训练',
  subtitle: '读盘、认信号、练归因，最后开一次真盘',
  goal: '三张清单和信号表落地，错题 100% 带归因，能说出自己最弱的 2 个环节。',
  durationMin: 38,

  opening: {
    lead: '回想你最近一次错题，答完这 8 道归因题，当场给你一份读盘报告。',
    questions: [
      {
        id: 'c08-diag-1',
        type: 'classify',
        prompt: '把这道错题归入正确的类别。同一道音节划分题连错三次，每次都卡在同一个位置。',
        narration: '连续三轮错在同一个地方，这是最该被抓住的信号。',
        choices: [
          { label: '知识缺口', correct: true },
          { label: '粗心', correct: false },
          { label: '时间不足', correct: false },
        ],
        answer: '知识缺口',
        hint: '三类里，重复出现在同一处的那类才是真缺口。',
        explain: '同一位置反复错说明方法还没掌握，回对应课程补方法比多刷题快。',
      },
      {
        id: 'c08-diag-2',
        type: 'classify',
        prompt: '把这道错题归入正确的类别。交卷前只剩 2 分钟，最后一题没读完题干就蒙了答案。',
        narration: '时间压力下丢的分，先把时间账算清楚。',
        choices: [
          { label: '知识缺口', correct: false },
          { label: '粗心', correct: false },
          { label: '时间不足', correct: true },
        ],
        answer: '时间不足',
        hint: '先问当时还剩多少时间，再问这题会不会做。',
        explain: '题干没读完属于时间不足，改法是砍掉当天题量或者把练习提前开始。',
      },
      {
        id: 'c08-diag-3',
        type: 'classify',
        prompt: '把这道错题归入正确的类别。题目你会做，草稿上也算对了，抄进答案时把两个数的位置写反了。',
        narration: '会做却抄错，丢的分和知识没关系。',
        choices: [
          { label: '知识缺口', correct: false },
          { label: '粗心', correct: true },
          { label: '时间不足', correct: false },
        ],
        answer: '粗心',
        hint: '能靠放慢一步解决的，就归到这一类。',
        explain: '抄写出错归粗心，动作是放慢誊抄那一步，不需要回头重学方法。',
      },
      {
        id: 'c08-diag-4',
        type: 'choice',
        prompt: '两轮听写里你都把 sheep 写成了 ship，检查了两遍也没看出来。这算哪类错因？',
        narration: '检查两遍仍然复现的错误，靠更仔细解决不了。',
        choices: [
          { label: '知识缺口', correct: true },
          { label: '粗心', correct: false },
          { label: '时间不足', correct: false },
        ],
        answer: '知识缺口',
        hint: '想一想 /ɪ/ 和 /iː/ 你能不能听出差别。',
        explain: 'ship 与 sheep 混淆是长短音的辨音缺口，去音标实验室练最小对立对才补得上。',
      },
      {
        id: 'c08-diag-5',
        type: 'choice',
        prompt: '单词表看得挺顺，每个意思都想得起来。合上表默写，只写出一半。你刚才错在哪一步？',
        narration: '读的时候很流畅，输出的时候卡住，这是最常见的误判。',
        choices: [
          { label: '把流畅感当成了掌握', correct: true },
          { label: '今天时间不够用', correct: false },
          { label: '这份词表难度太高', correct: false },
        ],
        answer: '把流畅感当成了掌握',
        hint: '判断有没有学会，要一个能分对错的结果。',
        explain: '看顺来自反复读，流畅度错觉要靠抽测来破，合上书写一遍才算数。',
      },
      {
        id: 'c08-diag-6',
        type: 'choice',
        prompt: '连续三天没完成计划，你写下「我果然记不住词」。哪句改写能让明天接着练？',
        narration: '归因怎么写，决定你明天是换动作还是停下来。',
        choices: [
          { label: '我把每天 100 词改成 30 词', correct: true },
          { label: '我比别人记性差', correct: false },
          { label: '背单词这件事不适合我', correct: false },
        ],
        answer: '我把每天 100 词改成 30 词',
        hint: '改写后的句子，要能直接变成明天的一个动作。',
        explain: '「我不行」会终止探索，改写成方法问题，你就会去减量或者换练法。',
      },
      {
        id: 'c08-diag-7',
        type: 'choice',
        prompt: '错题本你抄了三页，一周后问起错因，一条也说不出。缺的是哪一步？',
        narration: '记下来只完成了一半，另一半还没发生。',
        choices: [
          { label: '每条错题没写归因标签', correct: true },
          { label: '抄的题量还不够多', correct: false },
          { label: '复习次数太过频繁', correct: false },
        ],
        answer: '每条错题没写归因标签',
        hint: '翻一翻你的错题本，每条后面有没有原因那一栏。',
        explain: '没有归因的错题本只是誊写，下一轮它会把你带回原来那个坑。',
      },
      {
        id: 'c08-diag-8',
        type: 'choice',
        prompt: '下面哪种情况说明你现在还没有仪表盘？',
        narration: '这题测的是你对自己学习状态的可见度。',
        choices: [
          { label: '说不出最近一道错题为什么错', correct: true },
          { label: '每天固定练 20 分钟', correct: false },
          { label: '错题本写满了三页', correct: false },
        ],
        answer: '说不出最近一道错题为什么错',
        hint: '仪表盘要能读出数，读不出数的那一种就是。',
        explain: '题量、时长、本子都是投入，读不出原因就调不动方法，本课就是来装这块表的。',
      },
    ],
    bands: [
      { until: 8, verdict: '每道错题都落到了具体原因，仪表盘已经通电。', route: '直接去 U3，把信号表配上你的弱项' },
      { until: 5, verdict: '大类分得清，细分归因还会串，答案说得太笼统。', route: 'U4 归因训练重点看' },
      { until: 2, verdict: '归因多数落在「我粗心」上，原因没落到点上。', route: '从 U2 三张清单开始走' },
      { until: 0, verdict: '说不出最近一次错题为什么错，这就是没读数的样子。', route: '回 U1 跟着走，别跳单元' },
    ],
  },

  units: [
    {
      id: 'u1',
      title: '100 道题的两种人',
      durationMin: 5,
      claim: '同样做 100 道题，进步的人每轮都给错题写下原因。',
      blocks: [
        {
          kind: 'list',
          items: ['做完一轮，先数错几道', '每道错题写一个原因', '下一轮只改一个地方'],
        },
        {
          kind: 'demo',
          ref: 'diagnostic-reveal',
          caption: '刚才的 8 道归因题已经出分，点开逐题看正确归因。',
        },
        {
          kind: 'warning',
          text: '把错题攒着不归因，下一轮会在同一个地方再错一次。',
        },
      ],
      practice: {
        kind: 'diagnostic',
        title: '归因自测讲评',
        prompt: '给刚才答错的题各写一个归因标签，三分类里选一个，全标对算过。',
        debrief: '标签越具体，下一轮要改的动作越小。',
      },
      check: '我能对刚才每道错题说出一个具体原因吗？',
    },

    {
      id: 'u2',
      title: '三张清单',
      durationMin: 7,
      claim: '学前、学中、学后各一张清单，把感觉变成勾选。',
      blocks: [
        {
          kind: 'list',
          items: ['学前，定题量、目标正确率和时限', '学中，走神或假装会了就停', '学后，给错题归类再定动作'],
        },
        {
          kind: 'demo',
          ref: 'checklist-fill',
          caption: '三张清单在这里逐项勾，勾不出来的那项就是今天的问题。',
        },
        {
          kind: 'warning',
          text: '跳过学后清单直接走人，错题下轮原样复现。',
        },
      ],
      practice: {
        kind: 'checklistFill',
        title: '填清单',
        prompt: '按今天的真实情况勾完学前与学中两张清单，学中至少勾出一处走神或假装会了。',
        debrief: '勾不出来的那项就是模糊的地方，下次先补那一项。',
      },
      check: '开始练习前，我能一句话说清练什么、练到多少吗？',
    },

    {
      id: 'u3',
      title: '信号表，看到 X 就做 Y',
      durationMin: 7,
      claim: '每条信号固定配一个动作，看到就执行，不用心情做决定。',
      blocks: [
        {
          kind: 'list',
          items: [
            '听写两轮低于 60%，去练最小对立对',
            '复习卡积压，当天新词量减半',
            '四音节词划超 10 秒，回算法步 2 分辅音',
            '造句通过率低于 80%，重跑 L3 造句',
          ],
        },
        {
          kind: 'example',
          text: 'decision 划了 30 秒还没把握，回 02 课跑算法步 2 分辅音。',
          speak: 'decision',
        },
        {
          kind: 'demo',
          ref: 'signal-match',
          caption: '左边是信号，右边是唯一动作，连线全对才算读懂表。',
        },
        {
          kind: 'warning',
          text: '凭心情换方法，弱项永远轮不到被修。',
        },
      ],
      practice: {
        kind: 'signalMatch',
        title: '信号与动作配对',
        prompt: '把 6 条信号和唯一动作连起来，6 条全对算过。',
        debrief: '每条动作都写明去处，听到信号你直接照做。',
      },
      labLink: { tab: 'phonemes', label: '去音标实验室练最小对立对' },
      check: '我能说出三个信号和它们各自的动作吗？',
    },

    {
      id: 'u4',
      title: '归因训练',
      durationMin: 7,
      claim: '错因归进三类，落到哪类就改哪一处。',
      blocks: [
        {
          kind: 'list',
          items: [
            '知识缺口，同一处连错，回去补方法',
            '粗心，会做却抄错看错，放慢一步',
            '时间不足，来不及做完，砍量或提前',
          ],
        },
        {
          kind: 'demo',
          ref: 'error-classify',
          caption: '把每道错题分进三类里，分错的题当场告诉你为什么。',
        },
        {
          kind: 'warning',
          text: '写「我不行」会停住，写「方法不对」才有下一步。',
        },
      ],
      practice: {
        kind: 'errorClassify',
        title: '错因归类',
        prompt: '把 9 道真实错题分进三类里，全对并说出理由算过。',
        debrief: '归到知识缺口才需要换方法，归到粗心只需要放慢一步。',
      },
      check: '看到「我不行」，我能把它改写成一句可执行的话吗？',
    },

    {
      id: 'u5',
      title: '真实复盘实操',
      durationMin: 7,
      claim: '拿你刚才的真实错题开一次复盘，五栏填满才算完成。',
      blocks: [
        {
          kind: 'list',
          items: [
            '第一栏，抄下错题原题',
            '第二栏，写三分类归因标签',
            '第三栏，查信号表对应动作',
            '第四栏，定下轮只改的一处',
            '第五栏，自评这次复盘有没有用',
          ],
        },
        {
          kind: 'demo',
          ref: 'debrief-form',
          caption: '复盘表按五栏展开，填完当场回你一句自评。',
        },
        {
          kind: 'warning',
          text: '只抄错题不写归因，复盘就变成誊写。',
        },
      ],
      practice: {
        kind: 'debriefForm',
        title: '复盘表填写',
        prompt: '从本课诊断里挑你答错的题，把五栏复盘表填满，每栏一句话。',
        debrief: '这次填的是真错题，下一轮练习直接按第四栏改。',
      },
      check: '我能指着一道真错题，说出它属于哪一类、下次改哪一步吗？',
    },

    {
      id: 'u6',
      title: '毕业，给自己的方法写一条改进',
      durationMin: 5,
      claim: '出门前给自己的方法写一条改进，写完打出门条。',
      blocks: [
        {
          kind: 'list',
          items: ['改进条写两件事，改什么和怎么算完成', '例如新词每天减半，连续七天不漏'],
        },
        {
          kind: 'demo',
          ref: 'exit-ticket',
          caption: '写完改进条就进出门条，8 道题当场判分。',
        },
        {
          kind: 'warning',
          text: '改进条里没有数字，下周就看不出做没做到。',
        },
      ],
      practice: {
        kind: 'exitTicket',
        title: '出门条',
        prompt: '先写一条带数字的改进条，再做完 8 道出门条，答对 6 道算过关。',
        debrief: '分数只在本次会话有效，改进条要自己抄走才算数。',
      },
      check: '我能一句话说出自己最弱的 2 个环节和对应动作吗？',
    },
  ],

  exitTicket: {
    intro: '8 道题当场判分，测三张清单、信号表和错因三分类有没有落地。',
    questions: [
      {
        id: 'c08-exit-1',
        type: 'choice',
        prompt: '开始练习前，哪一条该出现在你的学前清单上？',
        narration: '学前清单要能在学后对着勾。',
        choices: [
          { label: '今晚练听写 20 分钟，目标正确率 70%', correct: true },
          { label: '把第三章的词表看完', correct: false },
          { label: '尽量多做几套题', correct: false },
          { label: '学一会儿再说', correct: false },
        ],
        answer: '今晚练听写 20 分钟，目标正确率 70%',
        hint: '写完这一条，今晚结束时你就知道达没达标。',
        explain: '题量、时限和目标正确率写全，学后那一栏才有东西可以勾。',
      },
      {
        id: 'c08-exit-2',
        type: 'classify',
        prompt: '把这道错题归入正确的类别。题目你会做，草稿也算对了，誊到答案上时少写了一个零。',
        narration: '这题考的是三分类的边界。',
        choices: [
          { label: '知识缺口', correct: false },
          { label: '粗心', correct: true },
          { label: '时间不足', correct: false },
        ],
        answer: '粗心',
        hint: '判断标准只有一条，靠放慢一步能不能解决。',
        explain: '誊抄出错归粗心，动作是放慢誊抄那一步，不用回头重学方法。',
      },
      {
        id: 'c08-exit-3',
        type: 'choice',
        prompt: '两轮听写正确率都掉到 60% 以下，按信号表你先做什么？',
        narration: '这条信号在站内有固定去处。',
        choices: [
          { label: '回音标实验室练最小对立对', correct: true },
          { label: '今天新词加到 50 个', correct: false },
          { label: '把听写题再抄一遍', correct: false },
          { label: '跳过听写改做阅读', correct: false },
        ],
        answer: '回音标实验室练最小对立对',
        hint: '信号表里这条信号只配一个动作。',
        explain: '正确率低说明音形对应没焊牢，实验室的最小对立对专攻这一处。',
      },
      {
        id: 'c08-exit-4',
        type: 'choice',
        prompt: '复习卡积压了 60 张，今天该动哪个数字？',
        narration: '积压是流入超过可完成量的读数。',
        choices: [
          { label: '新词量减半', correct: true },
          { label: '把复习推到周末一起刷', correct: false },
          { label: '一口气清完 60 张', correct: false },
          { label: '今晚熬夜补进度', correct: false },
        ],
        answer: '新词量减半',
        hint: '先动进的那一头，再清存的那一头。',
        explain: '新词减半让当天流入小于可完成量，积压才能在几天内清零。',
      },
      {
        id: 'c08-exit-5',
        type: 'choice',
        prompt: '四音节词划一个要 30 秒还没把握，卡在算法的哪一步？',
        narration: '划词变慢，先倒回算法停下的那一步。',
        choices: [
          { label: '算法步 2 分辅音没跑熟', correct: true },
          { label: '算法步 3 定重音没背熟', correct: false },
          { label: '音节划分根本不该用算法', correct: false },
          { label: '先背完词表再来划词', correct: false },
        ],
        answer: '算法步 2 分辅音没跑熟',
        hint: '回 02 课的三步算法，从第一步开始倒。',
        explain: '划不动多半停在分辅音，让后一个音节能读出来这条还没练成。',
      },
      {
        id: 'c08-exit-6',
        type: 'choice',
        prompt: '合上笔记觉得全都会，怎么确认是真会？',
        narration: '这题测你会不会破流畅度错觉。',
        choices: [
          { label: '抽 5 道题当场做', correct: true },
          { label: '把笔记再读两遍', correct: false },
          { label: '在心里默一遍要点', correct: false },
          { label: '照着笔记给自己打个分', correct: false },
        ],
        answer: '抽 5 道题当场做',
        hint: '选那个能给出对错结果的动作。',
        explain: '流畅感来自反复读，抽测才给出对错，重读时的把握不作数。',
      },
      {
        id: 'c08-exit-7',
        type: 'construct',
        prompt: '写出你现在最弱的 2 个环节，各用两三个字，例如听写、划词。',
        narration: '这道要你自己落笔，全课的可观察目标就在这里。',
        answer: '你自己的两项弱环节，例如 听写 和 划词',
        hint: '从本课诊断里挑你错得最多的两类。',
        explain: '能点名 2 个环节，信号表才知道该往哪两个地方接动作。',
      },
      {
        id: 'c08-exit-8',
        type: 'choice',
        prompt: '哪一条改进条下周能核对完成情况？',
        narration: '出门前的最后一条，考改进条的写法。',
        choices: [
          { label: '每晚 20 分钟先练听写，连续七天', correct: true },
          { label: '以后认真一点', correct: false },
          { label: '多背点单词', correct: false },
          { label: '找时间好好复习', correct: false },
        ],
        answer: '每晚 20 分钟先练听写，连续七天',
        hint: '改进条里要能数出数来。',
        explain: '带数字和时间的改进条一周后能直接对勾，模糊承诺核对不了。',
      },
    ],
    bands: [
      { until: 8, verdict: '三张清单、信号表、归因三分类全部落地，仪表盘开得起来。', route: '把改进条抄进明晚的学前清单' },
      { until: 4, verdict: '信号和清单记住大半，归因还会串类，回 U4 再跑一轮。', route: '重做 U4 错因归类' },
      { until: 0, verdict: '今天的内容还没落地，回 U2 从三张清单重新走。', route: '按单元顺序走，别跳' },
    ],
  },

  selfCheck: [
    '练习前后，我会把学前清单和复盘清单各勾一遍吗？',
    '我最近的每道错题都能说出一个归因标签吗？',
    '我能不看课件说出自己当前最弱的 2 个环节吗？',
    '听写正确率掉到 60% 以下时，我会先去练最小对立对吗？',
    '我能给自己写出一条带数字的本周改进吗？',
  ],
};
