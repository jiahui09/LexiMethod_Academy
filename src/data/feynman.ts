/**
 * LexiMethod Academy — 费曼关（Feynman Gate）
 *
 * 教学依据：费曼学习法 / 生成性学习（Roediger & Karpicke）——
 * 把刚学的规则用自己的话讲出来，会在“提取”阶段暴露假记忆；
 * 关键词检查是最低限度的结构约束，自评量表负责元认知校准。
 *
 * 说明：本文件只存题面与对照材料，学生输入的解释保存在 progressStore（仅内存），
 * 全站零数据存储、不写浏览器存储，也不做任何网络传输。
 */

export type FeynmanTask = {
  methodId: string;
  /** 任务题面：要讲清楚什么 */
  prompt: string;
  /** 关键词检查：讲解中至少要出现的词 */
  keywords: string[];
  /** 例子要求提示 */
  exampleHint: string;
  /** 例外 / 误区要求提示 */
  exceptionHint: string;
  /** 对照材料：一段合格的解释应该覆盖哪些点 */
  modelAnswer: string;
  /** 虚拟学生的追问（讲完可以试着回答） */
  studentQuestions: string[];
};

export const feynmanTasks: FeynmanTask[] = [
  {
    methodId: 'phonics-syllables',
    prompt: '把“长词如何划分音节并找到重音”讲给一个从没学过音节划分的同学听。',
    keywords: ['音节', '元音', '重音', '辅音', '弱读', '出声'],
    exampleHint: '用 3 个词当例子（如 transportation、baby、record）',
    exceptionHint: '至少说 1 个例外或易错点（如 y 作元音、重音后移）',
    modelAnswer:
      '单词是声音块不是字母串：每个音节必须有一个元音核心（a e i o u 或字母组合），元音个数就是音节数，划分时按“一辅归后、两辅分家”分配辅音。' +
      '重音位置决定词性与词义（record 名词前重 / record 动词后重），非重读音节常弱读成 /ə/，读得太实反而不像英语。' +
      '最后一定要出声读一遍自检——不出声就没法用“语音回放”验证划分对不对。',
    studentQuestions: ['baby 里的 y 也算元音吗？那音节数怎么数？', '为什么 decide 的重音在后面，decision 却在前面？'],
  },
  {
    methodId: 'phonetic-spelling',
    prompt: '把“音标符号为什么记得住、拼写与读音怎么对应”讲给同学听。',
    keywords: ['音标', '发音', '口型', '舌位', '声带', '拼写'],
    exampleHint: '举 3 个音形对应的例子（如 th /θ/、ph /f/、tion /ʃn/）',
    exceptionHint: '提 1 个易错点（如 v→w、长短音、dark l）',
    modelAnswer:
      '音标不是抽象符号，而是“口型 + 舌位 + 气流 + 声带”的动作快照：动作可以模仿，符号就跟着动作记住。' +
      '拼写与发音之间存在系统对应——th 对 /θ/、ph 对 /f/、-tion 对 /ʃn/，记对应关系比逐词记划算。' +
      '验收必须走双向：看到词能读（形→音）、听到音能写（音→形），只练单向不算掌握。',
    studentQuestions: ['th 什么时候读清 /θ/、什么时候读浊 /ð/？', 'sheep 和 ship 只是长短差别吗？'],
  },
  {
    methodId: 'roots-affixes',
    prompt: '把“一个生词怎么拆成前缀、词根、后缀”讲给同学听。',
    keywords: ['前缀', '词根', '后缀', '词性', '词素', '核对'],
    exampleHint: '用 3 个词演示拆解（如 contradiction、transport、inspect）',
    exceptionHint: '提 1 个例外或易错点（如假词素、同化前缀、把猜测当词义）',
    modelAnswer:
      '前缀定方向、词根定核心、后缀定词性，三块拼起来得到的是“可验证的猜测”而不是词典释义。' +
      '词素的含义在家族内稳定：spect 永远是“看”，变的只是方向与身份；同化前缀 in-/im-/il-/ir- 是同一个前缀。' +
      '拆完必须与词典或语境核对，这个“猜→对”的闭环才是拆解法真正训练的能力。',
    studentQuestions: ['condition 怎么拆？拆错了会怎样？', '-tion 和 -ize 分别提示什么词性？'],
  },
  {
    methodId: 'mnemonics',
    prompt: '把“字母组合怎么挂到画面上变成记忆”讲给同学听。',
    keywords: ['画面', '夸张', '荒谬', '动感', '回收', '语境'],
    exampleHint: '给 1 个词现场编一条联想，并说明它为什么比干背有效',
    exceptionHint: '说明 1 个该停手的场景（如简单高频词不必联想）',
    modelAnswer:
      '人脑记图像远强于记符号：把音与形挂到已有画面上，检索路径从 1 条变成 3 条；越荒谬、越有动感、越夸张的联想粘性越强。' +
      '但联想只是脚手架：编完必须回收到发音与语境（跟读 + 造句），否则记住的只是中文段子。' +
      '简单词、高频词直接多读多用即可，滥用联想反而浪费时间。',
    studentQuestions: ['简单高频词也要编联想吗？', '联想完为什么还必须造句？'],
  },
  {
    methodId: 'context-embedding',
    prompt: '把“为什么要在句子里记单词、怎么设计例句”讲给同学听。',
    keywords: ['语境', '搭配', '场景', '例句', '发音', '义项'],
    exampleHint: '举 3 个搭配或例句（如 make a decision、make up 的不同义项）',
    exceptionHint: '提 1 个易错点（如只背一个例句、中文语序迁移）',
    modelAnswer:
      '孤立词义是“字典义”，语境词义才是“用法义”：同一词在不同搭配里义项不同（make up 可以是编造、化妆、弥补）。' +
      '记忆要挂在带画面带情绪的场景上，每个词至少两个场景，换语境才不会失灵。' +
      '搭配块是输出的最小单位——整块记 make a decision，比分别记三个词有用；读句子时把发音与节奏带上，语境才算“锁上”。',
    studentQuestions: ['make up 的几个意思怎么分开记？', '为什么只背一个例句会失灵？'],
  },
  {
    methodId: 'spaced-repetition',
    prompt: '把“什么时候复习、怎么算一次合格的复习”讲给同学听。',
    keywords: ['遗忘曲线', '主动回忆', '间隔', '复习', '提取', '退回'],
    exampleHint: '写出一组具体间隔数字（如 1→3→7→14→30）并解释怎么用',
    exceptionHint: '提 1 个易错点（如把重读当复习、虚报“记得”）',
    modelAnswer:
      '遗忘曲线先陡后平，复习的价值不在量而在时机：大约忘掉三成时提取一次，记忆强度翻倍。' +
      '主动回忆比重读有效 2~3 倍——合上书把它想出来才算复习，看到“很眼熟”不算。' +
      '每次成功回忆就把间隔拉开（1→3→7→14→30），失败则退回更短的间隔重新加固，错题必须重做并解释错因。',
    studentQuestions: ['什么才算一次合格的复习？', '明明学过却总是想不起来怎么办？'],
  },
  {
    methodId: 'active-output',
    prompt: '把“为什么必须开口说、动笔写”讲给同学听。',
    keywords: ['输出', '提取', '造句', '被动词汇', '自检', '必要难度'],
    exampleHint: '给 3 个能用上的句子（哪怕很短）',
    exceptionHint: '提 1 个无效做法（如安全句 This is a book、只写不读）',
    modelAnswer:
      '输出强迫完整提取：说错写错会立刻暴露“假记忆”，比任何测试都诚实。' +
      '从零组织句子会同时调用词义、搭配、语法三套系统，形成必要难度，编码深度远超默读。' +
      '被动词汇只有真正用过（约 1/5）才会变成主动词汇；输出之后必须对照词典与语法自检，否则是在固化错误。',
    studentQuestions: ['造一句 This is a book 有用吗？', '口语和写作先练哪个？'],
  },
  {
    methodId: 'metacognition',
    prompt: '把“怎么判断自己到底会不会、发现问题后怎么调整”讲给同学听。',
    keywords: ['归因', '方法', '测试', '复盘', '策略', '计划'],
    exampleHint: '举 3 个自己真实的“学不会”场景并给出对策',
    exceptionHint: '提 1 个易错点（如用感觉代替测试、把失败归因到天赋）',
    modelAnswer:
      '学习效率的上限取决于对自身状态的判断力：知道哪里不会，比多学一小时更值钱。' +
      '归因要落在“方法不对 / 练得不够”上，不能落在“我不行”上——前者会换方法，后者会放弃。' +
      '用抽测代替感觉，出现具体信号（正确率下跌、复习堆积）就执行具体策略调整，并做周期复盘，目标定在能连续完成 7 天的量。',
    studentQuestions: ['这次没考好，应该怎么归因？', '怎么知道“感觉自己会了”是不是真的会？'],
  },
];

export function feynmanTask(methodId: string | null | undefined): FeynmanTask | undefined {
  if (!methodId) return undefined;
  return feynmanTasks.find((t) => t.methodId === methodId);
}
