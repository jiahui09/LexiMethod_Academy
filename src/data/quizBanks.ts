import type { Question, QuestionType } from '@/types';

/**
 * 静态题库：11 种题型各 ≥8 题
 * 与 questionFactory 的动态出题互补（课程互动练习等共用）
 */

/* ------------------------------------------------------------------ */
/* 1. 听音选音标                                                        */
/* ------------------------------------------------------------------ */
const listenChoosePhoneme: Question[] = [
  {
    id: 'qb-lcp-1', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '先听整体发音，再锁定关键音。',
    speak: 'think', choices: [
      { label: '/θ/', correct: true },
      { label: '/s/', correct: false },
      { label: '/f/', correct: false },
      { label: '/t/', correct: false },
    ],
    answer: '/θ/',
    hint: '舌尖有没有伸到牙齿之间？',
    explain: 'think 以咬舌清擦音 /θ/ 开头：舌尖置于齿间，气流漏出，声带不振动。',
    tags: ['听音', 'θ'],
  },
  {
    id: 'qb-lcp-2', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '注意词首辅音是清还是浊。',
    speak: 'very', choices: [
      { label: '/v/', correct: true },
      { label: '/w/', correct: false },
      { label: '/b/', correct: false },
      { label: '/f/', correct: false },
    ],
    answer: '/v/',
    hint: '上齿碰下唇了吗？声带振动吗？',
    explain: 'very 首音是 /v/：唇齿摩擦且声带振动；/w/ 是圆唇滑音，牙齿不碰下唇。',
    tags: ['听音', 'v'],
  },
  {
    id: 'qb-lcp-3', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '词尾摩擦音要听“收尾”。',
    speak: 'bridge', choices: [
      { label: '/dʒ/', correct: true },
      { label: '/tʃ/', correct: false },
      { label: '/ʒ/', correct: false },
      { label: '/z/', correct: false },
    ],
    answer: '/dʒ/',
    hint: '收尾时喉咙在振动吗？',
    explain: 'bridge 结尾是浊破擦音 /dʒ/：爆破 + 摩擦且振动；清音 /tʃ/ 会像 “chip”。',
    tags: ['听音', 'dʒ'],
  },
  {
    id: 'qb-lcp-4', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的元音', narration: '长音与短音的差别在长度与紧张度。',
    speak: 'sheep', choices: [
      { label: '/iː/', correct: true },
      { label: '/ɪ/', correct: false },
      { label: '/e/', correct: false },
      { label: '/iə/', correct: false },
    ],
    answer: '/iː/',
    hint: '嘴角是否一直拉到收音？',
    explain: 'sheep 的元音是长音 /iː/：微笑口型保持两拍；若读 /ɪ/ 就变成 ship（船）。',
    tags: ['听音', 'iː'],
  },
  {
    id: 'qb-lcp-5', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '鼻音在结尾仍要有鼻腔共鸣。',
    speak: 'sing', choices: [
      { label: '/ŋ/', correct: true },
      { label: '/n/', correct: false },
      { label: '/ŋɡ/', correct: false },
    ],
    answer: '/ŋ/',
    hint: '音从哪里出来——鼻子还是嘴巴？',
    explain: 'sing 结尾只有 /ŋ/：舌根抵软腭、气走鼻腔，不补 /ɡ/；finger 才是 /ŋɡ/。',
    tags: ['听音', 'ŋ'],
  },
  {
    id: 'qb-lcp-6', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '双元音要听出“滑动”。',
    speak: 'now', choices: [
      { label: '/aʊ/', correct: true },
      { label: '/aː/', correct: false },
      { label: '/əʊ/', correct: false },
      { label: '/ʌ/', correct: false },
    ],
    answer: '/aʊ/',
    hint: '收尾时嘴唇圆了吗？',
    explain: 'now 读 /naʊ/：从大开的 /a/ 滑向圆唇的 /ʊ/，结尾必须收圆。',
    tags: ['听音', 'aʊ'],
  },
  {
    id: 'qb-lcp-7', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '注意词首是否送气。',
    speak: 'spin', choices: [
      { label: '/s/', correct: true },
      { label: '/ʃ/', correct: false },
      { label: '/θ/', correct: false },
      { label: '/z/', correct: false },
    ],
    answer: '/s/',
    hint: '气流是从舌尖前的窄缝出来的吗？',
    explain: 's- 后的 p 不送气，但这里的首音是 /s/：齿龈窄缝的“嘶”声，与 /ʃ/ 的宽缝“嘘”不同。',
    tags: ['听音', 's'],
  },
  {
    id: 'qb-lcp-8', type: 'listenChoosePhoneme',
    prompt: '听音选择你听到的音标', narration: '词中的弱读音节最易被忽略。',
    speak: 'banana', choices: [
      { label: '/ə/', correct: true },
      { label: '/æ/', correct: false },
      { label: '/ɑː/', correct: false },
      { label: '/ʌ/', correct: false },
    ],
    answer: '/ə/',
    hint: '非重读音节通常塌缩成最省力的音。',
    explain: 'banana 的首尾音节都是弱读 /ə/，重音在中间的 /ˈnæ/；中文母语者常把每个音节读满。',
    tags: ['听音', 'ə'],
  },
];

/* ------------------------------------------------------------------ */
/* 2. 看词选音标                                                        */
/* ------------------------------------------------------------------ */
const wordChoosePhoneme: Question[] = [
  {
    id: 'qb-wcp-1', type: 'wordChoosePhoneme',
    prompt: '单词 time 中画线部分读哪个音标？', narration: '先读词，再对照口型与长度。',
    speak: 'time', choices: [
      { label: '/aɪ/', correct: true },
      { label: '/aː/', correct: false },
      { label: '/eɪ/', correct: false },
      { label: '/ɪ/', correct: false },
    ],
    answer: '/aɪ/',
    hint: 'magic e 让元音“说自己的名字”。',
    explain: 'time 符合 a-e 结构：i 读其字母名 /aɪ/，e 不发音只负责拉长元音。',
    tags: ['看词', 'aɪ'],
  },
  {
    id: 'qb-wcp-2', type: 'wordChoosePhoneme',
    prompt: '单词 city 的首字母 c 读哪个音标？', narration: 'c 在 e/i/y 前要“软化”。',
    speak: 'city', choices: [
      { label: '/s/', correct: true },
      { label: '/k/', correct: false },
      { label: '/tʃ/', correct: false },
      { label: '/ʃ/', correct: false },
    ],
    answer: '/s/',
    hint: '后面的字母是什么？',
    explain: 'soft c 规则：c 在 e/i/y 前读 /s/（city、cell、circle），否则读 /k/（cat、call）。',
    tags: ['看词', 's'],
  },
  {
    id: 'qb-wcp-3', type: 'wordChoosePhoneme',
    prompt: '单词 enough 中画线部分读哪个音标？', narration: '字母组合常“另起炉灶”。',
    speak: 'enough', choices: [
      { label: '/ʌf/', correct: true },
      { label: '/aʊf/', correct: false },
      { label: '/uːf/', correct: false },
      { label: '/ʌk/', correct: false },
    ],
    answer: '/ʌf/',
    hint: 'ough 在不同词里读法不同——记住 enough 这一个锚点。',
    explain: 'ough 在 enough 里读 /ʌf/；同组合在 though 读 /əʊ/、thought 读 /ɔː/、through 读 /uː/。',
    tags: ['看词', 'ough'],
  },
  {
    id: 'qb-wcp-4', type: 'wordChoosePhoneme',
    prompt: '单词 photograph 的第一个音节读哪个音标？', narration: '多音节词先切音节再看元音。',
    speak: 'photograph', choices: [
      { label: '/ˈfəʊ/', correct: true },
      { label: '/ˈfɒ/', correct: false },
      { label: '/ˈfʌ/', correct: false },
      { label: '/ˈfe/', correct: false },
    ],
    answer: '/ˈfəʊ/',
    hint: 'ph 读什么？o 在开音节读什么？',
    explain: 'ph=/f/，o 在重读开音节读字母名 /əʊ/；photo、physics、graph 的重音都在首音节。',
    tags: ['看词', 'əʊ'],
  },
  {
    id: 'qb-wcp-5', type: 'wordChoosePhoneme',
    prompt: '单词 judge 的词尾读哪个音标？', narration: '看拼写形状猜口型。', speak: 'judge',
    choices: [
      { label: '/dʒ/', correct: true },
      { label: '/ʒ/', correct: false },
      { label: '/tʃ/', correct: false },
      { label: '/d/', correct: false },
    ],
    answer: '/dʒ/',
    hint: '开头和结尾的读音一样吗？',
    explain: 'judge = /dʒʌdʒ/，首尾同为 /dʒ/；dge 是 /dʒ/ 的典型拼写（bridge、edge）。',
    tags: ['看词', 'dʒ'],
  },
  {
    id: 'qb-wcp-6', type: 'wordChoosePhoneme',
    prompt: '单词 bread 中画线部分读哪个音标？', narration: 'ea 不总是 /iː/。', speak: 'bread',
    choices: [
      { label: '/e/', correct: true },
      { label: '/iː/', correct: false },
      { label: '/eɪ/', correct: false },
      { label: '/ɪ/', correct: false },
    ],
    answer: '/e/',
    hint: '试着读 head、health——它们押韵吗？',
    explain: 'ea 读 /e/ 的例外群：bread、head、health、weather；与 read(/iː/) 形成对比记忆。',
    tags: ['看词', 'e'],
  },
  {
    id: 'qb-wcp-7', type: 'wordChoosePhoneme',
    prompt: '单词 wrong 的首字母组合读哪个音标？', narration: '有些字母组合只留一个音。', speak: 'wrong',
    choices: [
      { label: '/r/', correct: true },
      { label: '/w/', correct: false },
      { label: '/wr/', correct: false },
      { label: '/rə/', correct: false },
    ],
    answer: '/r/',
    hint: 'w 还出声吗？',
    explain: 'wr- 组合里 w 不发音：write、wrap、wrong 都以 /r/ 开头；kn- 同理 k 不读（knee）。',
    tags: ['看词', 'r'],
  },
  {
    id: 'qb-wcp-8', type: 'wordChoosePhoneme',
    prompt: '单词 care 的词尾读哪个音标？', narration: '词尾 r 决定元音的“色彩”。', speak: 'care',
    choices: [
      { label: '/eə/', correct: true },
      { label: '/ɪə/', correct: false },
      { label: '/ɑː/', correct: false },
      { label: '/ɜː/', correct: false },
    ],
    answer: '/eə/',
    hint: 'are 组合的滑动方向是？',
    explain: 'care = /keə/：are 组合从半开的 /e/ 滑向放松的 /ə/；与 near(/ɪə/)、sure(/ʊə/) 一组记。',
    tags: ['看词', 'eə'],
  },
];

/* ------------------------------------------------------------------ */
/* 3. 音标选拼写                                                        */
/* ------------------------------------------------------------------ */
const phonemeChooseSpelling: Question[] = [
  {
    id: 'qb-pcs-1', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合最常读 /ʃ/？', narration: '音标到拼写：看到读音要能落笔。',
    choices: [
      { label: 'sh', correct: true },
      { label: 'ch', correct: false },
      { label: 'th', correct: false },
      { label: 's', correct: false },
    ],
    answer: 'sh',
    hint: 'she、ship、fish 长什么样？',
    explain: '/ʃ/ 的拼写：sh(she)、-tion(nation)、-sion(mission)、-cial(social)、ti(actually)。',
    tags: ['拼写', 'ʃ'],
  },
  {
    id: 'qb-pcs-2', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合最常读 /θ/？', narration: '一音对多形，先认最主流的一形。',
    choices: [
      { label: 'th', correct: true },
      { label: 'ph', correct: false },
      { label: 'sh', correct: false },
      { label: 'gh', correct: false },
    ],
    answer: 'th',
    hint: 'think、bath、health 都指向它。',
    explain: '清音 /θ/ 几乎只由 th 承担（think、bath）；同形的 th 在 this、that 中读浊音 /ð/。',
    tags: ['拼写', 'θ'],
  },
  {
    id: 'qb-pcs-3', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合最常读 /eɪ/？', narration: '双元音的拼写入口很多，认最常用的。', choices: [
      { label: 'ai', correct: true },
      { label: 'oo', correct: false },
      { label: 'ou', correct: false },
      { label: 'ea', correct: false },
    ],
    answer: 'ai',
    hint: 'rain、day、name、eight 都读它。',
    explain: '/eɪ/ 的拼写：a(name)、ai(rain)、ay(day)、ei(veil)、eigh(eight)。',
    tags: ['拼写', 'eɪ'],
  },
  {
    id: 'qb-pcs-4', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合读 /k/？', narration: '同一音可由多个字母或组合承担。', choices: [
      { label: 'ck', correct: true },
      { label: 'ch', correct: false },
      { label: 'gh', correct: false },
      { label: 'ph', correct: false },
    ],
    answer: 'ck',
    hint: 'back、kick、duck 的结尾。',
    explain: '读 /k/ 的拼写：c(cat)、k(key)、ck(back)、ch(school、chrome)、q(queen)。',
    tags: ['拼写', 'k'],
  },
  {
    id: 'qb-pcs-5', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合读 /dʒ/？', narration: '词中词尾的典型写法要成套记。', choices: [
      { label: 'dge', correct: true },
      { label: 'tch', correct: false },
      { label: 'sh', correct: false },
      { label: 'th', correct: false },
    ],
    answer: 'dge',
    hint: 'bridge、edge、judge。',
    explain: '/dʒ/ 常见拼写：j(jump)、g(gentle)、ge(page)、dge(bridge)；tch 读 /tʃ/ 是干扰项。',
    tags: ['拼写', 'dʒ'],
  },
  {
    id: 'qb-pcs-6', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合最常读 /aʊ/？', narration: '开合口滑动的元音写法有限。', choices: [
      { label: 'ou', correct: true },
      { label: 'oo', correct: false },
      { label: 'ea', correct: false },
      { label: 'ie', correct: false },
    ],
    answer: 'ou',
    hint: 'house、out、mouse、cloud。',
    explain: '/aʊ/ 的拼写：ou(house)、ow(now、cow)；注意 ow 也读 /əʊ/（low、show）。',
    tags: ['拼写', 'aʊ'],
  },
  {
    id: 'qb-pcs-7', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合读 /f/？', narration: '希腊来源的组合常保留特殊读法。', choices: [
      { label: 'ph', correct: true },
      { label: 'gh', correct: false },
      { label: 'th', correct: false },
      { label: 'sh', correct: false },
    ],
    answer: 'ph',
    hint: 'photo、elephant、enough。',
    explain: '/f/ 的拼写：f(fish)、ff(cliff)、ph(photo)、gh(enough、laugh)。',
    tags: ['拼写', 'f'],
  },
  {
    id: 'qb-pcs-8', type: 'phonemeChooseSpelling',
    prompt: '哪个字母组合最常读 /iː/？', narration: '长元音最常见的“双写”标记。', choices: [
      { label: 'ee', correct: true },
      { label: 'ea', correct: false },
      { label: 'oo', correct: false },
      { label: 'ie', correct: false },
    ],
    answer: 'ee',
    hint: 'see、tree、feet、keep。',
    explain: '/iː/ 的拼写：ee(see)、ea(beat)、e(me)、ei(ceiling)、ie(thief)、ey(key)。',
    tags: ['拼写', 'iː'],
  },
];

/* ------------------------------------------------------------------ */
/* 4. 拼写选音标                                                        */
/* ------------------------------------------------------------------ */
const spellingChoosePhoneme: Question[] = [
  {
    id: 'qb-scp-1', type: 'spellingChoosePhoneme',
    prompt: '字母组合 ph 通常怎么读？', narration: '看到词块直接读出来。',
    choices: [
      { label: '/f/', correct: true },
      { label: '/v/', correct: false },
      { label: '/p/', correct: false },
      { label: '/b/', correct: false },
    ],
    answer: '/f/',
    hint: 'photo、elephant。',
    explain: 'ph → /f/（photo、elephant、phone）；ph 不读 /p/，那是照搬字母名的错觉。',
    tags: ['拼写', 'f'],
  },
  {
    id: 'qb-scp-2', type: 'spellingChoosePhoneme',
    prompt: '字母组合 tion 通常怎么读？', narration: '高频后缀要形成肌肉记忆。', choices: [
      { label: '/ʃən/', correct: true },
      { label: '/tʃən/', correct: false },
      { label: '/ʃʌn/', correct: false },
      { label: '/sən/', correct: false },
    ],
    answer: '/ʃən/',
    hint: 'nation、station、question。',
    explain: '-tion → /ʃən/（nation、station）；-ture → /tʃə/（nature）；question 是 /tʃ/ 的例外。',
    tags: ['拼写', 'ʃ'],
  },
  {
    id: 'qb-scp-3', type: 'spellingChoosePhoneme',
    prompt: '字母组合 kn 在词首怎么读？', narration: '沉默字母是拼写的历史层积。', choices: [
      { label: '/n/', correct: true },
      { label: '/kn/', correct: false },
      { label: '/k/', correct: false },
      { label: '/ŋ/', correct: false },
    ],
    answer: '/n/',
    hint: 'knee、knife、knock。',
    explain: 'kn- 中 k 不发音：knee=/niː/、knife；同理 wr- 的 w 不读、gn- 的 g 不读。',
    tags: ['拼写', 'n'],
  },
  {
    id: 'qb-scp-4', type: 'spellingChoosePhoneme',
    prompt: '字母组合 oo 在 book 中怎么读？', narration: '同一组合在不同词里分流。', choices: [
      { label: '/ʊ/', correct: true },
      { label: '/uː/', correct: false },
      { label: '/ɔː/', correct: false },
      { label: '/ə/', correct: false },
    ],
    answer: '/ʊ/',
    hint: '短松 vs 长紧：book 与 boot 对比。',
    explain: 'oo 两读：短松 /ʊ/(book、look、good) 与长紧 /uː/(food、moon、zoo)，按词逐个记。',
    tags: ['拼写', 'ʊ'],
  },
  {
    id: 'qb-scp-5', type: 'spellingChoosePhoneme',
    prompt: '字母 c 在 city 中怎么读？', narration: '软硬音由后面的字母决定。', choices: [
      { label: '/s/', correct: true },
      { label: '/k/', correct: false },
      { label: '/tʃ/', correct: false },
      { label: '/z/', correct: false },
    ],
    answer: '/s/',
    hint: 'soft c 规则。',
    explain: 'c 在 e/i/y 前读 /s/（city、cell、circle），其余读 /k/；g 相反多读 /dʒ/（gentle）。',
    tags: ['拼写', 's'],
  },
  {
    id: 'qb-scp-6', type: 'spellingChoosePhoneme',
    prompt: '词尾 -ed 在 worked 中怎么读？', narration: '-ed 三读法由前一个音决定。', choices: [
      { label: '/t/', correct: true },
      { label: '/d/', correct: false },
      { label: '/ɪd/', correct: false },
      { label: '/əd/', correct: false },
    ],
    answer: '/t/',
    hint: 'work 是清辅音结尾吗？',
    explain: '-ed 三读法：清辅音后 /t/(worked、stopped)，浊辅音与元音后 /d/(played)，t/d 后 /ɪd/(wanted、ended)。',
    tags: ['拼写', 'ed'],
  },
  {
    id: 'qb-scp-7', type: 'spellingChoosePhoneme',
    prompt: '字母组合 ng 在 finger 中怎么读？', narration: '词中与词尾的处理不同。', choices: [
      { label: '/ŋɡ/', correct: true },
      { label: '/ŋ/', correct: false },
      { label: '/nɡ/', correct: false },
      { label: '/dʒ/', correct: false },
    ],
    answer: '/ŋɡ/',
    hint: '对比 sing 与 finger。',
    explain: 'ng 在词尾多只读 /ŋ/(sing、long)，后接元音时读 /ŋɡ/(finger、angle、language)。',
    tags: ['拼写', 'ŋɡ'],
  },
  {
    id: 'qb-scp-8', type: 'spellingChoosePhoneme',
    prompt: '字母组合 ough 在 though 中怎么读？', narration: 'ough 是英语拼写最分裂的组合。', choices: [
      { label: '/əʊ/', correct: true },
      { label: '/ʌf/', correct: false },
      { label: '/ɔː/', correct: false },
      { label: '/uː/', correct: false },
    ],
    answer: '/əʊ/',
    hint: 'though、through、thought、enough 各读各的。',
    explain: 'ough 四读：though=/ðəʊ/、through=/θruː/、thought=/θɔː/、enough=/ɪˈnʌf/；按词记忆最稳。',
    tags: ['拼写', 'ough'],
  },
];

/* ------------------------------------------------------------------ */
/* 5. 听写音标（先写音标）                                              */
/* ------------------------------------------------------------------ */
const listenWritePhoneme: Question[] = [
  {
    id: 'qb-lwp-1', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '先听音、写音标，声音先于拼写。',
    speak: 'think', answer: '/θɪŋk/',
    hint: '首音咬舌、尾音舌根顶软腭。',
    explain: 'think = /θɪŋk/：θ + ɪ + ŋ + k；注意 nk 组合读 /ŋk/。',
    tags: ['听写', 'think'],
  },
  {
    id: 'qb-lwp-2', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '数音节、找重音，再落笔。',
    speak: 'banana', answer: '/bəˈnɑːnə/',
    hint: '三个音节，重音在中间。',
    explain: 'banana = /bəˈnɑːnə/：首尾是弱读 /ə/，重音第二音节；英音中段为长 /ɑː/。',
    tags: ['听写', 'banana'],
  },
  {
    id: 'qb-lwp-3', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '先辨首音清浊，再写元音。',
    speak: 'very', answer: '/ˈveri/',
    hint: '首音是唇齿振动音。',
    explain: 'very = /ˈveri/：v（唇齿浊擦）+ e + v 无关；对比 vary=/ˈveəri/。',
    tags: ['听写', 'very'],
  },
  {
    id: 'qb-lwp-4', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '注意元音是长是短。',
    speak: 'sheep', answer: '/ʃiːp/',
    hint: '首音噘嘴、元音两拍。',
    explain: 'sheep = /ʃiːp/；对比 ship=/ʃɪp/——长短元音区分词义的典型例子。',
    tags: ['听写', 'sheep'],
  },
  {
    id: 'qb-lwp-5', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '双元音的滑动要写进符号里。',
    speak: 'house', answer: '/haʊs/',
    hint: '从大开到收圆。',
    explain: 'house = /haʊs/：h + aʊ + s；对比 horse=/hɔːs/，最小对立对。',
    tags: ['听写', 'house'],
  },
  {
    id: 'qb-lwp-6', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '多音节词先切再标重音。',
    speak: 'photograph', answer: '/ˈfəʊtəɡrɑːf/',
    hint: '三个音节，重音第一。',
    explain: 'photograph = /ˈfəʊtəɡrɑːf/：ph=/f/，重音首音节；photography 重音后移到第二音节。',
    tags: ['听写', 'photograph'],
  },
  {
    id: 'qb-lwp-7', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '词尾 -s 的清浊跟着前面的音走。',
    speak: 'dogs', answer: '/dɒɡz/',
    hint: '词尾是浊音，-s 读什么？',
    explain: 'dogs = /dɒɡz/：浊辅音 /ɡ/ 后的 -s 读 /z/；对比 cats=/kæts/（清音后读 /s/）。',
    tags: ['听写', 'dogs'],
  },
  {
    id: 'qb-lwp-8', type: 'listenWritePhoneme',
    prompt: '听音写音标：写出这个词的英式音标', narration: '弱读与重读一起决定音标形状。',
    speak: 'computer', answer: '/kəmˈpjuːtə/',
    hint: '三个音节，重音在第二。',
    explain: 'computer = /kəmˈpjuːtə/：首音节弱读 /kəm/，重音 /ˈpjuː/，词尾弱读 /tə/。',
    tags: ['听写', 'computer'],
  },
];

/* ------------------------------------------------------------------ */
/* 6. 听写单词（逐字母反馈）                                            */
/* ------------------------------------------------------------------ */
const listenWriteWord: Question[] = [
  {
    id: 'qb-lww-1', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '按音节拼写，不要从字母表硬凑。',
    speak: 'weather', answer: 'weather',
    hint: '三个音节，开头 w，中间是 ea。',
    explain: 'weather=/ˈweðə/（注意 th 读浊音 /ð/）；对比 whether——同音异形异义。',
    tags: ['听写', 'weather'],
  },
  {
    id: 'qb-lww-2', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '听到 /f/ 想到哪几种拼写？',
    speak: 'enough', answer: 'enough',
    hint: '四个字母组合：en + ough。',
    explain: 'enough=/ɪˈnʌf/：ough 读 /ʌf/；拼写靠词块记忆，不能按字母音推。',
    tags: ['听写', 'enough'],
  },
  {
    id: 'qb-lww-3', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '先切音节：两拍。',
    speak: 'picture', answer: 'picture',
    hint: 'pic + ture，词尾常见后缀。',
    explain: 'picture=/ˈpɪktʃə/：-ture 读 /tʃə/，与 -tion /ʃən/ 成对记。',
    tags: ['听写', 'picture'],
  },
  {
    id: 'qb-lww-4', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '听清词首是 /θ/ 还是 /s/。',
    speak: 'thirty', answer: 'thirty',
    hint: 'th + ir + ty。',
    explain: 'thirty=/ˈθɜːti/：th=/θ/，ir=/ɜː/；对比 dirty=/ˈdɜːti/ 的最小对立。',
    tags: ['听写', 'thirty'],
  },
  {
    id: 'qb-lww-5', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '字母组合往往整体出现。',
    speak: 'knowledge', answer: 'knowledge',
    hint: 'know + ledge，k 不发音。',
    explain: 'knowledge=/ˈnɒlɪdʒ/：kn 的 k 沉默，-dge 读 /dʒ/；词尾 -ledge 是高频块。',
    tags: ['听写', 'knowledge'],
  },
  {
    id: 'qb-lww-6', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '数元音个数 = 音节数。',
    speak: 'beautiful', answer: 'beautiful',
    hint: '三个音节：au / ti / ful。',
    explain: 'beautiful=/ˈbjuːtɪfəl/：-ti- 读 /tɪ/（不是 sh），-ful 是后缀 /fəl/。',
    tags: ['听写', 'beautiful'],
  },
  {
    id: 'qb-lww-7', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '词尾是 /iː/，会是哪几种写法？',
    speak: 'category', answer: 'category',
    hint: '四个音节：ca / te / go / ry。',
    explain: 'category=/ˈkætəɡəri/；重音首音节，注意与 categories 的复数变化。',
    tags: ['听写', 'category'],
  },
  {
    id: 'qb-lww-8', type: 'listenWriteWord',
    prompt: '听音拼写：写出你听到的单词', narration: '同音词要靠语境区分。',
    speak: 'principal', answer: 'principal',
    hint: 'prin + ci + pal，结尾是 -pal。',
    explain: 'principal=/ˈprɪnsəpəl/（校长/主要的）；principal 与 principle 同音，按结尾辨义。',
    tags: ['听写', 'principal'],
  },
];

/* ------------------------------------------------------------------ */
/* 7. 音节划分（点音块归槽）                                                  */
/* ------------------------------------------------------------------ */
const syllableSplit: Question[] = [
  {
    id: 'qb-ss-1', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：transportation', narration: '找元音核心 → 分配辅音 → 拼回原词。',
    syllableUnits: ['trans', 'por', 'ta', 'tion'], answer: 'trans-por-ta-tion',
    hint: '四个元音核心：a / o / a / o（-tion 的 o 不发音）。',
    explain: 'transportation = trans-por-ta-tion，重音第 3 音节 → /ˌtrænspɔːˈteɪʃən/；trans- 前缀不重读。',
    tags: ['音节', 'transportation'],
  },
  {
    id: 'qb-ss-2', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：construction', narration: '词根 struct 决定主体，前后缀补齐。',
    syllableUnits: ['con', 'struc', 'tion'], answer: 'con-struc-tion',
    hint: 'struct 是词根，前面加 con-，后面加 -tion。',
    explain: 'construction = con-struc-tion；重音第 2 音节（词根）→ /kənˈstrʌkʃən/。',
    tags: ['音节', 'construction'],
  },
  {
    id: 'qb-ss-3', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：geography', narration: '词根 geo + graphy，边界清晰。',
    syllableUnits: ['ge', 'og', 'ra', 'phy'], answer: 'ge-og-ra-phy',
    hint: '四个音节，重音第一。',
    explain: 'geography = ge-og-ra-phy → /dʒiˈɒɡrəfi/；-ography 后缀整体弱读。',
    tags: ['音节', 'geography'],
  },
  {
    id: 'qb-ss-4', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：incomprehensible', narration: '前缀 in- + 词根 comprehend + 后缀 -ible。',
    syllableUnits: ['in', 'com', 'pre', 'hen', 'si', 'ble'], answer: 'in-com-pre-hen-si-ble',
    hint: '六个音节，别被长度吓到：先找元音核心。',
    explain: 'incomprehensible = in-com-pre-hen-si-ble → /ˌɪnkɒmprɪˈhensəbl/；重音第 4 音节。',
    tags: ['音节', 'incomprehensible'],
  },
  {
    id: 'qb-ss-5', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：decision', narration: 'de- + cide + -ion 的切分练习。',
    syllableUnits: ['de', 'ci', 'sion'], answer: 'de-ci-sion',
    hint: '三个音节，重音第二。',
    explain: 'decision = de-ci-sion → /dɪˈsɪʒən/；-sion 在浊音后读 /ʒən/。',
    tags: ['音节', 'decision'],
  },
  {
    id: 'qb-ss-6', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：biology', narration: '词根 bio + -logy，双辅音怎么分？',
    syllableUnits: ['bi', 'ol', 'o', 'gy'], answer: 'bi-ol-o-gy',
    hint: '四个音节，重音第二。',
    explain: 'biology = bi-ol-o-gy → /baɪˈɒlədʒi/；-logy 读 /lədʒi/，与 geography 同族。',
    tags: ['音节', 'biology'],
  },
  {
    id: 'qb-ss-7', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：photography', narration: '与 photograph 对比：重音搬家了。',
    syllableUnits: ['pho', 'tog', 'ra', 'phy'], answer: 'pho-tog-ra-phy',
    hint: '四个音节，重音在第二个。',
    explain: 'photography = pho-tog-ra-phy → /fəˈtɒɡrəfi/；-ography 后缀让重音前移到词根。',
    tags: ['音节', 'photography'],
  },
  {
    id: 'qb-ss-8', type: 'syllableSplit',
    prompt: '点音块放进槽位，划分音节：uncomfortable', narration: 'un- + comfort + -able，三层结构。',
    syllableUnits: ['un', 'com', 'for', 'ta', 'ble'], answer: 'un-com-for-ta-ble',
    hint: '五个音节，重音第三。',
    explain: 'uncomfortable = un-com-for-ta-ble → /ʌnˈkʌmftəbl/；重音落在词根 comfort 的首音节。',
    tags: ['音节', 'uncomfortable'],
  },
];

/* ------------------------------------------------------------------ */
/* 8. 重音定位（点击音节）                                              */
/* ------------------------------------------------------------------ */
const stressPosition: Question[] = [
  {
    id: 'qb-sp-1', type: 'stressPosition',
    prompt: '点击重读音节：con-struc-tion', narration: '-tion 后缀前的音节通常重读。',
    speak: 'construction', syllableUnits: ['con', 'struc', 'tion'], answer: '1',
    hint: '名前动后：construct（动）重第一，construction（名）重第二。',
    explain: 'construction 重读第 2 音节 struc → /kənˈstrʌkʃən/；-tion 让重音前移一格。',
    tags: ['重音', 'construction'],
  },
  {
    id: 'qb-sp-2', type: 'stressPosition',
    prompt: '点击重读音节：de-ci-sion', narration: '-sion 与 -tion 同规则。',
    speak: 'decision', syllableUnits: ['de', 'ci', 'sion'], answer: '1',
    hint: '重音贴着后缀前面那个音节。',
    explain: 'decision 重读第 2 音节 ci → /dɪˈsɪʒən/；decide（动词）重第 2 音节，同位。',
    tags: ['重音', 'decision'],
  },
  {
    id: 'qb-sp-3', type: 'stressPosition',
    prompt: '点击重读音节：trans-por-ta-tion', narration: '前缀不参与重读竞争。',
    speak: 'transportation', syllableUnits: ['trans', 'por', 'ta', 'tion'], answer: '2',
    hint: '重音仍找 -tion 前面的音节。',
    explain: 'transportation 重读第 3 音节 ta → /ˌtrænspɔːˈteɪʃən/；trans- 带次重音 /ˌ/。',
    tags: ['重音', 'transportation'],
  },
  {
    id: 'qb-sp-4', type: 'stressPosition',
    prompt: '点击重读音节：ge-o-gra-phy', narration: '-graphy 后缀把重音往前推。',
    speak: 'geography', syllableUnits: ['ge', 'og', 'ra', 'phy'], answer: '0',
    hint: '倒着数：-phy 前数两个。',
    explain: 'geography 重读第 1 音节 ge → /dʒiˈɒɡrəfi/；三音节以上词“倒三”规则常在这里生效。',
    tags: ['重音', 'geography'],
  },
  {
    id: 'qb-sp-5', type: 'stressPosition',
    prompt: '点击重读音节：u-ni-ver-si-ty', narration: '-ity 后缀的重音铁律。',
    speak: 'university', syllableUnits: ['u', 'ni', 'ver', 'si', 'ty'], answer: '3',
    hint: '-ity 前两格是重音。',
    explain: 'university 重读第 4 音节 si → /ˌjuːnɪˈvɜːsəti/；-ity / -ical / -ic 的重音位置有固定公式。',
    tags: ['重音', 'university'],
  },
  {
    id: 'qb-sp-6', type: 'stressPosition',
    prompt: '点击重读音节：pho-to-gra-phy', narration: '同词根的名词/动词重音会换位。',
    speak: 'photography', syllableUnits: ['pho', 'tog', 'ra', 'phy'], answer: '1',
    hint: 'photograph 重首，photography 重第二。',
    explain: 'photography 重读第 2 音节 tog → /fəˈtɒɡrəfi/；-ography 后缀把重音拉到词根。',
    tags: ['重音', 'photography'],
  },
  {
    id: 'qb-sp-7', type: 'stressPosition',
    prompt: '点击重读音节：com-pu-ter', narration: '三音节词的默认重音倾向。',
    speak: 'computer', syllableUnits: ['com', 'pu', 'ter'], answer: '1',
    hint: '三音节名词多重第二。',
    explain: 'computer 重读第 2 音节 pu → /kəmˈpjuːtə/；词尾 -er 弱读 /ə/。',
    tags: ['重音', 'computer'],
  },
  {
    id: 'qb-sp-8', type: 'stressPosition',
    prompt: '点击重读音节：in-com-pre-hen-si-ble', narration: '超长词也要先找后缀再定位。',
    speak: 'incomprehensible', syllableUnits: ['in', 'com', 'pre', 'hen', 'si', 'ble'], answer: '3',
    hint: '-ible 向前数两格。',
    explain: 'incomprehensible 重读第 4 音节 hen → /ˌɪnkɒmprɪˈhensəbl/；前缀 in- 只带次重音。',
    tags: ['重音', 'incomprehensible'],
  },
];

/* ------------------------------------------------------------------ */
/* 9. 最小对立对（听音辨词）                                            */
/* ------------------------------------------------------------------ */
const minimalPair: Question[] = [
  {
    id: 'qb-mp-1', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '最小对立对只差一个音，词义天差地别。',
    speak: 'sheep', choices: [
      { label: 'sheep', sub: '绵羊', correct: true },
      { label: 'ship', sub: '船', correct: false },
      { label: 'shape', sub: '形状', correct: false },
      { label: 'shop', sub: '商店', correct: false },
    ],
    answer: 'sheep',
    hint: '元音是长是短？嘴角有没有一直拉住？',
    explain: 'sheep=/ʃiːp/（长音）vs ship=/ʃɪp/（短音）：长度区分词义，收音别急。',
    tags: ['最小对立', 'iː'],
  },
  {
    id: 'qb-mp-2', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '首音的清浊决定一切。',
    speak: 'bat', choices: [
      { label: 'bat', sub: '球棒/蝙蝠', correct: true },
      { label: 'pat', sub: '轻拍', correct: false },
      { label: 'bad', sub: '坏的', correct: false },
      { label: 'bet', sub: '打赌', correct: false },
    ],
    answer: 'bat',
    hint: '开头振动吗？收尾振动吗？',
    explain: 'bat=/bæt/ vs pat=/pæt/（首音清浊）；bat vs bad（尾音清浊）——两对都要听仔细。',
    tags: ['最小对立', 'b'],
  },
  {
    id: 'qb-mp-3', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '咬舌音与齿龈音的对决。',
    speak: 'think', choices: [
      { label: 'think', sub: '思考', correct: true },
      { label: 'sink', sub: '下沉', correct: false },
      { label: 'sync', sub: '同步', correct: false },
      { label: 'fink', sub: '告密者', correct: false },
    ],
    answer: 'think',
    hint: '舌尖伸出来了吗？',
    explain: 'think=/θɪŋk/ vs sink=/sɪŋk/：舌尖在齿间还是贴齿龈，是这两词的唯一差别。',
    tags: ['最小对立', 'θ'],
  },
  {
    id: 'qb-mp-4', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '唇形差异：圆 or 展。',
    speak: 'wine', choices: [
      { label: 'wine', sub: '酒', correct: true },
      { label: 'vine', sub: '藤蔓', correct: false },
      { label: 'whine', sub: '哀鸣', correct: false },
      { label: 'wind', sub: '风', correct: false },
    ],
    answer: 'wine',
    hint: '双唇收圆了吗？牙齿碰下唇了吗？',
    explain: 'wine=/waɪn/（圆唇滑音）vs vine=/vaɪn/（唇齿摩擦）：w 与 v 的经典对立。',
    tags: ['最小对立', 'w'],
  },
  {
    id: 'qb-mp-5', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '词尾元音开口度。',
    speak: 'bed', choices: [
      { label: 'bed', sub: '床', correct: true },
      { label: 'bad', sub: '坏的', correct: false },
      { label: 'bid', sub: '出价', correct: false },
      { label: 'beds', sub: '床（复数）', correct: false },
    ],
    answer: 'bed',
    hint: '下巴开多大？音有多长？',
    explain: 'bed=/bed/（口半开）vs bad=/bæd/（大开）：/e/ 与 /æ/ 的开口差一档，是中文母语者的高频错点。',
    tags: ['最小对立', 'e'],
  },
  {
    id: 'qb-mp-6', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '词首鼻音位置。',
    speak: 'light', choices: [
      { label: 'light', sub: '灯', correct: true },
      { label: 'right', sub: '正确', correct: false },
      { label: 'night', sub: '夜晚', correct: false },
      { label: 'kite', sub: '风筝', correct: false },
    ],
    answer: 'light',
    hint: '舌尖点齿龈还是卷起悬空？',
    explain: 'light=/laɪt/（舌尖抵齿龈的边音）vs right=/raɪt/（圆唇卷舌）：l 与 r 是中文母语者最需专项训练的对立。',
    tags: ['最小对立', 'l'],
  },
  {
    id: 'qb-mp-7', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '结尾摩擦音。',
    speak: 'bath', choices: [
      { label: 'bath', sub: '洗澡', correct: true },
      { label: 'bas', sub: '（法）是', correct: false },
      { label: 'bad', sub: '坏的', correct: false },
      { label: 'bat', sub: '球棒', correct: false },
    ],
    answer: 'bath',
    hint: '收音时还有气在漏吗？',
    explain: 'bath=/bɑːθ/ 以咬舌清擦音收尾：气要漏到最后一刻，别提前变成 /t/ 或 /d/。',
    tags: ['最小对立', 'θ'],
  },
  {
    id: 'qb-mp-8', type: 'minimalPair',
    prompt: '听音选词：你听到的是哪个词？', narration: '双元音方向。',
    speak: 'coat', choices: [
      { label: 'coat', sub: '外套', correct: true },
      { label: 'cat', sub: '猫', correct: false },
      { label: 'caught', sub: '抓住', correct: false },
      { label: 'cut', sub: '切', correct: false },
    ],
    answer: 'coat',
    hint: '元音有没有“滑”？收尾圆不圆？',
    explain: 'coat=/kəʊt/ 是双元音（滑向圆唇）；cat=/kæt/ 单元音大开；caught=/kɔːt/ 长圆不滑动。',
    tags: ['最小对立', 'əʊ'],
  },
];

/* ------------------------------------------------------------------ */
/* 10. 词缀拼装                                                        */
/* ------------------------------------------------------------------ */
const affixAssemble: Question[] = [
  {
    id: 'qb-aa-1', type: 'affixAssemble',
    prompt: '拼装单词：表示“不可能的”', narration: '前缀 + 词根 + 后缀，三层各司其职。',
    affixUnits: [
      { text: 'un', type: 'prefix', meaning: '不，非' },
      { text: 'do', type: 'root', meaning: '做' },
      { text: 'able', type: 'suffix', meaning: '能…的' },
    ],
    answer: 'un-do-able',
    hint: '否定前缀 + 做 + 可能后缀 → “不可能的”。',
    explain: 'undoable /ʌnˈduːəbl/：un-（否定）+ do（词根）+ -able（可能）；与 impossible 同构。',
    tags: ['词缀', 'un', 'able'],
  },
  {
    id: 'qb-aa-2', type: 'affixAssemble',
    prompt: '拼装单词：表示“不同意”', narration: 'dis- + 词根 + 名词后缀。',
    affixUnits: [
      { text: 'dis', type: 'prefix', meaning: '不，相反' },
      { text: 'agree', type: 'root', meaning: '同意' },
      { text: 'ment', type: 'suffix', meaning: '名词化' },
    ],
    answer: 'dis-agree-ment',
    hint: '相反的同意 + 名词后缀。',
    explain: 'disagreement /ˌdɪsəˈɡriːmənt/：dis-（反）+ agree（词根）+ -ment（名词），三层结构一目了然。',
    tags: ['词缀', 'dis', 'ment'],
  },
  {
    id: 'qb-aa-3', type: 'affixAssemble',
    prompt: '拼装单词：表示“互动”', narration: 'inter- 表“相互、之间”。',
    affixUnits: [
      { text: 'inter', type: 'prefix', meaning: '在…之间' },
      { text: 'act', type: 'root', meaning: '行动' },
      { text: 'ion', type: 'suffix', meaning: '名词化' },
    ],
    answer: 'inter-act-ion',
    hint: '在两者之间行动 = 互动。',
    explain: 'interaction /ˌɪntərˈækʃn/：inter- + act + -ion；同族 international、internet、interpret。',
    tags: ['词缀', 'inter', 'ion'],
  },
  {
    id: 'qb-aa-4', type: 'affixAssemble',
    prompt: '拼装单词：表示“预防的”', narration: 'pre- 的含义是“在前”。',
    affixUnits: [
      { text: 'pre', type: 'prefix', meaning: '在…之前' },
      { text: 'vent', type: 'root', meaning: '来，走' },
      { text: 'ive', type: 'suffix', meaning: '…的（形容词）' },
    ],
    answer: 'pre-vent-ive',
    hint: '先来一步 → 阻止 → 预防的。',
    explain: 'preventive /prɪˈventɪv/：pre-（前）+ vent（来）+ -ive；prevent、prevention、preventive 同族。',
    tags: ['词缀', 'pre', 'ive'],
  },
  {
    id: 'qb-aa-5', type: 'affixAssemble',
    prompt: '拼装单词：表示“误解”', narration: 'mis- + 词根，中间还能再嵌一层。',
    affixUnits: [
      { text: 'mis', type: 'prefix', meaning: '错误地' },
      { text: 'under', type: 'prefix', meaning: '在下，不足' },
      { text: 'stand', type: 'root', meaning: '站立/理解' },
    ],
    answer: 'mis-under-stand',
    hint: '错 + 不充分地站住 = 误解。',
    explain: 'misunderstand /ˌmɪsˌʌndərˈstænd/：mis- 与 under- 双前缀叠加 + stand 词根，方向一致才成立。',
    tags: ['词缀', 'mis', 'under'],
  },
  {
    id: 'qb-aa-6', type: 'affixAssemble',
    prompt: '拼装单词：表示“看不见的”', narration: 'vis 是“看”的拉丁词根。',
    affixUnits: [
      { text: 'in', type: 'prefix', meaning: '不，非' },
      { text: 'vis', type: 'root', meaning: '看' },
      { text: 'ible', type: 'suffix', meaning: '能…的' },
    ],
    answer: 'in-vis-ible',
    hint: '看不见 = 否定 + 看 + 能…的。',
    explain: 'invisible /ɪnˈvɪzəbl/：in- + vis + -ible；visible 去掉前缀即“可见的”，反义成对记。',
    tags: ['词缀', 'vis', 'ible'],
  },
  {
    id: 'qb-aa-7', type: 'affixAssemble',
    prompt: '拼装单词：表示“建设”', narration: 'struct 是“建造”词根。',
    affixUnits: [
      { text: 'con', type: 'prefix', meaning: '共同，一起' },
      { text: 'struct', type: 'root', meaning: '建造' },
      { text: 'ion', type: 'suffix', meaning: '名词化' },
    ],
    answer: 'con-struct-ion',
    hint: '一起建起来 → 建设（名词）。',
    explain: 'construction /kənˈstrʌkʃən/：con- + struct + -ion；同根 destroy（de- 毁）、instruct（in- 入）。',
    tags: ['词缀', 'struct', 'con'],
  },
  {
    id: 'qb-aa-8', type: 'affixAssemble',
    prompt: '拼装单词：表示“普遍的”', narration: 'uni- 表“一”，词根是“转”。',
    affixUnits: [
      { text: 'uni', type: 'prefix', meaning: '一，单一' },
      { text: 'vers', type: 'root', meaning: '转' },
      { text: 'al', type: 'suffix', meaning: '…的' },
    ],
    answer: 'uni-vers-al',
    hint: '转成一个 → 普遍的。',
    explain: 'universal /ˌjuːnɪˈvɜːsl/：uni-（一）+ vers（转）+ -al；universe、university 同根同源。',
    tags: ['词缀', 'uni', 'vers'],
  },
];

/* ------------------------------------------------------------------ */
/* 11. 语境选词                                                        */
/* ------------------------------------------------------------------ */
const contextChoice: Question[] = [
  {
    id: 'qb-cc-1', type: 'contextChoice',
    prompt: '选词填空：The scientist made a careful _____ of the unknown material.',
    narration: '语境同时给出词性与搭配线索。',
    choices: [
      { label: 'analysis', sub: '分析', correct: true },
      { label: 'analyze', sub: '分析（动）', correct: false },
      { label: 'analytical', sub: '分析的', correct: false },
    ],
    answer: 'analysis',
    hint: '前面有冠词 a，需要什么词性？',
    explain: 'a + 名词：analysis（名词）；analyze 是动词，analytical 是形容词——词性先于词义。',
    tags: ['语境', 'analysis'],
  },
  {
    id: 'qb-cc-2', type: 'contextChoice',
    prompt: '选词填空：She has a _____ ability to solve problems quickly.',
    narration: '形容词位置要接形容词。',
    choices: [
      { label: 'remarkable', sub: '非凡的', correct: true },
      { label: 'remark', sub: '评论', correct: false },
      { label: 'remarkably', sub: '非凡地', correct: false },
    ],
    answer: 'remarkable',
    hint: '修饰名词 ability 的应是？',
    explain: '名词前用形容词 remarkable；-able 后缀本身就意味着“可…的”，是形容词信号。',
    tags: ['语境', 'remarkable'],
  },
  {
    id: 'qb-cc-3', type: 'contextChoice',
    prompt: '选词填空：Please _____ the instructions carefully before assembly.',
    narration: '祈使句缺的是动词原形。',
    choices: [
      { label: 'review', sub: '审阅', correct: true },
      { label: 'reviewer', sub: '审阅者', correct: false },
      { label: 'reviewing', sub: '审阅（进行）', correct: false },
    ],
    answer: 'review',
    hint: '句首 Please 后面接什么？',
    explain: 'Please + 动词原形：review；-er 指人、-ing 需要助动词，均不匹配句式。',
    tags: ['语境', 'review'],
  },
  {
    id: 'qb-cc-4', type: 'contextChoice',
    prompt: '选词填空：The two theories are not _____; they can both be true.',
    narration: '否定词提示语义方向。',
    choices: [
      { label: 'contradictory', sub: '互相矛盾的', correct: true },
      { label: 'contradict', sub: '反驳', correct: false },
      { label: 'contradiction', sub: '矛盾（名词）', correct: false },
    ],
    answer: 'contradictory',
    hint: 'are 后面缺表语形容词。',
    explain: 'are not + 形容词：contradictory（contra- 相反 + dict 说 + -ory 形容词后缀）。',
    tags: ['语境', 'contradictory'],
  },
  {
    id: 'qb-cc-5', type: 'contextChoice',
    prompt: '选词填空：He could not _____ the meaning of the poem.',
    narration: '情态动词后接动词原形。',
    choices: [
      { label: 'comprehend', sub: '理解', correct: true },
      { label: 'comprehension', sub: '理解力', correct: false },
      { label: 'comprehensive', sub: '全面的', correct: false },
    ],
    answer: 'comprehend',
    hint: 'could not 后面要动词。',
    explain: 'can/could + 动词原形：comprehend（com- 全部 + prehend 抓住 → 全面抓住 = 理解）。',
    tags: ['语境', 'comprehend'],
  },
  {
    id: 'qb-cc-6', type: 'contextChoice',
    prompt: '选词填空：Regular review reduces the _____ of forgetting.',
    narration: 'of 前后是名词结构。',
    choices: [
      { label: 'rate', sub: '比率', correct: true },
      { label: 'rapidly', sub: '迅速地', correct: false },
      { label: 'reduce', sub: '减少', correct: false },
    ],
    answer: 'rate',
    hint: 'the 与 of 之间必须是名词。',
    explain: 'the rate of forgetting：rate（名词，比率）；rapidly 是副词、rate 的动词形式不匹配冠词结构。',
    tags: ['语境', 'rate'],
  },
  {
    id: 'qb-cc-7', type: 'contextChoice',
    prompt: '选词填空：Please write your answers _____ and legibly.',
    narration: 'and 连接并列成分：副词对副词。',
    choices: [
      { label: 'clearly', sub: '清楚地', correct: true },
      { label: 'clear', sub: '清楚的', correct: false },
      { label: 'clarity', sub: '清晰（名词）', correct: false },
    ],
    answer: 'clearly',
    hint: 'legibly 是什么词性？',
    explain: 'and 连接并列副词：clearly + legibly；修饰动词 write 用副词，形容词 clear 不行。',
    tags: ['语境', 'clearly'],
  },
  {
    id: 'qb-cc-8', type: 'contextChoice',
    prompt: '选词填空：The old man walked slowly _____ the park.',
    narration: '介词选择看空间关系。',
    choices: [
      { label: 'through', sub: '穿过', correct: true },
      { label: 'thorough', sub: '彻底的', correct: false },
      { label: 'though', sub: '虽然', correct: false },
    ],
    answer: 'through',
    hint: '行走的路径要介词；另两个是拼写干扰。',
    explain: 'walk through the park（穿过公园）；thorough 是形容词、though 是连词——同形家族按词性分家。',
    tags: ['语境', 'through'],
  },
];

/* ------------------------------------------------------------------ */
/* 汇总                                                                 */
/* ------------------------------------------------------------------ */
export const quizBanks: Record<QuestionType, Question[]> = {
  listenChoosePhoneme,
  wordChoosePhoneme,
  phonemeChooseSpelling,
  spellingChoosePhoneme,
  listenWritePhoneme,
  listenWriteWord,
  syllableSplit,
  stressPosition,
  minimalPair,
  affixAssemble,
  contextChoice,
};
