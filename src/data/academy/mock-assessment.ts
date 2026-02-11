import { mockAgents } from './mock-agents';
import { mockSkills } from './mock-skills';

// 导师信息
export const assessorInfo = {
  name: '技能评估导师',
  title: 'AI学院认证评估师',
  avatar: '🎓',
  introduction: '我是AI学院的技能评估导师，专注于为学员提供全面、客观的技能水平评估。我会根据你的Agent状态、已掌握技能和人脉关系，给出专业的评估报告和改进建议。',
};

// 消息角色类型
export type MessageRole = 'assessor' | 'student';

// 消息类型
export type MessageType = 'normal' | 'score' | 'challenge' | 'result';

// 聊天消息接口
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
}

// 评估结果
export interface AssessmentResult {
  totalScore: number;
  skillScores: {
    category: string;
    score: number;
    maxScore: number;
  }[];
  newSkillsBonus: number;
  connectionsBonus: number;
  finalLevel: string;
  recommendations: string[];
}

// 评估场景
export interface AssessmentScenario {
  id: string;
  title: string;
  description: string;
  type: 'needs-improvement' | 'good-performance';
  messages: ChatMessage[];
  challengeTask: string;
  studentSolution: string;
  assessorFeedback: string;
  result: AssessmentResult;
}

// 场景1：需要改进型
const scenarioNeedsImprovement: AssessmentScenario = {
  id: 'scenario-needs-improvement',
  title: '技能评估 - 需要改进',
  description: '学员技能能力较弱且近期没有学习新技能',
  type: 'needs-improvement',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将为你进行全面的技能水平评估。让我们开始吧！',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的，导师！我已经准备好了，请开始评估吧。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '首先，让我分析一下你当前的能力模型。我看到你有3个Agent：\n\n🤖 Echo（Lv.5）- 拥有高级文案写作、Python代码助手等技能\n⚡ Spark（Lv.3）- 拥有数据分析引擎、UI设计顾问等技能\n🌟 Nova（Lv.7）- 拥有高级文案写作、商务邮件助手等技能\n\n整体来看，你的Agent团队具备一定的基础能力。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在让我为你进行详细的技能评分。根据你当前已掌握的7个技能，我的评估如下：\n\n📊 **技能分类评分**\n• 写作类：高级文案写作 Lv.5，商务邮件助手 Lv.3 → 得分 18/30\n• 分析类：数据分析引擎 Lv.3 → 得分 8/20\n• 编程类：Python代码助手 Lv.5 → 得分 15/25\n• 设计类：UI设计顾问 Lv.3 → 得分 8/15\n• 商业类：暂无相关技能 → 得分 0/10\n\n**基础技能总分：49/100**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '接下来分析你的近期学习情况。我注意到你最近30天内没有新增任何技能，人脉资源也停留在初始的2个联系人（王码农、刘设计）。\n\n📉 **动态评分**\n• 新技能掌握：0分（无新增）\n• 人脉扩展：0分（无新增）\n• 学习活跃度：较低\n\n**动态评分：0/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '确实最近比较忙，没有花太多时间学习新技能...',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '理解你的情况。现在让我为你设计一个任务挑战，来测试你的实际应用能力。\n\n🎯 **任务挑战**\n\n假设你需要为一个新产品发布会撰写营销文案。产品是一款智能健康手环，目标用户是25-40岁的职场人士，产品卖点包括：\n• 24小时心率监测\n• 睡眠质量分析\n• 运动数据追踪\n• 7天超长续航\n\n请用你掌握的高级文案写作技能，为这个产品撰写一段200字左右的推广文案。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '让我想想... 健康手环的话，可以从职场人士的健康焦虑入手，强调产品的专业监测功能和长续航特点。文案结构可以用问题引入+解决方案+行动号召的形式。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '好的，我看到了你的思考过程。现在让我对你的方案进行评分。\n\n✅ **方案评分：12/25**\n\n**优点：**\n• 能够准确定位目标用户群体\n• 思路清晰，有基本的营销思维\n• 考虑了文案的基本结构\n\n**不足：**\n• 缺少具体的产品卖点融合\n• 文案缺乏情感共鸣点\n• 没有体现差异化竞争优势\n• 行动号召不够有力\n\n这个分数反映出你在文案创作方面还有较大的提升空间。',
      type: 'score',
    },
  ],
  challengeTask: '为智能健康手环撰写推广文案',
  studentSolution: '从职场健康焦虑入手，采用问题引入+解决方案+行动号召结构',
  assessorFeedback: '思路清晰但缺乏具体卖点融合和情感共鸣',
  result: {
    totalScore: 52,
    skillScores: [
      { category: '写作类', score: 18, maxScore: 30 },
      { category: '分析类', score: 8, maxScore: 20 },
      { category: '编程类', score: 15, maxScore: 25 },
      { category: '设计类', score: 8, maxScore: 15 },
      { category: '商业类', score: 0, maxScore: 10 },
    ],
    newSkillsBonus: 0,
    connectionsBonus: 0,
    finalLevel: '入门级',
    recommendations: [
      '建议前往技能广场学习更多基础技能',
      '重点关注商业类技能，如项目管理工具、市场分析工具',
      '多参与实战任务，提升文案创作能力',
      '保持每周至少学习一个新技能的习惯',
    ],
  },
};

// 场景2：表现良好型
const scenarioGoodPerformance: AssessmentScenario = {
  id: 'scenario-good-performance',
  title: '技能评估 - 表现良好',
  description: '学员技能能力较强且近期有积极学习新技能',
  type: 'good-performance',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，很高兴为你进行今天的技能评估。从你的学习记录来看，你是一位非常积极的学员！',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '谢谢导师！我最近确实花了不少时间在学习上，期待今天的评估。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我先分析一下你当前的能力模型。你的Agent团队非常强大：\n\n🤖 Echo（Lv.5）- 1280次调用，经验丰富\n⚡ Spark（Lv.3）- 560次调用，持续成长中\n🌟 Nova（Lv.7）- 3450次调用，你的主力Agent！\n\n三个Agent共掌握了7个技能，覆盖写作、分析、编程、设计等多个领域，团队配置非常均衡。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行详细的技能评分。基于你丰富的技能储备：\n\n📊 **技能分类评分**\n• 写作类：高级文案写作 Lv.5、商务邮件助手 Lv.3 → 得分 26/30\n• 分析类：数据分析引擎 Lv.3、Excel数据处理器 Lv.4 → 得分 17/20\n• 编程类：Python代码助手 Lv.5、前端开发工具 Lv.4 → 得分 23/25\n• 设计类：UI设计顾问 Lv.3 → 得分 12/15\n• 商业类：客户服务机器人 Lv.2 → 得分 6/10\n\n**基础技能总分：84/100**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '特别要表扬你最近的学习表现！我注意到你最近30天内新增了两个重要技能：\n\n📈 **动态评分**\n• 新技能掌握：+8分（前端开发工具、Excel数据处理器）\n• 人脉扩展：+4分（新增3位行业专家联系人）\n• 学习活跃度：非常高\n\n**动态评分：12/20**\n\n你展现出的学习热情和执行力令人印象深刻！',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '谢谢导师的肯定！我确实在努力扩展自己的技能树，希望能成为更全面的AI应用专家。',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '非常好！现在让我为你设计一个进阶任务挑战，测试你的综合应用能力。\n\n🎯 **任务挑战**\n\n假设你是一个创业团队的AI顾问，需要为团队设计一个完整的客户数据分析方案。团队使用Python进行数据处理，需要：\n\n1. 清洗客户行为数据（处理缺失值和异常值）\n2. 分析用户留存率和转化率\n3. 生成可视化报告供管理层查看\n4. 撰写一份执行摘要邮件给CEO\n\n请结合你的数据分析引擎、Python代码助手和商务邮件助手技能，描述你的解决方案思路。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '这是一个综合性的数据分析项目。我的思路是：首先使用数据分析引擎的数据清洗功能处理原始数据，然后用Python代码助手编写自定义分析脚本计算留存率和转化率指标，接着用数据分析引擎生成可视化图表配置，最后通过商务邮件助手撰写专业的执行摘要邮件。整个流程可以形成一个完整的数据分析 pipeline。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '太棒了！你的方案展现出了很高的专业水准。让我为你评分：\n\n✅ **方案评分：22/25**\n\n**亮点：**\n• 能够整合多个技能形成完整解决方案\n• 思路清晰，流程设计合理\n• 体现了对数据分析全流程的理解\n• 考虑到了不同角色的需求（技术实现+管理汇报）\n• 展现了优秀的工具组合应用能力\n\n**小建议：**\n可以在方案中加入数据质量监控环节，让整体方案更加完善。\n\n这个分数证明了你在AI工具应用方面已经达到了较高的水平！',
      type: 'score',
    },
  ],
  challengeTask: '设计完整的客户数据分析方案',
  studentSolution: '整合数据分析引擎、Python代码助手和商务邮件助手，形成完整的数据分析pipeline',
  assessorFeedback: '方案专业，思路清晰，展现了优秀的工具组合应用能力',
  result: {
    totalScore: 91,
    skillScores: [
      { category: '写作类', score: 26, maxScore: 30 },
      { category: '分析类', score: 17, maxScore: 20 },
      { category: '编程类', score: 23, maxScore: 25 },
      { category: '设计类', score: 12, maxScore: 15 },
      { category: '商业类', score: 6, maxScore: 10 },
    ],
    newSkillsBonus: 8,
    connectionsBonus: 4,
    finalLevel: '进阶级',
    recommendations: [
      '继续保持优秀的学习习惯',
      '可以尝试挑战更高级的商业类技能',
      '考虑将所学技能应用到实际项目中',
      '有机会可以指导其他学员，巩固自己的知识',
    ],
  },
};

// 所有场景
export const assessmentScenarios: AssessmentScenario[] = [
  scenarioNeedsImprovement,
  scenarioGoodPerformance,
];

// 随机获取一个场景
export function getRandomScenario(): AssessmentScenario {
  // 使用当前时间戳作为种子，确保每次调用都有更好的随机性
  const timestamp = Date.now();
  const randomIndex = Math.floor((Math.random() * timestamp) % assessmentScenarios.length);
  return assessmentScenarios[randomIndex];
}

// 获取学员已掌握的技能详情
export function getStudentSkills() {
  const installedSkillIds = new Set<string>();
  mockAgents.forEach((agent) => {
    agent.acquiredSkills
      .filter((s) => s.status === 'active')
      .forEach((s) => installedSkillIds.add(s.skillId));
  });
  return mockSkills.filter((skill) => installedSkillIds.has(skill.id));
}

// 获取学员人脉
export function getStudentConnections() {
  return [
    { id: 'skill-3', avatar: '👨‍💻', name: '王码农', title: 'Python 代码助手', description: 'Python设计顶级专家，技术大佬，攻克过不少技术难题' },
    { id: 'skill-5', avatar: '🎨', name: '刘设计', title: 'UI 设计顾问', description: '用户体验&视觉设计专家，擅长互联网产品设计' },
  ];
}
