import type { Rule, RuleType } from '@/types';

/**
 * LexiMethod Academy — 方法规则库
 * 覆盖五大类：phonics（音标/自然拼读）、prefix（前缀）、suffix（后缀）、root（词根）、stress（重音）。
 * 每条 explanation 都是可直接授课的中文讲解，examples 给出真实例词并标注拆分或读音。
 */

export const rules: Rule[] = [
  /* ---------------------------------------------------- 自然拼读 phonics */
  {
    id: 'r-phonics-01',
    type: 'phonics',
    pattern: '开音节：元音字母收尾，读字母本音',
    explanation:
      '音节以元音字母 a、e、i、o、u 收尾、后面没有辅音封锁时叫开音节，元音字母念出它自己的名字音：a 读 /eɪ/、e 读 /iː/、i 读 /aɪ/、o 读 /əʊ/、u 读 /juː/。判断读音第一步永远是看音节怎么收尾。',
    examples: ['he /hiː/', 'me /miː/', 'go /ɡəʊ/', 'hi /haɪ/', 'use /juː/'],
  },
  {
    id: 'r-phonics-02',
    type: 'phonics',
    pattern: '闭音节：元音被辅音封口，读短音',
    explanation:
      '音节里元音字母后面紧跟辅音、把它“关”在里面时叫闭音节，五个元音一律读短音：a /æ/、e /e/、i /ɪ/、o /ɒ/、u /ʌ/。看到“辅-元-辅”结构先按短音读，再根据magic e 等线索修正。',
    examples: ['cat /kæt/', 'bed /bed/', 'sit /sɪt/', 'hot /hɒt/', 'cup /kʌp/'],
  },
  {
    id: 'r-phonics-03',
    type: 'phonics',
    pattern: 'magic e：元音+辅音+e，e 不发音，前元音读字母音',
    explanation:
      '词尾 e 自己不出声，却像魔法一样让前面隔一个辅音的元音读出字母本音：a→/eɪ/、i→/aɪ/、o→/əʊ/、u→/juː/、e→/iː/。见到“元音+辅音+e”结构，先把前面的元音按长音读，e 只做信号不做音。',
    examples: ['name /neɪm/', 'kite /kaɪt/', 'home /həʊm/', 'cute /kjuːt/', 'these /ðiːz/'],
  },
  {
    id: 'r-phonics-04',
    type: 'phonics',
    pattern: '词尾不发音 e：触发长音并软化 c、g',
    explanation:
      '词尾不发音的 e 有两个职责：一是触发 magic e 长音，二是让前面的 c、g 变“软”，c 在 e 前读 /s/、g 在 e 前读 /dʒ/。读 peace、stage 时 e 虽不出声，却改变了整词读音，拼写时绝不能省略它。',
    examples: ['peace /piːs/', 'stage /steɪdʒ/', 'change /tʃeɪndʒ/', 'nice /naɪs/'],
  },
  {
    id: 'r-phonics-05',
    type: 'phonics',
    pattern: '元音组合：ai/ay、ee/ea、oa/ow、oi/oy、ou/ow',
    explanation:
      '两个元音字母连写时通常合读成一个双元音：ai/ay 读 /eɪ/，ee/ea 读 /iː/，oa/ow 读 /əʊ/，oi/oy 读 /ɔɪ/，ou/ow 读 /aʊ/。看到元音连写先按组合整体读，切忌把两个字母拆开各读各的。',
    examples: ['rain /reɪn/', 'day /deɪ/', 'feet /fiːt/', 'boat /bəʊt/', 'boy /bɔɪ/', 'house /haʊs/'],
  },
  {
    id: 'r-phonics-06',
    type: 'phonics',
    pattern: '辅音连缀：多个辅音紧密相连，中间不加元音',
    explanation:
      'bl、br、cl、cr、str、spr、nd、st 这类辅音连缀要一口气连读，中间不许插入“呃”的过渡音。很多学习者把 street 读成“斯特瑞特”，就是在连缀里塞了元音；训练时让每个辅音滑过去，一个停顿都不能有。',
    examples: ['black /blæk/', 'street /striːt/', 'strong /strɒŋ/', 'hand /hænd/', 'milk /mɪlk/'],
  },
  {
    id: 'r-phonics-07',
    type: 'phonics',
    pattern: '-tion 读 /ʃən/，-sion 读 /ʒən/ 或 /ʃən/',
    explanation:
      '词尾 -tion 固定读 /ʃən/，-sion 在元音后读 /ʒən/、在辅音后读 /ʃən/，且重音都落在它们前面那个音节上。看到 tion 就切出 na·tion 这样的整体音节块，长词的读音和重音一步确定。',
    examples: ['nation /ˈneɪʃən/', 'invention /ɪnˈvenʃən/', 'decision /dɪˈsɪʒən/', 'mission /ˈmɪʃən/'],
  },
  {
    id: 'r-phonics-08',
    type: 'phonics',
    pattern: '-tion → /tʃən/ 的少数例外',
    explanation:
      '绝大多数 -tion 读 /ʃən/，但在 s 之后的 -stion 以及少数词里读 /tʃən/，最常用的就是 question 和 suggestion。这两个词高频到必须整体记住：看到 qu-s-tion 要读出“丘申”的感觉，别按通用规则硬套。',
    examples: ['question /ˈkwestʃən/', 'suggestion /səˈdʒestʃən/', 'congestion /kənˈdʒestʃən/'],
  },
  {
    id: 'r-phonics-09',
    type: 'phonics',
    pattern: 'soft c / soft g：c、g 在 e i y 前变软',
    explanation:
      'c 在 e、i、y 前读 /s/（city、cent、cycle），g 在 e、i、y 前读 /dʒ/（gentle、giant、gym）；其余位置 c 读 /k/、g 读 /ɡ/。判断 c、g 的读音只看它后面跟着谁，这是拆词定音的关键一步。',
    examples: ['city /ˈsɪti/', 'cent /sent/', 'giant /ˈdʒaɪənt/', 'gym /dʒɪm/', 'girl /ɡɜːl/'],
  },
  {
    id: 'r-phonics-10',
    type: 'phonics',
    pattern: 'qu 永远读 /kw/',
    explanation:
      '英语里 qu 是固定组合，一律读 /kw/，相当于 k 和 w 合成一个动作：先发 /k/ 再迅速滑向 /w/。queen、quiet、quite、question 全部如此，看到 qu 直接读“库乌”的合音，不必逐词犹豫。',
    examples: ['queen /kwiːn/', 'quiet /ˈkwaɪət/', 'quite /kwaɪt/', 'question /ˈkwestʃən/'],
  },
  {
    id: 'r-phonics-11',
    type: 'phonics',
    pattern: 'y 作元音：词尾读 /aɪ/ 或 /i/，词中读 /ɪ/',
    explanation:
      '单音节词里 y 当元音读 /aɪ/（my、sky）；多音节词词尾的 y 读 /i/（happy、baby）；夹在辅音之间的词中 y 读 /ɪ/（gym、myth）。y 是半个元音字母，先看它在词里的位置，再决定读哪一个音。',
    examples: ['my /maɪ/', 'sky /skaɪ/', 'happy /ˈhæpi/', 'gym /dʒɪm/', 'myth /mɪθ/'],
  },
  {
    id: 'r-phonics-12',
    type: 'phonics',
    pattern: '-ed 词尾读 /t/、/d/、/ɪd/ 三种',
    explanation:
      '动词过去式 -ed 的读音取决于前面音素的清浊：清辅音后读 /t/（walked），浊辅音和元音后读 /d/（played），在 /t/、/d/ 音后读 /ɪd/（wanted）。-ed 不构成音节时绝不读成“的”。',
    examples: ['walked /wɔːkt/', 'played /pleɪd/', 'wanted /ˈwɒntɪd/', 'needed /ˈniːdɪd/'],
  },

  /* -------------------------------------------------------- 前缀 prefix */
  {
    id: 'r-prefix-01',
    type: 'prefix',
    pattern: 'un-：不、非、相反',
    explanation:
      'un- 是最高频的否定前缀，加在形容词或分词前表示“不、未、反”：happy→unhappy（不开心）、lock→unlock（解锁）。它只改变意思、不改变词性；遇到眼生的形容词，试着加 un- 推测反义，命中率很高。',
    examples: ['unhappy', 'unable', 'unlock', 'undress'],
  },
  {
    id: 'r-prefix-02',
    type: 'prefix',
    pattern: 're-：再、又、重新、返回',
    explanation:
      're- 表示“再次、重新、返回”，加在动词前构成动作的重复：write→rewrite（重写）、build→rebuild（重建）。读音上 re- 常弱读 /rɪ/，重音仍落在词根；拆词时先把 re- 剥掉，词义往往就露出来了。',
    examples: ['rewrite', 'return', 'rebuild', 'review'],
  },
  {
    id: 'r-prefix-03',
    type: 'prefix',
    pattern: 'dis-：不、否定、分离',
    explanation:
      'dis- 有“不”和“分开”两层意思：agree→disagree（不同意）取否定，connect→disconnect（断开）取分离。它与 un- 都表否定，但 dis- 更常与动词、名词搭配，语气更直接，也更常表示空间上的“拆开”。',
    examples: ['disagree', 'dislike', 'disconnect', 'discover'],
  },
  {
    id: 'r-prefix-04',
    type: 'prefix',
    pattern: 'pre-：在……之前',
    explanation:
      'pre- 表示时间或位置上的“先、前”：view→preview（预览）、dict“说”→predict（提前说→预言）、prepare（预备好）。看到 pre- 就想到“提前一步”，这类词多与计划、预告、准备工作相关。',
    examples: ['preview', 'predict', 'prepare', 'preschool'],
  },
  {
    id: 'r-prefix-05',
    type: 'prefix',
    pattern: 'pro-：向前、支持、赞成',
    explanation:
      'pro- 表示“向前、朝前”，引申为“支持、站在前面”：gress“走”→progress（进步）、mote“移动”→promote（促进/晋升）。它与 con-“一起”方向相对，pro- 开头的词往往带有积极前进的色彩。',
    examples: ['progress', 'promote', 'provide', 'protect'],
  },
  {
    id: 'r-prefix-06',
    type: 'prefix',
    pattern: 'mis-：错误地、不当',
    explanation:
      'mis- 表示“做错、弄错”，几乎只加在动词或名词前：take→mistake（拿错→错误）、spell→misspell（拼错）、understand→misunderstand（误解）。看到 mis- 立刻想到“出了岔子”，猜词方向不会错。',
    examples: ['mistake', 'misspell', 'mislead', 'misunderstand'],
  },
  {
    id: 'r-prefix-07',
    type: 'prefix',
    pattern: 'sub-：在下、次级、亚',
    explanation:
      'sub- 表示“在下方、次一等、亚于”：way→subway（地下的路→地铁）、marine“海的”→submarine（潜水艇）、title→subtitle（副标题）。记它的方向感：sub 永远“低调地在下面”，从不越位到上面。',
    examples: ['subway', 'submarine', 'subtitle', 'suburb'],
  },
  {
    id: 'r-prefix-08',
    type: 'prefix',
    pattern: 'inter-：在……之间、相互',
    explanation:
      'inter- 表示“在两者之间”或“相互”：national→international（国家之间的→国际的）、net→internet（网与网之间）。表“相互”时，interpret、interview 都隐含你我之间来回交流的画面，方向是横向连通。',
    examples: ['international', 'internet', 'interview', 'interpret'],
  },
  {
    id: 'r-prefix-09',
    type: 'prefix',
    pattern: 'trans-：横跨、穿过、转变',
    explanation:
      'trans- 表示“横穿、跨越、转变成另一状态”：port“运”→transport（运送过去）、late→translate（把意思搬到另一种语言）、form→transform（改变形态）。它的核心画面是“从此岸到彼岸”。',
    examples: ['transport', 'translate', 'transfer', 'transform'],
  },
  {
    id: 'r-prefix-10',
    type: 'prefix',
    pattern: 'com-/con-：共同、一起',
    explanation:
      'com- 在 b、m、p 前保持原形（combine），在其他字母前常变成 con-（connect、collect），两者都表示“一起、共同”。词根 pose、struct、nect 配上它们，就得到“放在一起、连在一起”的含义。',
    examples: ['combine', 'connect', 'collect', 'common'],
  },
  {
    id: 'r-prefix-11',
    type: 'prefix',
    pattern: 'in-/im-/il-/ir-：不、否定（同族变体）',
    explanation:
      '否定前缀 in- 会按后面的字母同化：p、b 前变 im-（impossible），l 前变 il-（illegal），r 前变 ir-（irregular），其余用 in-（inactive）。四个形式是同一个“不”，只是读音随后接字母微调。',
    examples: ['inactive', 'impossible', 'illegal', 'irregular'],
  },
  {
    id: 'r-prefix-12',
    type: 'prefix',
    pattern: 'ex-：向外、前任',
    explanation:
      'ex- 表示“向外、出去”，也表示“前任、已离任”：port“运”→export（运出去→出口）、clude“关”→exclude（关在外面）、president→ex-president（前总统）。它的方向感始终是“由内朝外”。',
    examples: ['export', 'exclude', 'explain', 'ex-chairman'],
  },
  {
    id: 'r-prefix-13',
    type: 'prefix',
    pattern: 'ab-：离开、偏离、反常',
    explanation:
      'ab- 表示“离开、偏离正常”：normal→abnormal（反常）、sent“在场”→absent（不在场→缺席）、tract“拉”→abstract（从具体中抽离→抽象）。记住 ab 的方向是“背离”，与 ad-“靠近”正好相反。',
    examples: ['abnormal', 'absent', 'abstract', 'abuse'],
  },
  {
    id: 'r-prefix-14',
    type: 'prefix',
    pattern: 'ad-：朝向、靠近（常同化为 ac-/af-/at-）',
    explanation:
      'ad- 表示“朝向、靠近”，遇到同辅音时常发生同化：tract“拉”→attract（拉过来→吸引）、dress→address（对准本人说）、vance→advance（向前走）。见到 acc-、aff-、att- 开头，先想到 ad-。',
    examples: ['attract', 'advance', 'address', 'adapt'],
  },

  /* -------------------------------------------------------- 后缀 suffix */
  {
    id: 'r-suffix-01',
    type: 'suffix',
    pattern: '-tion / -sion：动词→名词',
    explanation:
      '把动词变成名词最常用的后缀，读 /ʃən/ 或 /ʒən/，重音固定在它前一个音节：act→action、decide→decision。阅读与口语里极高频；见到 -tion 先反推它的动词原形，词义往往直接揭晓。',
    examples: ['action', 'invention', 'decision', 'education'],
  },
  {
    id: 'r-suffix-02',
    type: 'suffix',
    pattern: '-ment：动词→名词，表结果、手段',
    explanation:
      '-ment 把动词变成名词，表示“结果、产物、手段”：develop→development（发展）、judge→judgment（判决）。它读作独立弱读音节 /mənt/，词根重音完全不动，是规则最规整的后缀之一。',
    examples: ['development', 'agreement', 'environment', 'judgment'],
  },
  {
    id: 'r-suffix-03',
    type: 'suffix',
    pattern: '-ness：形容词→名词，表性质、状态',
    explanation:
      '-ness 把形容词变成名词，表示“具有某种性质”：happy→happiness（快乐）、dark→darkness（黑暗）。读音是弱读音节 /nɪs/，词根重音位置原样保留，kind→kindness 一推即得，几乎零例外。',
    examples: ['happiness', 'darkness', 'kindness', 'weakness'],
  },
  {
    id: 'r-suffix-04',
    type: 'suffix',
    pattern: '-able / -ible：能……的、可……的',
    explanation:
      '两个后缀都表示“能够、可以”：read→readable（可读的）、vis“看”→visible（能看见的）。含义一致但拼写不能互换：-able 多配本族词，-ible 多来自拉丁词根，遇到 vis-、flex-、poss- 就该想起 -ible。',
    examples: ['readable', 'acceptable', 'visible', 'possible'],
  },
  {
    id: 'r-suffix-05',
    type: 'suffix',
    pattern: '-ous：名词→形容词，“多……的”',
    explanation:
      '-ous 把名词变成形容词，表示“充满……的、有……特质的”：danger→dangerous（危险的）、fame→famous（有名的）。它永远弱读 /əs/，重音全部留在词根上，读词时别把重音挪到词尾。',
    examples: ['dangerous', 'famous', 'curious', 'nervous'],
  },
  {
    id: 'r-suffix-06',
    type: 'suffix',
    pattern: '-ive：形容词后缀，表倾向、作用',
    explanation:
      '-ive 表示“有……倾向的、起……作用的”：act→active（主动的）、create→creative（有创造力的）。它本身永远弱读 /ɪv/，重音位置随词根走，active 重在词首、creative 重在中段，需按词根逐个记。',
    examples: ['active', 'creative', 'attractive', 'relative'],
  },
  {
    id: 'r-suffix-07',
    type: 'suffix',
    pattern: '-ize / -ise：动词后缀，“使……化”',
    explanation:
      '-ize 表示“使……、……化”：real→realize（使成真→意识到）、modern→modernize（现代化）。英式拼写多用 -ise，美式用 -ize，读音都是 /aɪz/，含义完全相同，记一种拼写即可。',
    examples: ['realize', 'modernize', 'organize', 'apologize'],
  },
  {
    id: 'r-suffix-08',
    type: 'suffix',
    pattern: '-ful：形容词后缀，“充满……的”',
    explanation:
      '-ful 源自 full，表示“充满、带有”：care→careful（小心的）、hope→hopeful（有希望的）。它把名词整块变成形容词，同一个词加一次就够；与 -less 构成一对反义后缀，成对记忆最省力。',
    examples: ['careful', 'hopeful', 'beautiful', 'wonderful'],
  },
  {
    id: 'r-suffix-09',
    type: 'suffix',
    pattern: '-less：形容词后缀，“无、缺……的”',
    explanation:
      '-less 表示“没有、缺少”：care→careless（粗心的）、hope→hopeless（无望的）。它与 -ful 正好一反一正，配对记忆：careful/careless、hopeful/hopeless，一批形容词的反义词就此自动补齐。',
    examples: ['careless', 'hopeless', 'homeless', 'powerless'],
  },
  {
    id: 'r-suffix-10',
    type: 'suffix',
    pattern: '-ly：形容词→副词（也表“每……的”）',
    explanation:
      '形容词加 -ly 变副词：quick→quickly（快速地）、slow→slowly。但要注意 friendly、lovely 依然是形容词，daily、weekly 表示“每……的”，而 true→truly 要去掉词尾 e，按小类分开记才不会乱。',
    examples: ['quickly', 'slowly', 'friendly', 'truly'],
  },
  {
    id: 'r-suffix-11',
    type: 'suffix',
    pattern: '-er / -or：名词后缀，做……的人或物',
    explanation:
      '两个后缀都表示“执行者、器具”：teach→teacher（教师）、act→actor（演员）、work→worker（工人）。-er 更本族常用，-or 多见于拉丁来源词；另外比较级也用 -er（faster），靠词性判断它表人还是比较级。',
    examples: ['teacher', 'worker', 'actor', 'visitor'],
  },
  {
    id: 'r-suffix-12',
    type: 'suffix',
    pattern: '-ist：名词后缀，从业者、主义者',
    explanation:
      '-ist 表示“从事某事的人”或“信奉某主义的人”：art→artist（艺术家）、science→scientist（科学家）、tour→tourist（游客）。它与表主义的 -ism 成对出现，先认 -ism 再认 -ist，一串词同时到手。',
    examples: ['artist', 'scientist', 'tourist', 'pianist'],
  },
  {
    id: 'r-suffix-13',
    type: 'suffix',
    pattern: '-al：名词→形容词，“具有……的”',
    explanation:
      '-al 把名词变成形容词，表示“属于、具有”：nature→natural（自然的）、culture→cultural（文化的）。词尾读成 /əl/ 或 /l/ 的弱读音节，词根重音不动，nation→national 一推即得，几乎无例外。',
    examples: ['natural', 'cultural', 'national', 'personal'],
  },
  {
    id: 'r-suffix-14',
    type: 'suffix',
    pattern: '-y：形容词后缀，“多……的”',
    explanation:
      '-y 加在名词后表示“多……的、带……的”：rain→rainy（多雨的）、sand→sandy（多沙的）。词尾读 /i/；若词根以短元音加单辅音结尾，加 -y 前要双写辅音：sun→sunny、run→runny，拼写细节别丢。',
    examples: ['rainy', 'sandy', 'sunny', 'dirty'],
  },

  /* ---------------------------------------------------------- 词根 root */
  {
    id: 'r-root-01',
    type: 'root',
    pattern: 'spect / vis = 看',
    explanation:
      'spect 与 vis 同义，都是“看”：inspect（往里看→检查）、respect（再看一眼→尊重）、suspect（从下往上看→怀疑）；vis 一侧有 visible（能看见的）、revise（再看一遍→修订）。一个意思两条拼法，成组记。',
    examples: ['inspect', 'respect', 'suspect', 'visible', 'revise'],
  },
  {
    id: 'r-root-02',
    type: 'root',
    pattern: 'dict = 说、宣告',
    explanation:
      'dict 表示“说”：dictionary（把说的记下来→词典）、predict（提前说→预测）、dictate（口述→听写）、contradict（反着说→反驳）。凡是涉及“开口表达”的词，词根里都可能藏着 dict。',
    examples: ['dictionary', 'predict', 'dictate', 'contradict'],
  },
  {
    id: 'r-root-03',
    type: 'root',
    pattern: 'port = 搬运、运送',
    explanation:
      'port 的本义是“搬运”：export（向外运→出口）、import（向内运→进口）、transport（跨越运送→运输）、portable（能搬走的→便携的）。方向全由前缀决定，词根永远是“运”，一词根串起整族词。',
    examples: ['export', 'import', 'transport', 'portable'],
  },
  {
    id: 'r-root-04',
    type: 'root',
    pattern: 'struct / stru = 建造',
    explanation:
      'struct 表示“建造、堆叠”：construct（一起建→构造）、structure（建筑物→结构）、instruct（在脑中搭起来→指导）、de-stru-ct（拆下来→毁灭）。同一个“搭积木”的意象贯穿整族词。',
    examples: ['construct', 'structure', 'instruct', 'destroy'],
  },
  {
    id: 'r-root-05',
    type: 'root',
    pattern: 'graph / gram = 写、画、记录',
    explanation:
      'graph 表示“写、画”：telegraph（远距离传字→电报）、geography（描画大地→地理）；gram 指“写出来的东西”：grammar（写作规范→语法）、telegram（电报文本）。拍照 photography 也同出一源。',
    examples: ['geography', 'photography', 'grammar', 'telegram'],
  },
  {
    id: 'r-root-06',
    type: 'root',
    pattern: 'bio = 生命、生物',
    explanation:
      'bio 表示“生命”：biology（研究生命的学科→生物学）、biography（记录一生的文字→传记）、antibiotic（对抗生命的→抗生素）。bio 一露面，词义基本锁定在“生命”这个范畴里。',
    examples: ['biology', 'biography', 'antibiotic', 'biochemical'],
  },
  {
    id: 'r-root-07',
    type: 'root',
    pattern: 'geo = 大地、地球',
    explanation:
      'geo 表示“大地、地球”：geography（描画大地→地理学）、geology（研究大地的学科→地质学）、geometry（测量土地→几何）。看到 geo 开头，先把词义放到“地”上去想，命中率极高。',
    examples: ['geography', 'geology', 'geometry', 'geothermal'],
  },
  {
    id: 'r-root-08',
    type: 'root',
    pattern: 'phon = 声音',
    explanation:
      'phon 表示“声音”：telephone（把声音传远→电话）、symphony（声音凑在一起→交响乐）、phonics（关于声音的学问→自然拼读）、microphone（收拢微小声音→麦克风）。发音与声音类词都绕不开它。',
    examples: ['telephone', 'symphony', 'phonics', 'microphone'],
  },
  {
    id: 'r-root-09',
    type: 'root',
    pattern: 'form = 形状、形式',
    explanation:
      'form 表示“形状、形态”：reform（重新塑形→改革）、transform（改变形态→转变）、uniform（同一种形状→制服/统一）、inform（把信息灌进形式→通知）。形一变，义就跟着变。',
    examples: ['reform', 'transform', 'uniform', 'inform'],
  },
  {
    id: 'r-root-10',
    type: 'root',
    pattern: 'ject = 扔、投',
    explanation:
      'ject 表示“扔、抛”：project（往前扔→投射/项目）、reject（扔回去→拒绝）、inject（扔进去→注射）、eject（扔出去→弹出）。前缀给方向、词根给动作，四个词的画面一次成型。',
    examples: ['project', 'reject', 'inject', 'eject'],
  },
  {
    id: 'r-root-11',
    type: 'root',
    pattern: 'mit / miss = 送、放',
    explanation:
      'mit 与 miss 是同一词根的两个变体，意为“送出”：transmit（跨过去送→传输）、submit（送到下面→提交）、mission（被派出的任务→使命）、dismiss（散开送走→解散/驳回）。元音变化是同源痕迹。',
    examples: ['transmit', 'submit', 'mission', 'dismiss'],
  },
  {
    id: 'r-root-12',
    type: 'root',
    pattern: 'cap / cept / cup = 抓、拿、取',
    explanation:
      '三个变体都源自“抓取”：capture（一把抓住→捕获）、accept（朝自己抓→接受）、concept（抓在脑中→概念）、occupy（抓在手里→占据）。元音不同、含义同源，成组记忆省一半力气。',
    examples: ['capture', 'accept', 'concept', 'occupy'],
  },
  {
    id: 'r-root-13',
    type: 'root',
    pattern: 'fer = 带来、运送',
    explanation:
      'fer 表示“带来、搬运”：transfer（跨着带过去→转移）、prefer（提前带上倾向→更喜欢）、refer（带回去查阅→参考）、differ（各带一边→不同）。抽象的“携带”都能用它解释通。',
    examples: ['transfer', 'prefer', 'refer', 'differ'],
  },
  {
    id: 'r-root-14',
    type: 'root',
    pattern: 'flu = 流动',
    explanation:
      'flu 表示“流动”：influence（流入的影响→影响）、fluent（语言流得起来→流利的）、fluid（会流动→流体）、flu（流感：随空气流动传播）。想到 flu 就想象水流，词义自然带出来。',
    examples: ['influence', 'fluent', 'fluid', 'flu'],
  },
  {
    id: 'r-root-15',
    type: 'root',
    pattern: 'tract = 拉、拖',
    explanation:
      'tract 表示“拉、拖”：attract（朝自己拉→吸引）、extract（往外拉→提取）、contract（拉到一起→收缩/合同）、distract（拉散开→分心）。四个词只差一个前缀，方向一换意思就换。',
    examples: ['attract', 'extract', 'contract', 'distract'],
  },
  {
    id: 'r-root-16',
    type: 'root',
    pattern: 'log = 说、学科、理性',
    explanation:
      'log 既表示“说、话语”（dialogue 对话、apology 说抱歉→道歉），也表示“学科、理性”（biology 生物学、logic 逻辑）。同一个词根撑起一整片学术词汇，见到 -log- 先往“话语/学科”上想。',
    examples: ['dialogue', 'logic', 'apology', 'biology'],
  },
  {
    id: 'r-root-17',
    type: 'root',
    pattern: 'scrib / script = 写',
    explanation:
      'scrib 与 script 都是“写”：describe（描写）、prescribe（提前写下来→开处方/规定）、manuscript（手写的东西→手稿）、script（文字稿/剧本）。医生开的 prescription 也是“写给你的话”。',
    examples: ['describe', 'prescribe', 'manuscript', 'script'],
  },

  /* -------------------------------------------------------- 重音 stress */
  {
    id: 'r-stress-01',
    type: 'stress',
    pattern: '双音节：名前动后',
    explanation:
      '很多双音节词兼有名词和动词两种词性：作名词时重音在第一个音节，作动词时在第二个，即“名前动后”。听音时先判断词性，重音、词义同时确定；这是双音节词最核心的一条重音规律。',
    examples: ['record 名 /ˈrekɔːd/ 动 /rɪˈkɔːd/', 'produce 名 /ˈprɒdjuːs/ 动 /prəˈdjuːs/', 'import 名 /ˈɪmpɔːt/ 动 /ɪmˈpɔːt/', 'present 名 /ˈprezənt/ 动 /prɪˈzent/'],
  },
  {
    id: 'r-stress-02',
    type: 'stress',
    pattern: '-tion / -sion 前一个音节重读',
    explanation:
      '凡是以 -tion、-sion 结尾的多音节词，重音几乎必然落在它前面那个音节上，可当铁律使用：invention 重在 ven、decision 重在 ci。看到 tion 就往前数一格标重音，读音基本不会错。',
    examples: ['invention /ɪnˈvenʃən/', 'decision /dɪˈsɪʒən/', 'education /ˌedʒuˈkeɪʃən/', 'organization /ˌɔːɡənaɪˈzeɪʃən/'],
  },
  {
    id: 'r-stress-03',
    type: 'stress',
    pattern: '三音节及以上：重音常在倒数第三',
    explanation:
      '英语多音节词的默认重音落在倒数第三个音节（倒三音节），名词、形容词尤其如此：history 重在 his、memory 重在 mem、medicine 重在 med。拿不准时先按倒三标，再用后缀规则修正。',
    examples: ['history /ˈhɪstəri/', 'memory /ˈmeməri/', 'medicine /ˈmedsn/', 'delicate /ˈdelɪkət/'],
  },
  {
    id: 'r-stress-04',
    type: 'stress',
    pattern: '前缀不带重音，重音落在词根',
    explanation:
      '前缀 re-、dis-、un-、in-、pre- 等一般弱读，重音落在后面的词根上：report 重在 port、discover 重在 cov、require 重在 quire。拆词时先剥掉前缀，重音位置便跟着词根走，长词不再无从下手。',
    examples: ['report /rɪˈpɔːt/', 'discover /dɪˈskʌvə/', 'require /rɪˈkwaɪə/', 'introduce /ˌɪntrəˈdjuːs/'],
  },
  {
    id: 'r-stress-05',
    type: 'stress',
    pattern: '-ic / -ity / -ical 的重音定位',
    explanation:
      '-ic 重读它前面那个音节（electric→e-ˈLEC-tric），-ity 同样把重音拉到其前（university 重在 ver），换成 -ical 时重音常落在倒数第三（political 重在 li）。后缀换了，重音就搬家。',
    examples: ['electric /ɪˈlektrɪk/', 'university /ˌjuːnɪˈvɜːsəti/', 'political /pəˈlɪtɪkl/', 'photographic /ˌfəʊtəˈɡræfɪk/'],
  },
  {
    id: 'r-stress-06',
    type: 'stress',
    pattern: '词性切换，重音在同形词间移动',
    explanation:
      'record、produce、import、contract、object 这类同形词，词形完全相同、词性却不同，唯一线索就是重音：名词/形容词读前，动词读后。口语中按词性预判重音，读错会被听成另一个词。',
    examples: ['contract 名 /ˈkɒndʌkt/ 动 /kənˈdʌkt/', 'object 名 /ˈɒbdʒɪkt/ 动 /əbˈdʒekt/', 'present 形 /ˈprezənt/ 动 /prɪˈzent/'],
  },
];

/** 按规则类型分组（五大类均存在） */
export const rulesByType: Record<RuleType, Rule[]> = rules.reduce<Record<RuleType, Rule[]>>(
  (acc, rule) => {
    acc[rule.type].push(rule);
    return acc;
  },
  { phonics: [], prefix: [], suffix: [], root: [], stress: [] },
);

/** 以 id 索引单条规则 */
export const ruleById: Record<string, Rule> = rules.reduce<Record<string, Rule>>((acc, rule) => {
  acc[rule.id] = rule;
  return acc;
}, {});
