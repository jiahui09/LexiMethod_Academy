import type { Achievement } from '@/types';

/**
 * LexiMethod Academy — 成就徽章（共 17 枚）
 * 徽章衡量的是“方法被使用的频次”，不是背了多少单词。
 */

export const achievements: Achievement[] = [
  {
    id: 'start',
    title: '初次启程',
    desc: '完成第一节方法课，正式开始用规则而不是死记来对付单词。',
    icon: 'Rocket',
  },
  {
    id: 'step5',
    title: '五步走完',
    desc: '在课程中走完 5 个学习步骤，把一个方法从原理练到实战应用。',
    icon: 'Target',
  },
  {
    id: 'method1',
    title: '方法入门',
    desc: '完整掌握第一个记忆方法，并在练习中至少用它解决一组词。',
    icon: 'BookOpenCheck',
  },
  {
    id: 'phoneme10',
    title: '十音起步',
    desc: '在音标实验室攻克 10 个音标，音形对应开始覆盖常见读音。',
    icon: 'AudioLines',
  },
  {
    id: 'streak3',
    title: '三日连燃',
    desc: '连续 3 天完成当日学习与复习，让间隔重复真正跑起来。',
    icon: 'Flame',
  },
  {
    id: 'streak7',
    title: '周周不断',
    desc: '连续 7 天保持学习节奏，把方法使用固化成每日习惯。',
    icon: 'CalendarCheck',
  },
  {
    id: 'streak14',
    title: '双周耐力',
    desc: '连续 14 天不间断学习，复习节奏与输出训练都未缺席。',
    icon: 'Crown',
  },
  {
    id: 'perfect',
    title: '零失误通关',
    desc: '在一轮练习中全部答对，说明该组规则已被你完整内化。',
    icon: 'Trophy',
  },
  {
    id: 'combo10',
    title: '十连击',
    desc: '连续答对 10 题，音形对应与规则调用已进入自动化状态。',
    icon: 'Sparkles',
  },
  {
    id: 'analyze10',
    title: '拆词分析师',
    desc: '用生词六步法完成 10 次词结构分析，见词就能拆出词根词缀。',
    icon: 'Brain',
  },
  {
    id: 'dictation20',
    title: '听写二十词',
    desc: '完成 20 次听写训练，把听到的音稳定还原成正确拼写。',
    icon: 'Ear',
  },
  {
    id: 'review10',
    title: '按时复习 ×10',
    desc: '累计完成 10 次到期复习，用回忆式自测替代反复重读。',
    icon: 'Headphones',
  },
  {
    id: 'all-methods',
    title: '方法集齐',
    desc: '学完全部记忆方法，能在不同词型面前自主选择合适的方法。',
    icon: 'Medal',
  },
  {
    id: 'phoneme48',
    title: '四十八音全通',
    desc: '掌握全部 48 个音标，任意单词的读音都能拆到音素级别。',
    icon: 'ListChecks',
  },
  {
    id: 'practice100',
    title: '百练成习',
    desc: '累计完成 100 道练习，方法使用次数足以形成稳定技能。',
    icon: 'Dumbbell',
  },
  {
    id: 'lab-master',
    title: '音标实验室大师',
    desc: '在音标实验室全维度通关，发音、拼写与辨音三项均可示范他人。',
    icon: 'Mic',
  },
  {
    id: 'feynman1',
    title: '讲得出，才算会',
    desc: '通过一次费曼关：用自己的话讲清规则、给出例子与例外，并完成自评校准。',
    icon: 'MessagesSquare',
  },
];
