/**
 * LexiMethod Academy — 课程辅助清单数据
 * 音节划分指南 / 重音定位指南 / 语境记忆操作笔记 / 元认知自查清单 /
 * 策略调整（信号→诊断→调整）/ 间隔复习节奏 / 主动输出训练。
 * （原「学习工具箱」页面已随站点削减移除；本文件保留，供课程步骤引用。）
 */

/* ------------------------------------------------------------------ */
/* 音节划分指南                                                        */
/* ------------------------------------------------------------------ */

export const syllableGuides: { id: string; title: string; rule: string; examples: string[] }[] = [
  {
    id: 'sg-vowel',
    title: '数元音定音节数',
    rule:
      '音节数等于“元音核心”的个数：数出 a、e、i、o、u（字母组合算一个核心），词尾 y 在多音节词里也算一个核心；有几个核心就有几个音节，这是划分前的第一步。',
    examples: ['cat → 1 个核心 → 1 音节', 'water → 2 个核心 → 2 音节 wa·ter', 'happy → 词尾 y 是核心 → 2 音节 hap·py'],
  },
  {
    id: 'sg-back',
    title: '从后往前，在“辅元接缝”下刀',
    rule:
      '从词尾往前找“辅音+元音”的接缝，每碰到一个元音核心就切一刀；两个辅音夹在元音之间时一前一后各归一边，双写辅音才从中间切开。',
    examples: ['rab·bit（双写 b → 中间切）', 'sis·ter（s、t 各归一边）', 'ba·na·na（每刀都落在辅元之间）'],
  },
  {
    id: 'sg-magice',
    title: 'magic e 不单独成音节',
    rule:
      '词尾不发音的 e 不占音节，也不做核心：它并入前面的音节，只负责让前面的元音读长音，划分时千万别把它切成一截。',
    examples: ['name → 1 音节', 'time → 1 音节', 'these → 1 音节', 'change → 1 音节'],
  },
  {
    id: 'sg-tion',
    title: '-tion / -sion 整体成一个音节',
    rule:
      '词尾 -tion、-sion 读 /ʃn/ 或 /ʒn/，本身就是一个完整音节，永远整体切出，绝不把 t、s、i 拆散到两个音节里。',
    examples: ['na·tion', 'de·ci·sion', 'in·ven·tion', 'e·du·ca·tion'],
  },
  {
    id: 'sg-le',
    title: '词尾“辅音+le”自成音节',
    rule:
      '-le、-el、-en、-on 结尾时，前一个辅音与它们共同构成弱读音节（/l̩/、/n̩/），其中的元音几乎不出声，是长词多出一个音节的常见原因。',
    examples: ['ta·ble（ble 读 /bl̩/）', 'lit·tle', 'but·ton', 'o·pen'],
  },
  {
    id: 'sg-affix',
    title: '前后缀各自先切成一块',
    rule:
      '前缀和后缀通常自成音节：先剥词缀、再划词根，unhappiness 这样的长词立刻缩成四小块，划分难度和记忆难度同时下降。',
    examples: ['un·hap·pi·ness', 'dis·ap·pear', 'im·pos·si·ble', 're·view'],
  },
  {
    id: 'sg-cluster',
    title: '辅音连缀不硬塞给某一边',
    rule:
      'str、pl、ct 这类连缀要整体滑读；夹在元音间的两个不同辅音按“一前一后”分配，划分结果既符合读音也方便朗读节奏。',
    examples: ['help·ful（p 归前、f 归后）', 'dic·tion（ct 不拆散，tion 整体）', 'prob·lem'],
  },
];

/* ------------------------------------------------------------------ */
/* 重音定位指南                                                        */
/* ------------------------------------------------------------------ */

export const stressGuides: { id: string; title: string; rule: string; examples: string[] }[] = [
  {
    id: 'ssg-noun-verb',
    title: '双音节：名前动后',
    rule: '同形的名词与动词，重音在前读名词、在后读动词；听音先判词性，词义和读音一起定。',
    examples: ['ˈrecord 唱片 / reˈcord 记录', 'ˈproduce 农产品 / proˈduce 生产', 'ˈimport 进口货 / imˈport 进口'],
  },
  {
    id: 'ssg-tion',
    title: '-tion / -sion 前一音节重读',
    rule: '凡带 -tion、-sion 的词，重音永远落在它前面那个音节，倒着数一格即可，几乎无例外。',
    examples: ['inˈvention', 'deˈcision', 'eduˈcation', 'orˌganiˈzation'],
  },
  {
    id: 'ssg-antepen',
    title: '三个音节以上看“倒三”',
    rule: '多音节词默认重音在倒数第三个音节；先按倒三标注，再用 -ic、-ity 等后缀规则修正。',
    examples: ['ˈhistory（his·to·ry）', 'ˈmemory（mem·o·ry）', 'ˈmedicine（med·i·cine）'],
  },
  {
    id: 'ssg-prefix',
    title: '前缀弱读，词根重读',
    rule: 're-、dis-、in-、pre- 等前缀一般不带重音；剥掉前缀，重音自然落到词根的起始位置。',
    examples: ['reˈport', 'disˈcover', 'inˌtroˈduce'],
  },
  {
    id: 'ssg-ic',
    title: '-ic / -ity / -ical 定位重音',
    rule: '-ic、-ity 把重音拉到它们前面那个音节，-ical 则常落在倒数第三；换后缀时重音可能搬家。',
    examples: ['eˈlectric', 'univerˈsity', 'poˈlitical', 'photoˈgraphic'],
  },
  {
    id: 'ssg-shift',
    title: '词性切换，重音跟着移动',
    rule: '不止 record：contract、object、present 等同形词靠重音区分词性，读错重音会被听成另一个词。',
    examples: ['ˈcontract 合同 / conˈtract 签合同', 'ˈobject 物体 / obˈject 反对', 'ˈpresent 礼物 / preˈsent 呈送'],
  },
  {
    id: 'ssg-content',
    title: '语流中实词重读、功能词弱读',
    rule: '连贯说话时，名词、动词、形容词、副词等实词承担重音，冠词、介词、代词弱读甚至连读，句子的节奏由此产生。',
    examples: ['The ˈbook is on the ˈtable.', 'I ˈreally ˈwant to ɡo.', 'ˈMake a deˈcision toˈday.'],
  },
];

/* ------------------------------------------------------------------ */
/* 语境记忆法：操作笔记                                                 */
/* ------------------------------------------------------------------ */

export const contextNotes: { id: string; title: string; note: string; example: string }[] = [
  {
    id: 'cn-chunk',
    title: '搭配块：整块吞，不拆单',
    note: '不要孤立背名词，把“动词+名词”“形容词+名词”当成一块学，提取时整块调用，口语和写作几乎不用现拼。',
    example: 'make a decision（做决定）／take responsibility（承担责任）—— 三遍成诵，替换其中一个词再造一块。',
  },
  {
    id: 'cn-group',
    title: '意群朗读：按块切句子',
    note: '长句按意群（主语块、谓语块、介词块）停顿朗读，词在块里才有节奏；先划斜线，再一口气读一块。',
    example: 'If it rains tomorrow, / we will stay at home. / 划两刀、读两口气，词汇随块一起被记住。',
  },
  {
    id: 'cn-image',
    title: '图片化：抽象词转画面',
    note: '把抽象动词、形容词变成一帧有动作的画面，越荒诞越好记；画面建立后再连回词义和搭配。',
    example: 'hesitate → 站在路口抬脚又放下、来回踱步的画面；造句时先把画面放出来再说词。',
  },
  {
    id: 'cn-transfer',
    title: '母语迁移：只借意思，不借读音',
    note: '中文能帮忙记意思的场景要标注出来，但读音、搭配绝不能照搬；凡中文谐音记忆的词，必须回头对照音标纠一次。',
    example: 'library 不要念“赖不瑞”——先看 /ˈlaɪbrəri/ 划音节 li·bra·ry，再用中文挂意思。',
  },
  {
    id: 'cn-self',
    title: '自我代入：造自己的句子',
    note: '用自己、朋友、正在做的事造句，自我参照效应让记忆留存率翻倍；每个新词至少造一个与自己有关的句子。',
    example: 'reluctant → My brother is reluctant to get up on cold mornings.',
  },
  {
    id: 'cn-scene',
    title: '场景串词：一个场景一组词',
    note: '把同一场景的词编成一条线索（谁、在哪、做什么），提取时牵一发动全身，一组词同时被唤醒。',
    example: '餐厅场景：reserve → order → recommend → bill → tip，串成一次点餐的完整故事。',
  },
];

/* ------------------------------------------------------------------ */
/* 元认知自查清单                                                      */
/* ------------------------------------------------------------------ */

export const metacogChecklist: {
  id: string;
  label: string;
  group: '识别' | '计划' | '监控' | '复盘';
}[] = [
  { id: 'mc-id-1', label: '我能先说出这个词的音节结构和重音位置，再去看释义。', group: '识别' },
  { id: 'mc-id-2', label: '我试着拆出这个词的前缀、词根、后缀，并说出已知部件的意思。', group: '识别' },
  { id: 'mc-id-3', label: '我能指出它和哪个已学过的词长得像，并说清两者的区别。', group: '识别' },
  { id: 'mc-id-4', label: '我对这个词是“认得出脸”还是“能默写出来”，心里有数。', group: '识别' },
  { id: 'mc-pl-1', label: '今天的新词量控制在当天能全部回忆一遍的范围内。', group: '计划' },
  { id: 'mc-pl-2', label: '我已选好方法：音形规则、词根词缀、语境块还是图片联想。', group: '计划' },
  { id: 'mc-pl-3', label: '我已排好复习时间点：第 1、3、7、14、30 天各复习什么。', group: '计划' },
  { id: 'mc-pl-4', label: '今天安排了至少一项主动输出：听写、造句或口头复述。', group: '计划' },
  { id: 'mc-mo-1', label: '读音卡壳时我停下来做音节划分，而不是凭感觉硬猜。', group: '监控' },
  { id: 'mc-mo-2', label: '正确率连续走低时，我减少新词量并改做回忆式练习。', group: '监控' },
  { id: 'mc-mo-3', label: '发现自己走神超过一分钟，我立刻换任务形式或起身休息。', group: '监控' },
  { id: 'mc-mo-4', label: '一个方法用了十分钟仍无效，我会当场换另一条路径。', group: '监控' },
  { id: 'mc-re-1', label: '今天错的词我已标明错因：读音、拼写还是词义。', group: '复盘' },
  { id: 'mc-re-2', label: '我说得出哪个方法对我最有效、哪一个几乎没用。', group: '复盘' },
  { id: 'mc-re-3', label: '错题已进错词本，并设好了下一次复习的日期。', group: '复盘' },
  { id: 'mc-re-4', label: '我用一句话写下了明天要做的首要调整。', group: '复盘' },
];

/* ------------------------------------------------------------------ */
/* 策略调整：学习信号 → 诊断 → 改法                                     */
/* ------------------------------------------------------------------ */

export const strategyTuning: {
  id: string;
  signal: string;
  diagnosis: string;
  fix: string;
}[] = [
  {
    id: 'st-1',
    signal: '看到生词先沉默，一开口就读错',
    diagnosis: '音形对应没有建立，还在用“字母名”而不是“音素”读词。',
    fix: '先做音节划分再查音标，把每个字母组合的读音标出来，慢速跟读三遍后合上答案重读。',
  },
  {
    id: 'st-2',
    signal: '单词当天会，隔天全部还回去',
    diagnosis: '内容只进入瞬时记忆，缺少按遗忘曲线安排的间隔复习。',
    fix: '启用第 1、3、7、14、30 天的复习节奏，每次复习先回忆再核对，不看书记忆才算过关。',
  },
  {
    id: 'st-3',
    signal: '阅读里认得，开口时却想不起来',
    diagnosis: '只有被动识别输入，没有主动提取与输出的练习。',
    fix: '每天加 5 分钟输出：用当天的词口头造句或做一分钟复述，逼大脑“调取”而不是“再认”。',
  },
  {
    id: 'st-4',
    signal: '规则能背下来，做题时照样错',
    diagnosis: '规则停留在语言层面，没有和具体例词绑在一起存储。',
    fix: '每条规则强制记 3 个例词，做题时先默想例词再套规则，用例词当规则的“检索锚点”。',
  },
  {
    id: 'st-5',
    signal: 'quite 与 quiet 这类词总互相串',
    diagnosis: '缺少对比区分，两个词在脑中是模糊的一团。',
    fix: '建立最小对比对卡片：并排写出两词的音标、拆音节与图片化释义，成对朗读成对默写。',
  },
  {
    id: 'st-6',
    signal: '单次越学越久，效果却不再涨',
    diagnosis: '单次新词量过大，学习变成了“反复看”而不是“反复回忆”。',
    fix: '砍掉一半新词量，把省下的时间换成 3 次短时回忆测试，缩短单次时长、提高提取次数。',
  },
  {
    id: 'st-7',
    signal: '复习题全对，隔周阅读仍觉得生',
    diagnosis: '复习停留在“再认”，词汇没有回到真实语境里被使用。',
    fix: '把复习升级为语境自测：每个词配一个真实句子朗读并改写，再在阅读中标出它的搭配块。',
  },
];

/* ------------------------------------------------------------------ */
/* 间隔复习节奏                                                        */
/* ------------------------------------------------------------------ */

export const reviewRhythm: { id: string; day: number; focus: string; action: string }[] = [
  {
    id: 'rr-1',
    day: 1,
    focus: '首次回忆（不看资料）',
    action: '合上书本凭记忆写出昨天的词、读音与规则，写不出来的做记号，只重学带记号的部分。',
  },
  {
    id: 'rr-3',
    day: 3,
    focus: '短时巩固自测',
    action: '用卡片快速自测：看到词 3 秒内说出读音、音节与词根拆解，超时即算未会，重新排入下一轮。',
  },
  {
    id: 'rr-7',
    day: 7,
    focus: '一周综合应用',
    action: '把本周词汇放进 5 个句子里口头造句，出错的词回到最小对比对与音节划分再核对一遍。',
  },
  {
    id: 'rr-14',
    day: 14,
    focus: '输出检验',
    action: '做一次无准备听写或 1 分钟复述，统计正确率，仍错的词写进错词本并标注错因。',
  },
  {
    id: 'rr-30',
    day: 30,
    focus: '长期固化与分流',
    action: '整月词汇混编成 20 题小测：全对的移入“已固化”不再打扰，有错的降回 7 天档重新排队。',
  },
];

/* ------------------------------------------------------------------ */
/* 主动输出训练                                                        */
/* ------------------------------------------------------------------ */

export const outputDrills: {
  id: string;
  title: string;
  prompt: string;
  difficulty: '基础' | '进阶' | '挑战';
}[] = [
  {
    id: 'od-1',
    title: '音节拆读听写',
    prompt: '听读音把词拆成音节块写出，例如 /ˈfenɪktəl/ 写成 fen·ic·tal（可提示首字母），写完逐块自评读音。',
    difficulty: '基础',
  },
  {
    id: 'od-2',
    title: '词根反推词义',
    prompt: '给出一个词根（如 spect“看”），30 秒内写出含它的 4 个词，并逐一说出词义与前缀方向。',
    difficulty: '基础',
  },
  {
    id: 'od-3',
    title: '规则拼词卡',
    prompt: '只给音标与规则提示（如 /neɪm/ + magic e），凭规则默写单词，写错的标注违背了哪条规则。',
    difficulty: '基础',
  },
  {
    id: 'od-4',
    title: '搭配块造句',
    prompt: '从今天学的词里挑 5 个，各配一个固定搭配（如 make a decision），再用整块造一个与自己有关的句子。',
    difficulty: '进阶',
  },
  {
    id: 'od-5',
    title: '最小对比对辨音说句',
    prompt: '把 quite/quiet、thin/tin 等成对朗读并各造一句，录音回听，指出自己刚才哪一对区分得不够。',
    difficulty: '进阶',
  },
  {
    id: 'od-6',
    title: '词族扩写接龙',
    prompt: '以一个词根为轴写出名词、动词、形容词三种派生形式，并用每个派生词各说一个短语。',
    difficulty: '进阶',
  },
  {
    id: 'od-7',
    title: '同义改写',
    prompt: '用刚学的词改写原句（如 important → vital），保持句意不变，再说明换了词后语气有什么变化。',
    difficulty: '进阶',
  },
  {
    id: 'od-8',
    title: '一分钟无稿复述',
    prompt: '随机抽 3 个词，不停顿讲满 60 秒小故事，必须全部用上；回听并数出自己用对了几个。',
    difficulty: '挑战',
  },
  {
    id: 'od-9',
    title: '看图连讲五个词',
    prompt: '选一张场景图，不用脚本描述 30 秒，至少嵌入 5 个当日词汇与其搭配，重点保证重音位置正确。',
    difficulty: '挑战',
  },
  {
    id: 'od-10',
    title: '二十词编故事',
    prompt: '把 20 个复盘词编成一段有因果的短文并朗读录音，讲完自查：是否每个词都用在了正确的搭配里。',
    difficulty: '挑战',
  },
];
