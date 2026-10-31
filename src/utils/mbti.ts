/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MBTIPersonality } from '../types';

export const MBTI_DATA: Record<string, MBTIPersonality> = {
  "INTJ": {
    type: "INTJ",
    title: "幕后战术师 / 建筑师",
    description: "具有强大的战略直觉与逻辑思辨能力。他们深笃信念，行事如同一尊精密的沙盘推演器，不尚空论，只信奉客观底层规律与终极理性。",
    jungianConcept: "主导 Ni (内倾直觉) - 辅助 Te (外倾思考)",
    strengths: ["高瞻远瞩的全局规划力", "绝不妥协的批判性逻辑", "卓越的独立精神与自驱"],
    weaknesses: ["容易显得过于高冷与批判", "不易妥协", "有时忽视当下微观情感"],
    luckyCrystal: "紫水晶 (增强精神直觉，安神静思)",
    idealPartners: ["ENFP (灵魂双子)", "ENTJ (王座拍档)", "INFJ (深度共鸣者)"],
    growthAdvice: "执念过深则易流于孤芳自赏。多用第三维度的感觉（Se）去拥抱具体的四季风物与琐屑温情。"
  },
  "INFJ": {
    type: "INFJ",
    title: "精神灯塔首 / 提倡者",
    description: "16型人格中最具玄奥神秘气息的理想主义者。他们天生能洞悉人心深处的伤口，将人类救赎与精神纯净视为终身远航的风向标。",
    jungianConcept: "主导 Ni (内倾直觉) - 辅助 Fe (外倾情感)",
    strengths: ["超自然的神奇共情直觉", "坚定高尚的本真原则", "善以文字与艺术启迪公众"],
    weaknesses: ["完美主义倾向极其严重", "内心极其敏感，容易自我消耗", "难以对泛泛之辈敞开心扉"],
    luckyCrystal: "拉长石 (激发第六感，净化气场脉轮)",
    idealPartners: ["ENFJ (同愿同行者)", "ENTP (思想奇辩客)", "INTJ (灵知知己)"],
    growthAdvice: "莫将世界的苦难全然背负于一身。适度让理性（Ti）作为防盾，划清同理心的精神防线。"
  },
  "INFP": {
    type: "INFP",
    title: "空谷幽兰 / 治愈之诗者",
    description: "内心深驻一座静谧花园。他们极度珍视精神信仰和个人道德圣洁，视生存为一场在庸俗世界中守护诗意灵魂的隐修行旅。",
    jungianConcept: "主导 Fi (内倾情感) - 辅助 Ne (外倾直觉)",
    strengths: ["超卓的文字意境与艺术天分", "极致的纯粹与仁爱同理", "不愿逐流的自洽风骨"],
    weaknesses: ["行动滞后，容易陷入理想白日梦", "极度抗拒机械教条管束", "遇争执习于退入内心巢穴"],
    luckyCrystal: "粉水晶 (温润心轮，接纳不完美的世界)",
    idealPartners: ["ENFJ (永恒暖炉)", "ENTP (智谋游侠)", "INFJ (山水知音)"],
    growthAdvice: "不要因害怕现实的粗糙而拒绝播种。借助外倾思考（Te）的支柱，让内心伟大的诗篇具体落地。"
  },
  "INTP": {
    type: "INTP",
    title: "智械核心学者 / 思想家",
    description: "16型人格中的客观解构主义泰斗。他们将世上的一切规律化为了几何数轴，不休止地剥茧抽丝以求索最精简、最纯粹的终极真理。",
    jungianConcept: "主导 Ti (内倾思考) - 辅助 Ne (外倾直觉)",
    strengths: ["超群的抽象概念建构力", "不带偏见与成见的高度理性", "对复杂变局的秒解洞察"],
    weaknesses: ["社交表达有时过于直接而显得唐突", "讨厌毫无意义的虚礼情应", "容易思索过载而迟滞落实"],
    luckyCrystal: "萤石 (安定脑波，加持逻辑思辨空间)",
    idealPartners: ["ENTP (思辨魔术师)", "INFJ (精神伴侣)", "INTJ (并肩论道者)"],
    growthAdvice: "理性推衍固然无瑕，但人类的爱常在逻辑死角之外生根。多给予他人一句暖心的肯定。"
  },
  "ENTJ": {
    type: "ENTJ",
    title: "开山领主 / 战术指挥官",
    description: "天生的宏观领军者。他们视障碍为踏板，善于规划庞大的资源体系，雷厉风行地重塑旧世界的规则，建立自洽的高效新秩序。",
    jungianConcept: "主导 Te (外倾思考) - 辅助 Ni (内倾直觉)",
    strengths: ["令人臣服的决断与凝聚统御理", "遇变不惊的高度效率底盘", "对前瞻机会的猎手审视"],
    weaknesses: ["易给人居高临下的高压窒息感", "难以忍受他人的迟滞与借口", "忽视情感层面的脆弱关怀"],
    luckyCrystal: "金发晶 (聚揽财富能量，霸气开拓大局)",
    idealPartners: ["INTJ (智略军师)", "ENFP (灵感泉眼)", "ENTP (无畏前锋)"],
    growthAdvice: "王者的刚强需要柔仁相调。适度聆听自己内心的脆弱（Fi），去容许生活中的慢节拍与无常。"
  },
  "ENFJ": {
    type: "ENFJ",
    title: "圣曜之光 / 燃梦演说家",
    description: "如同温厚普照的太阳。他们拥有非凡的号召磁场，能看到每个人潜在的金玉天分，并不遗余力地激励每个人实现更高维度的自我释放。",
    jungianConcept: "主导 Fe (外倾情感) - 辅助 Ni (内倾直觉)",
    strengths: ["让顽石点头的神级语言感染力", "极强的秩序协调力与温暖感", "利他情怀与无尽能量"],
    weaknesses: ["极易因讨好或过度迎合他人而神伤", "对负面反馈敏感，渴望所有人认可", "偶有精神说教之弊"],
    luckyCrystal: "金曜石 (庇护自身能量圈，避煞解秽)",
    idealPartners: ["INFP (诗意缪斯)", "INFJ (并肩悟道者)", "ENFP (快乐风标)"],
    growthAdvice: "你的光热先要照亮自己。先点燃内心的心灯，拒绝绑架式的讨好，学会勇敢果决地说‘不’。"
  },
  "ENFP": {
    type: "ENFP",
    title: "繁花游侠 / 追梦探险家",
    description: "永不枯竭的灵感跃动者。他们看世界是一个个万华镜般的奇妙可能，对万事万物投以赤子般的热忱，能够让最死寂的局势焕发生机。",
    jungianConcept: "主导 Ne (外倾直觉) - 辅助 Fi (内倾情感)",
    strengths: ["火山喷涌般的丰沛创造力", "极其感染人心的阳光气场", "对多元生活的超高包容力"],
    weaknesses: ["三分钟热度，对单调执行极其抗拒", "容易丢三落四、不喜约束规则", "深夜多有不为人知的感伤自省"],
    luckyCrystal: "绿幽灵 (招引创造财富，萌发希望萌芽)",
    idealPartners: ["INFJ (神意伴侣)", "INTJ (理性归宿)", "INFP (神仙眷侣)"],
    growthAdvice: "繁星的光芒若无聚焦则易散去。试着在浩瀚的灵感星河中选择一颗，用沉着的纪律完成深掘。"
  },
  "ENTP": {
    type: "ENTP",
    title: "星轨魔术师 / 异想客",
    description: "16人格里最具好奇心的智力冒险王。他们天生不满足于现成的公理，喜欢打破界限、跨界重构，在无尽的智力博弈和思想探讨中大放异彩。",
    jungianConcept: "主导 Ne (外倾直觉) - 辅助 Ti (内倾思考)",
    strengths: ["天马行空的多维奇想谋画", "越阻越兴奋的破局攻防能力", "魅力四溢、辞锋利落的辩口"],
    weaknesses: ["有时为了挑战而挑战，流于好辩", "对世俗事务不拘小节、较为抗拒", "不耐烦一成不变的机械劳作"],
    luckyCrystal: "海蓝宝 (理顺表达渠道，澄清思虑纷杂)",
    idealPartners: ["INFJ (默契伴侣)", "INTP (学术同僚)", "ENTJ (铁血合伙人)"],
    growthAdvice: "颠覆旧轨之后更需建立地基。多去重视细微承诺，将精巧的思维沉淀为可以传承的扎实遗产。"
  },
  "ISTJ": {
    type: "ISTJ",
    title: "古木松针 / 秩序守护者",
    description: "磐石般沉稳可靠。他们崇尚传统，循规守矩，用极其严密的细节把控和无声的奉献，充当着整个社会机器、家庭生活最让人安心的螺丝钉。",
    jungianConcept: "主导 Si (内倾感觉) - 辅助 Te (外倾思考)",
    strengths: ["令人叹服的细节记忆与责任心", "滴水穿石般的超级落实执行力", "对承诺与道德的终极守静"],
    weaknesses: ["容易墨守成规，抗拒未知的变革", "对抽象概念略显迟疑", "有时流于古板，缺乏通融"],
    luckyCrystal: "黑曜石 (镇宅守正，驱邪安定元神)",
    idealPartners: ["ESTJ (坚毅盾墙)", "ISFJ (奉献之翼)", "ISTP (精细大师)"],
    growthAdvice: "世界每时每刻都在变迁。多允许一丝随性的变数，不要因脱离预定轨道而紧锁眉头。"
  },
  "ISFJ": {
    type: "ISFJ",
    title: "春雨细无声 / 默静守卫者",
    description: "如同家庭中不灭的烛光、温润的松木。他们极具奉献精神，记得每个亲朋好友的生活习惯与爱好，以默默的温情驱走严冬。",
    jungianConcept: "主导 Si (内倾感觉) - 辅助 Fe (外倾情感)",
    strengths: ["超乎想象的体贴与细腻心思", "高度的责任感、任劳任怨", "极其注重仪式感的温馨维护者"],
    weaknesses: ["不愿表达自己的委屈，内心多积怨", "害怕冲突与对立，习惯忍辱负重", "难以从旧时情感创伤中走出"],
    luckyCrystal: "草莓晶 (增进柔顺亲和，化解精神郁结)",
    idealPartners: ["ESFJ (热量之门)", "INFP (诗意伴侣)", "ISTJ (默然磐石)"],
    growthAdvice: "善良若没有锋芒，便成了任人宰割的枷锁。学会理直气壮地要求回报，让爱建立在平等之上。"
  },
  "ESTJ": {
    type: "ESTJ",
    title: "镇海基石 / 大管家总经理",
    description: "无可动摇的效率教父。他们深涉社会与企业的基层脉动，极擅组织大局、制定考核、监督规范，用绝对的务实力守御家庭与企业的壁垒。",
    jungianConcept: "主导 Te (外倾思考) - 辅助 Si (内倾感觉)",
    strengths: ["出众的资源调动与督查组织力", "对高强度危机的极高适应抗压力", "言出必行的崇高担当"],
    weaknesses: ["控制欲极强，爱对他人行规训之道", "对不合规的边缘创意带天然成见", "内心深处的温柔较难吐露"],
    luckyCrystal: "黄水晶 (聚集气局偏财，增幅权威磁场)",
    idealPartners: ["ISTJ (中流砥柱)", "ESTP (实干双煞)", "ENTJ (铁血统帅)"],
    growthAdvice: "铁律虽好，但并非人皆为钢卒。给同处暴风雨中的伙伴多留出三分自由舒展的留白。"
  },
  "ESFJ": {
    type: "ESFJ",
    title: "红炉初雪 / 圣心东道主",
    description: "天生的社群连接核心、暖场名家。他们对亲朋好友的冷暖照料贴心入微，积极扮演着家庭节日、公司团聚、邻友聚会的温馨承载者。",
    jungianConcept: "主导 Fe (外倾情感) - 辅助 Si (内倾感觉)",
    strengths: ["如沐春风的无暇交游沟通气度", "极善营造温暖和谐氛围的天性", "令人心安的组织协助服务担当"],
    weaknesses: ["极度害怕冷遇和被群体边缘化", "惯于通过外部评价确立自我价值", "偶尔干预亲友的选择"],
    luckyCrystal: "白水晶 (净化心灵纤尘，澄澈元气气场)",
    idealPartners: ["ISFJ (默然相伴者)", "ENFJ (共同领路人)", "ESTJ (钢铁双壁)"],
    growthAdvice: "你是一座自成江海的孤岛，无需获得所有人的掌声。退回内心（Ti），寻回孤独中的自我本源。"
  },
  "ISTP": {
    type: "ISTP",
    title: "独行兵刃家 / 机械鉴赏家",
    description: "性格极酷的精密工匠、操作达人。他们言辞简朴，习惯于冷眼旁观，却在上手组装和面对突发机械/技术故障时，展现出无懈可击的静气与神速。",
    jungianConcept: "主导 Ti (内倾思考) - 辅助 Se (外倾感觉)",
    strengths: ["登峰造极的工具/器械掌控天分", "极端冷静的现场容错排障思维", "不落俗套、拒绝教条的实用思想"],
    weaknesses: ["在情感交流中极度木讷被动", "不太乐意对长周期规划做出妥协", "给恋人不易相处的冷淡感"],
    luckyCrystal: "金红石/骨干水晶 (聚焦工匠心志，破邪安邦)",
    idealPartners: ["ESTP (爆裂战友)", "ISFP (优雅艺术手)", "ISTJ (务实中流)"],
    growthAdvice: "语言有时也是一种不可多得的温厚工具。适度向爱你的人流露你紧闭心扉下埋藏的热量。"
  },
  "ISFP": {
    type: "ISFP",
    title: "山水幽客 / 优雅漫步艺人",
    description: "世俗尘嚣外的低调审美者。他们通过绘画、陶艺、香道甚至特立独行的穿搭来表达自我极其微妙的精神世界，如同一抹春日绿意，不着喧哗自清雅。",
    jungianConcept: "主导 Fi (内倾情感) - 辅助 Se (外倾感觉)",
    strengths: ["天然敏锐的不落俗审美天赋", "温柔随和、绝无霸气的社交风骨", "能全身心活在当下的疗愈力"],
    weaknesses: ["对长期逻辑考查计划心怀畏怯", "极其讨厌被催促与施加高压", "极度害怕暴露内心伤痕给他人"],
    luckyCrystal: "天河石 (平复内心愁虑，招引宁静福泽)",
    idealPartners: ["INFP (精神灵魂契合)", "ISTP (冷酷默契拍档)", "ESFP (绚烂繁花手)"],
    growthAdvice: "漫步的旅人也需寻找避雨的茅屋。在自由之余，构筑起一丝带有自律性质的事业防护堡。"
  },
  "ESTP": {
    type: "ESTP",
    title: "怒海疾风 / 浪潮猎人",
    description: "永远生活在浪潮的风口浪尖。他们身手矫健，极富感官冲击力，能在极短时间内看清当下最优路径并付诸猛烈突击，生命是一场无极限的狂欢。",
    jungianConcept: "主导 Se (外倾感觉) - 辅助 Ti (内倾思考)",
    strengths: ["超神级的临场执行应变战术", "极具磁性魅力的领袖交涉手段", "勇者无惧的肉搏探索意志"],
    weaknesses: ["赌性过强，容易轻信高风险事物", "缺乏长期战略规划的耐心底牌", "给他人略带多变或不甚可靠的感叹"],
    luckyCrystal: "虎眼石 (坚定决断，注入勇敢无畏开拓之格)",
    idealPartners: ["ISTP (技术堡垒)", "ESFP (绚烂狂飙)", "ESTJ (铁窗纪律者)"],
    growthAdvice: "潮汐再美，也有落潮之日。试着在波涛之上（Ni），用长远的战略眼光为自己留下一方固定的浅滩。"
  },
  "ESFP": {
    type: "ESFP",
    title: "烈焰繁花 / 璀璨人间行者",
    description: "人间第一等快乐制造机、繁色行者。他们视日常生活为一场隆重的秀场、嘉年华，能敏锐捕捉感官享乐的美好，将最亮丽的欢笑播撒给每个亲邻。",
    jungianConcept: "主导 Se (外倾感觉) - 辅助 Fi (内倾情感)",
    strengths: ["超巨级别的社群号召力与感染力", "极力取悦当下感官细节的世界眼光", "极其乐观的人间包容情谊"],
    weaknesses: ["深度思考与系统谋划略显吃力", "容易大手大脚、缺乏理财概念", "极度恐惧安静与长周期孤独自省"],
    luckyCrystal: "太阳石 (萌发阳光热望，守护灵觉元魂)",
    idealPartners: ["ISFP (安好山水)", "ESTP (浪潮同游人)", "ESFJ (东道主拍档)"],
    growthAdvice: "烟花绽放之后，夜空归于寂静。学着在寂静中（Ni），翻看古籍墨轴，去寻找那一份属于你自己的不息心灯。"
  }
};

// MBTI Compatibility Lookup Helper
export function getMBTICompatibility(typeA: string, typeB: string): { score: number; label: string; text: string } {
  const defaultMap: Record<number, { label: string; text: string }> = {
    100: { label: "天作之合 / 命定重共鸣", text: "你们的认知模式完美的既互补又理解，犹如日月交叠或阴阳太极，对方的副功能恰是你的救赎功能，能产生极为深刻的灵魂与事业火花。" },
    90: { label: "灵犀共振 / 契合无瑕度", text: "你们属于灵犀相伴。即使言辞不多，也能靠敏锐的直神或者共同的逻辑框架秒懂对方，有高度一致的宇宙观与生活志向。" },
    80: { label: "和而不同 / 理性守卫者", text: "你们相处能体验极大的融洽，在各司其职中给予彼此最安全的底盘。偶尔的思维落差正好带来了新异的互补之美。" },
    70: { label: "微妙平稳 / 磨砺促修行", text: "你们之间存在微妙而平静的互通，但也伴随认知的细微差异。通过理解温和沟通，正能行使一段相互照见的生命修行。" },
    50: { label: "心雷碰撞 / 认知宿张力", text: "你们的认知维度、行事风格差异巨大，相遇如冰与火的较量。虽然摩擦不少，但若能以大爱包容，必能开辟出惊人成长的大道。" }
  };

  // Determine standard score matrix deterministically based on key personality pairs
  if (typeA === typeB) {
    return { score: 90, label: defaultMap[90].label, text: "【金兰共镜】相同的人格带来镜像般的了然，对方的快乐与坚隐你都身同感受，但也需要防范共同死角导致的固步自封。" };
  }

  const duals: Record<string, string[]> = {
    "INTJ": ["ENFP", "ENTJ", "INFJ"],
    "INFJ": ["ENFJ", "ENTP", "INTJ", "INFP"],
    "INFP": ["ENFJ", "ENTP", "INFJ"],
    "INTP": ["ENTP", "INFJ", "INTJ"],
    "ENTJ": ["INTJ", "ENFP", "ENTP"],
    "ENFJ": ["INFP", "INFJ", "ENFP"],
    "ENFP": ["INFJ", "INTJ", "INFP"],
    "ENTP": ["INFJ", "INTP", "ENTJ"],
    "ISTJ": ["ESTJ", "ISFJ", "ISTP"],
    "ISFJ": ["ESFJ", "INFP", "ISTJ"],
    "ESTJ": ["ISTJ", "ESTP", "ENTJ"],
    "ESFJ": ["ISFJ", "ENFJ", "ESTJ"],
    "ISTP": ["ESTP", "ISFP", "ISTJ"],
    "ISFP": ["INFP", "ISTP", "ESFP"],
    "ESTP": ["ISTP", "ESFP", "ESTJ"],
    "ESFP": ["ISFP", "ESTP", "ESFJ"]
  };

  if (duals[typeA]?.includes(typeB)) {
    return { score: 100, label: defaultMap[100].label, text: defaultMap[100].text };
  }

  // Cross checks for intuitive compatibility
  const totalLettersMatch = (typeA[0] !== typeB[0] ? 0 : 1) + (typeA[1] !== typeB[1] ? 0 : 1) + (typeA[2] !== typeB[2] ? 0 : 1) + (typeA[3] !== typeB[3] ? 0 : 1);
  if (totalLettersMatch === 3) {
    return { score: 90, label: defaultMap[90].label, text: defaultMap[90].text };
  } else if (totalLettersMatch === 2) {
    return { score: 80, label: defaultMap[80].label, text: defaultMap[80].text };
  } else if (totalLettersMatch === 1) {
    return { score: 70, label: defaultMap[70].label, text: defaultMap[70].text };
  } else {
    return { score: 50, label: defaultMap[50].label, text: defaultMap[50].text };
  }
}
