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

// 场景3：编程技能专项评估
const scenarioProgramming: AssessmentScenario = {
  id: 'scenario-programming',
  title: '编程技能专项评估',
  description: '针对学员编程能力的专项评估',
  type: 'good-performance',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的编程技能进行专项评估。让我们开始吧！',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我主要从事Python开发工作，期待今天的评估。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '很好！让我先分析一下你当前的编程能力模型。我看到你有3个Agent，其中：\n\n🤖 Echo（Lv.5）- 拥有Python代码助手、项目管理工具\n⚡ Spark（Lv.3）- 拥有数据分析引擎\n🌟 Nova（Lv.7）- 拥有前端开发工具、SQL查询助手\n\n你的Agent团队在编程领域有较强的配置，特别是Python和前端开发技能。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行编程技能专项评分：\n\n📊 **编程技能评分**\n• Python编程：代码生成、调试优化、代码审查 → 得分 23/25\n• 前端开发：React组件、TypeScript、API客户端 → 得分 20/25\n• 数据库：SQL查询、数据库设计 → 得分 18/20\n• 数据分析：数据清洗、统计分析 → 得分 15/15\n• 工程实践：项目管理、版本控制 → 得分 12/15\n\n**编程技能总分：88/100**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，你最近30天内新增了前端开发工具和SQL查询助手两个技能，编程能力有明显提升！\n\n📈 **动态评分**\n• 新技能掌握：+8分（前端开发工具、SQL查询助手）\n• 代码质量提升：+3分\n• 学习活跃度：高\n\n**动态评分：11/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '谢谢导师！我确实在努力扩展技术栈，最近在学习全栈开发。',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '非常好！现在让我为你设计一个编程任务挑战。\n\n🎯 **任务挑战**\n\n请设计一个Python脚本，实现以下功能：\n1. 从CSV文件读取销售数据\n2. 按月份统计销售额\n3. 找出销售额最高的前3个产品\n4. 生成可视化图表\n5. 将结果保存为新的CSV文件\n\n请描述你的解决方案思路。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '我会使用pandas读取CSV数据，用groupby按月份聚合销售额，然后用nlargest找出Top 3产品，使用matplotlib生成柱状图和折线图，最后用to_csv保存结果。整个流程可以用一个函数封装，增加异常处理确保健壮性。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '优秀的方案！让我为你评分：\n\n✅ **方案评分：23/25**\n\n**亮点：**\n• 技术选型合理，使用pandas和matplotlib\n• 思路清晰，涵盖完整的数据处理流程\n• 考虑了异常处理，体现工程思维\n• 封装成函数，代码可复用性好\n\n**小建议：**\n可以考虑添加日志记录功能，便于生产环境调试。\n\n你的编程能力已经达到较高水平！',
      type: 'score',
    },
  ],
  challengeTask: '设计Python数据处理脚本',
  studentSolution: '使用pandas进行数据处理，matplotlib可视化，完整的数据分析pipeline',
  assessorFeedback: '技术选型合理，思路清晰，体现良好的工程思维',
  result: {
    totalScore: 93,
    skillScores: [
      { category: 'Python编程', score: 23, maxScore: 25 },
      { category: '前端开发', score: 20, maxScore: 25 },
      { category: '数据库', score: 18, maxScore: 20 },
      { category: '数据分析', score: 15, maxScore: 15 },
      { category: '工程实践', score: 12, maxScore: 15 },
    ],
    newSkillsBonus: 8,
    connectionsBonus: 3,
    finalLevel: '编程专家',
    recommendations: [
      '继续深入学习系统架构设计',
      '尝试学习云原生和DevOps技术',
      '参与开源项目贡献',
      '考虑学习一门新的编程语言如Go或Rust',
    ],
  },
};

// 场景4：设计能力专项评估
const scenarioDesign: AssessmentScenario = {
  id: 'scenario-design',
  title: '设计能力专项评估',
  description: '针对学员设计能力的专项评估',
  type: 'needs-improvement',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的设计能力进行专项评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我对UI设计比较感兴趣，但经验不多。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我分析一下你当前的设计能力。我看到你的Agent团队中：\n\n⚡ Spark（Lv.3）- 拥有UI设计顾问\n\n目前只配置了一个设计相关技能，设计能力还有很大的提升空间。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行设计能力专项评分：\n\n📊 **设计能力评分**\n• UI设计：界面布局、组件设计 → 得分 10/25\n• 视觉设计：配色、字体、图标 → 得分 8/20\n• 用户体验：交互设计、用户流程 → 得分 6/20\n• 设计系统：规范制定、组件库 → 得分 3/15\n• 设计工具：Figma、Sketch等 → 得分 5/10\n\n**设计能力总分：32/90**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，最近30天内没有新增设计相关技能，设计学习需要加强。\n\n📉 **动态评分**\n• 新技能掌握：0分\n• 设计实践：0分\n• 学习活跃度：低\n\n**动态评分：0/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '确实，我之前主要关注编程，设计方面投入比较少...',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '理解！让我为你设计一个设计任务挑战，测试你的设计思维。\n\n🎯 **任务挑战**\n\n请为一款健康管理App设计一个首页界面。目标用户是25-40岁的上班族，需要展示：\n• 今日步数和目标完成度\n• 心率数据图表\n• 睡眠时长和质量\n• 快速开始运动的入口\n\n请描述你的设计思路。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '我会采用卡片式布局，顶部显示用户头像和问候语，中间用环形进度条展示步数完成情况，下方用网格布局展示心率和睡眠数据，底部放置一个明显的开始运动按钮。配色可以用绿色系，给人健康活力的感觉。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '让我为你评分：\n\n✅ **方案评分：14/25**\n\n**优点：**\n• 布局思路清晰，采用卡片式设计\n• 考虑了数据可视化展示\n• 有基本的配色意识\n\n**不足：**\n• 缺少交互流程考虑\n• 信息层级不够清晰\n• 没有考虑不同屏幕尺寸适配\n• 缺少用户引导设计\n\n建议系统学习UI设计课程，提升设计思维。',
      type: 'score',
    },
  ],
  challengeTask: '设计健康管理App首页',
  studentSolution: '卡片式布局，环形进度条，绿色配色方案',
  assessorFeedback: '有基本设计意识，但需要系统学习设计方法论',
  result: {
    totalScore: 38,
    skillScores: [
      { category: 'UI设计', score: 10, maxScore: 25 },
      { category: '视觉设计', score: 8, maxScore: 20 },
      { category: '用户体验', score: 6, maxScore: 20 },
      { category: '设计系统', score: 3, maxScore: 15 },
      { category: '设计工具', score: 5, maxScore: 10 },
    ],
    newSkillsBonus: 0,
    connectionsBonus: 0,
    finalLevel: '设计初学者',
    recommendations: [
      '系统学习UI/UX设计基础课程',
      '掌握Figma等主流设计工具',
      '多分析优秀App的设计案例',
      '学习设计系统和组件化思维',
    ],
  },
};

// 场景5：数据分析能力评估
const scenarioDataAnalysis: AssessmentScenario = {
  id: 'scenario-data-analysis',
  title: '数据分析能力评估',
  description: '针对学员数据分析能力的专项评估',
  type: 'good-performance',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的数据分析能力进行专项评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我目前从事数据分析工作，期待评估。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我分析你的数据分析能力配置。我看到你的Agent团队中：\n\n⚡ Spark（Lv.3）- 拥有数据分析引擎、Excel数据处理器\n🌟 Nova（Lv.7）- 拥有SQL查询助手\n\n你的数据分析技能配置较为完善，覆盖了数据处理的主要环节。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行数据分析能力专项评分：\n\n📊 **数据分析能力评分**\n• 数据处理：清洗、转换、整合 → 得分 22/25\n• 统计分析：描述统计、推断统计 → 得分 20/25\n• 数据可视化：图表选择、可视化设计 → 得分 18/20\n• SQL查询：复杂查询、性能优化 → 得分 17/20\n• 商业洞察：数据解读、决策支持 → 得分 14/15\n\n**数据分析总分：91/105**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，你最近新增了Excel数据处理器技能，数据分析工具链更加完善。\n\n📈 **动态评分**\n• 新技能掌握：+5分（Excel数据处理器）\n• 分析效率提升：+3分\n• 学习活跃度：高\n\n**动态评分：8/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '谢谢导师！我一直在努力提升数据分析能力，希望成为更专业的数据分析师。',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '非常好！现在让我为你设计一个数据分析任务挑战。\n\n🎯 **任务挑战**\n\n假设你是一家电商公司的数据分析师，需要分析以下问题：\n1. 最近6个月的销售趋势如何？\n2. 哪些产品类别贡献最大？\n3. 用户购买行为有什么规律？\n4. 如何预测下个月的销售额？\n\n请描述你的分析思路和方法。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '我会首先用时间序列分析销售趋势，识别季节性模式；然后用帕累托分析找出核心产品类别；通过RFM模型分析用户价值分层；最后用ARIMA或移动平均法进行销售预测。整个分析过程会用可视化图表展示关键发现，并给出可执行的业务建议。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '非常专业的分析方案！让我为你评分：\n\n✅ **方案评分：24/25**\n\n**亮点：**\n• 分析方法全面，涵盖描述性和预测性分析\n• 使用了RFM等经典模型，体现专业水平\n• 考虑了业务应用，不只是技术分析\n• 可视化展示思路清晰\n\n**小建议：**\n可以考虑加入A/B测试设计，验证业务改进效果。\n\n你的数据分析能力已经达到专家水平！',
      type: 'score',
    },
  ],
  challengeTask: '电商销售数据分析',
  studentSolution: '时间序列分析、帕累托分析、RFM模型、ARIMA预测',
  assessorFeedback: '分析方法全面专业，体现高水平的数据分析能力',
  result: {
    totalScore: 95,
    skillScores: [
      { category: '数据处理', score: 22, maxScore: 25 },
      { category: '统计分析', score: 20, maxScore: 25 },
      { category: '数据可视化', score: 18, maxScore: 20 },
      { category: 'SQL查询', score: 17, maxScore: 20 },
      { category: '商业洞察', score: 14, maxScore: 15 },
    ],
    newSkillsBonus: 5,
    connectionsBonus: 3,
    finalLevel: '数据分析专家',
    recommendations: [
      '学习机器学习算法，向数据科学方向发展',
      '掌握大数据处理工具如Spark',
      '学习数据仓库和ETL设计',
      '考虑获取相关职业认证',
    ],
  },
};

// 场景6：商业思维评估
const scenarioBusiness: AssessmentScenario = {
  id: 'scenario-business',
  title: '商业思维评估',
  description: '针对学员商业思维能力的专项评估',
  type: 'needs-improvement',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的商业思维能力进行评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我是技术背景，对商业方面了解不多。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我分析你的商业能力配置。我看到你的Agent团队中：\n\n🤖 Echo（Lv.5）- 拥有项目管理工具\n⚡ Spark（Lv.3）- 拥有客户服务机器人\n\n商业相关技能较少，主要集中在项目管理和基础客服方面。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行商业思维专项评分：\n\n📊 **商业能力评分**\n• 市场分析：竞品分析、市场趋势 → 得分 8/25\n• 商业模式：盈利模式、价值主张 → 得分 6/20\n• 财务基础：成本分析、预算管理 → 得分 5/20\n• 战略规划：目标设定、路径规划 → 得分 7/20\n• 商业沟通：汇报、谈判、演讲 → 得分 6/15\n\n**商业能力总分：32/100**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，最近30天内没有新增商业相关技能，商业学习需要加强。\n\n📉 **动态评分**\n• 新技能掌握：0分\n• 商业实践：0分\n• 学习活跃度：低\n\n**动态评分：0/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '确实，我一直专注于技术，商业方面确实比较薄弱...',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '理解！技术背景转商业需要系统学习。让我为你设计一个商业思维挑战。\n\n🎯 **任务挑战**\n\n假设你开发了一款新的任务管理App，请回答以下问题：\n1. 你的目标用户是谁？\n2. 你的产品核心差异化是什么？\n3. 你计划如何盈利？\n4. 如何获取第一批用户？\n\n请简要阐述你的商业思路。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '目标用户可能是职场人士和小团队。产品特点是AI智能任务优先级排序。盈利模式可以考虑免费基础版+付费高级版。获取用户可以通过应用商店优化和技术社区推广。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '让我为你评分：\n\n✅ **方案评分：12/25**\n\n**优点：**\n• 有基本的用户定位意识\n• 想到了差异化功能（AI优先级）\n• 了解常见的盈利模式\n\n**不足：**\n• 用户画像不够精准\n• 缺乏竞品分析和市场验证\n• 没有考虑获客成本和用户生命周期价值\n• 缺少具体的执行计划\n\n建议系统学习商业分析课程，培养商业思维。',
      type: 'score',
    },
  ],
  challengeTask: '任务管理App商业规划',
  studentSolution: '定位职场人士，AI差异化功能，免费+付费模式',
  assessorFeedback: '有基本商业意识，但需要系统学习商业方法论',
  result: {
    totalScore: 36,
    skillScores: [
      { category: '市场分析', score: 8, maxScore: 25 },
      { category: '商业模式', score: 6, maxScore: 20 },
      { category: '财务基础', score: 5, maxScore: 20 },
      { category: '战略规划', score: 7, maxScore: 20 },
      { category: '商业沟通', score: 6, maxScore: 15 },
    ],
    newSkillsBonus: 0,
    connectionsBonus: 0,
    finalLevel: '商业初学者',
    recommendations: [
      '学习商业分析工具和市场研究方法',
      '阅读经典商业案例和商业模式书籍',
      '关注行业动态和商业趋势',
      '尝试参与商业项目或创业活动',
    ],
  },
};

// 场景7：项目管理能力评估
const scenarioProjectManagement: AssessmentScenario = {
  id: 'scenario-project-management',
  title: '项目管理能力评估',
  description: '针对学员项目管理能力的专项评估',
  type: 'good-performance',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的项目管理能力进行专项评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我有3年项目管理经验，期待今天的评估。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我分析你的项目管理能力配置。我看到你的Agent团队中：\n\n🤖 Echo（Lv.5）- 拥有项目管理工具、商务邮件助手\n🌟 Nova（Lv.7）- 拥有文档写作引擎\n\n你的项目管理工具配置较为完善，覆盖了项目沟通和文档管理。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行项目管理能力专项评分：\n\n📊 **项目管理能力评分**\n• 项目规划：WBS、进度安排、资源分配 → 得分 21/25\n• 风险管理：风险识别、应对策略 → 得分 19/25\n• 团队协作：沟通管理、冲突解决 → 得分 18/20\n• 敏捷实践：Scrum/Kanban、迭代管理 → 得分 16/20\n• 工具应用：项目管理软件、自动化 → 得分 13/15\n\n**项目管理总分：87/105**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，你最近持续使用项目管理工具，管理效率有明显提升。\n\n📈 **动态评分**\n• 工具熟练度提升：+4分\n• 团队满意度：+3分\n• 学习活跃度：高\n\n**动态评分：7/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '谢谢导师！我一直在实践敏捷方法，努力提升团队协作效率。',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '非常好！现在让我为你设计一个项目管理挑战。\n\n🎯 **任务挑战**\n\n假设你要负责一个为期3个月的软件开发项目，团队包括：\n• 2名前端工程师\n• 2名后端工程师\n• 1名测试工程师\n• 1名UI设计师\n\n项目需求在开发过程中可能变更，请描述你的项目管理方案。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '我会采用敏捷开发方法，将项目分为多个Sprint迭代。每个Sprint开始前进行需求评审和任务分解，每日站会同步进度，Sprint结束进行评审和回顾。针对需求变更，建立变更控制流程，评估影响后再决定是否纳入。使用项目管理工具跟踪任务状态，定期向 stakeholders 汇报进展。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '非常专业的项目管理方案！让我为你评分：\n\n✅ **方案评分：23/25**\n\n**亮点：**\n• 采用敏捷方法，适应需求变化\n• 完整的Sprint流程设计\n• 考虑了变更控制机制\n• 重视沟通和汇报\n• 工具应用思路清晰\n\n**小建议：**\n可以考虑加入风险预警机制，提前识别潜在问题。\n\n你的项目管理能力已经达到专家水平！',
      type: 'score',
    },
  ],
  challengeTask: '软件开发项目管理方案',
  studentSolution: '敏捷开发，多轮Sprint迭代，变更控制，工具跟踪',
  assessorFeedback: '方案专业完整，体现丰富的项目管理经验',
  result: {
    totalScore: 92,
    skillScores: [
      { category: '项目规划', score: 21, maxScore: 25 },
      { category: '风险管理', score: 19, maxScore: 25 },
      { category: '团队协作', score: 18, maxScore: 20 },
      { category: '敏捷实践', score: 16, maxScore: 20 },
      { category: '工具应用', score: 13, maxScore: 15 },
    ],
    newSkillsBonus: 4,
    connectionsBonus: 3,
    finalLevel: '项目管理专家',
    recommendations: [
      '考取PMP或ACP等专业认证',
      '学习高级风险管理技术',
      '掌握更多项目管理工具',
      '考虑向项目集管理方向发展',
    ],
  },
};

// 场景8：创意思维评估
const scenarioCreativity: AssessmentScenario = {
  id: 'scenario-creativity',
  title: '创意思维评估',
  description: '针对学员创意思维能力的专项评估',
  type: 'needs-improvement',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的创意思维能力进行评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我从事的是比较规范性的工作，对创意方面不太确定自己的水平。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我分析你的创意能力配置。我看到你的Agent团队中：\n\n⚡ Spark（Lv.3）- 拥有创意头脑风暴\n\n目前只有一个创意相关技能，创意思维能力还有提升空间。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行创意思维专项评分：\n\n📊 **创意思维评分**\n• 发散思维：头脑风暴、联想能力 → 得分 10/25\n• 问题解决：创新解法、突破常规 → 得分 8/20\n• 内容创作：文案、设计、表达 → 得分 9/20\n• 创新方法：SCAMPER、思维导图 → 得分 6/15\n• 跨界整合：跨领域应用 → 得分 5/10\n\n**创意思维总分：38/90**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，最近30天内没有新增创意相关技能，创意学习需要加强。\n\n📉 **动态评分**\n• 新技能掌握：0分\n• 创意实践：0分\n• 学习活跃度：低\n\n**动态评分：0/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '确实，我平时工作比较按部就班，很少有机会锻炼创意思维...',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '理解！创意能力是可以培养的。让我为你设计一个创意挑战。\n\n🎯 **任务挑战**\n\n请为传统咖啡店设计一个创新的服务模式，要求：\n1. 结合AI技术提升体验\n2. 区别于现有咖啡店的特色\n3. 具有可行性和商业价值\n\n请描述你的创意方案。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '可以做一个AI个性化推荐系统，根据顾客的口味偏好、天气、时间推荐不同的咖啡。还可以用AI分析顾客情绪，推荐适合当下心情的饮品。另外可以设置智能咖啡师机器人，与顾客互动聊天。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '让我为你评分：\n\n✅ **方案评分：13/25**\n\n**优点：**\n• 想到了AI个性化推荐，有创新意识\n• 考虑了情绪因素，体现用户思维\n• 有基本的可行性考虑\n\n**不足：**\n• 创意较为常规，类似方案已存在\n• 缺少差异化亮点\n• 没有考虑成本和技术实现难度\n• 商业模式不够清晰\n\n建议多学习创新方法论，培养创意思维习惯。',
      type: 'score',
    },
  ],
  challengeTask: 'AI咖啡店创新服务模式设计',
  studentSolution: 'AI个性化推荐、情绪分析、智能咖啡师机器人',
  assessorFeedback: '有创新意识，但需要更深入的创意挖掘',
  result: {
    totalScore: 42,
    skillScores: [
      { category: '发散思维', score: 10, maxScore: 25 },
      { category: '问题解决', score: 8, maxScore: 20 },
      { category: '内容创作', score: 9, maxScore: 20 },
      { category: '创新方法', score: 6, maxScore: 15 },
      { category: '跨界整合', score: 5, maxScore: 10 },
    ],
    newSkillsBonus: 0,
    connectionsBonus: 0,
    finalLevel: '创意探索者',
    recommendations: [
      '系统学习创新思维方法论',
      '多参与头脑风暴和创意工作坊',
      '培养跨领域知识整合能力',
      '关注创新案例和趋势',
    ],
  },
};

// 场景9：沟通协作能力评估
const scenarioCommunication: AssessmentScenario = {
  id: 'scenario-communication',
  title: '沟通协作能力评估',
  description: '针对学员沟通协作能力的专项评估',
  type: 'good-performance',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你的沟通协作能力进行专项评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我在团队中主要负责协调工作，期待评估。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我分析你的沟通协作能力配置。我看到你的Agent团队中：\n\n🤖 Echo（Lv.5）- 拥有商务邮件助手\n🌟 Nova（Lv.7）- 拥有客户服务机器人、商务邮件助手\n\n你的沟通工具配置较为完善，覆盖了商务沟通和客户服务场景。',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行沟通协作能力专项评分：\n\n📊 **沟通协作评分**\n• 书面沟通：邮件、报告、文档 → 得分 20/25\n• 口头表达：汇报、演讲、会议 → 得分 18/25\n• 团队协作：协调、冲突处理 → 得分 19/20\n• 客户服务：需求理解、问题解决 → 得分 17/20\n• 跨部门沟通：资源整合、推动执行 → 得分 14/15\n\n**沟通协作总分：88/105**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，你持续使用商务邮件助手，沟通效率有明显提升。\n\n📈 **动态评分**\n• 沟通效率提升：+4分\n• 团队协作满意度：+4分\n• 学习活跃度：高\n\n**动态评分：8/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '谢谢导师！我一直很重视团队协作，努力提升沟通效率。',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '非常好！现在让我为你设计一个沟通协作挑战。\n\n🎯 **任务挑战**\n\n假设你是一个跨部门项目的负责人，需要协调技术部、产品部和市场部共同完成一个紧急项目。但遇到了以下问题：\n1. 技术部认为需求不明确，拒绝开工\n2. 产品部和技术部对功能优先级有分歧\n3. 市场部要求提前上线，但技术部说时间不够\n\n请描述你的协调方案。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '我会先组织三方会议，让各部门充分表达诉求和顾虑。针对需求不明确，安排产品和技术的对接会议细化需求文档。对于优先级分歧，用MoSCoW法则梳理功能优先级，达成共识。关于时间冲突，评估最小可行版本（MVP），分阶段交付，先满足市场部的核心需求。同时建立每日同步机制，及时解决问题。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '非常出色的协调方案！让我为你评分：\n\n✅ **方案评分：24/25**\n\n**亮点：**\n• 重视沟通，先倾听各方诉求\n• 使用专业方法（MoSCoW）解决分歧\n• 提出MVP方案，平衡时间和需求\n• 建立持续沟通机制\n• 体现了很强的协调能力\n\n**小建议：**\n可以考虑提前识别风险，建立预警机制。\n\n你的沟通协作能力已经达到专家水平！',
      type: 'score',
    },
  ],
  challengeTask: '跨部门项目协调方案',
  studentSolution: '三方会议、MoSCoW优先级、MVP分阶段、每日同步',
  assessorFeedback: '方案专业全面，体现优秀的沟通协调能力',
  result: {
    totalScore: 94,
    skillScores: [
      { category: '书面沟通', score: 20, maxScore: 25 },
      { category: '口头表达', score: 18, maxScore: 25 },
      { category: '团队协作', score: 19, maxScore: 20 },
      { category: '客户服务', score: 17, maxScore: 20 },
      { category: '跨部门沟通', score: 14, maxScore: 15 },
    ],
    newSkillsBonus: 4,
    connectionsBonus: 4,
    finalLevel: '沟通协作专家',
    recommendations: [
      '学习高级谈判技巧',
      '提升公众演讲能力',
      '掌握更多冲突解决方法',
      '考虑向管理岗位发展',
    ],
  },
};

// 场景10：综合能力评估
const scenarioComprehensive: AssessmentScenario = {
  id: 'scenario-comprehensive',
  title: '综合能力评估',
  description: '对学员全方位能力的综合评估',
  type: 'good-performance',
  messages: [
    {
      id: 'msg-1',
      role: 'assessor',
      content: '你好！欢迎来到AI学院技能评估中心。我是你的评估导师，今天将对你进行全方位的能力综合评估。',
    },
    {
      id: 'msg-2',
      role: 'student',
      content: '好的导师！我很期待这次全面的评估，希望能了解自己的整体能力水平。',
    },
    {
      id: 'msg-3',
      role: 'assessor',
      content: '让我全面分析你的能力模型。我看到你拥有3个Agent，配置了10个技能，涵盖写作、分析、编程、设计、商业等多个领域。你的技能配置非常均衡，是一位全面发展的学员！',
      type: 'normal',
    },
    {
      id: 'msg-4',
      role: 'assessor',
      content: '现在进行综合能力全面评分：\n\n📊 **综合能力评分**\n• 技术能力：编程、数据分析、工具应用 → 得分 26/30\n• 创意能力：文案、设计、创新思维 → 得分 22/25\n• 商业能力：市场分析、项目管理 → 得分 20/25\n• 沟通能力：书面、口头、协作 → 得分 19/20\n• 学习能力：新技能掌握、知识更新 → 得分 14/15\n\n**综合能力总分：101/115**',
      type: 'score',
    },
    {
      id: 'msg-5',
      role: 'assessor',
      content: '分析你的近期学习情况，你最近30天内新增了3个技能，学习热情高涨，能力提升显著！\n\n📈 **动态评分**\n• 新技能掌握：+10分（前端开发工具、Excel数据处理器、SEO优化工具）\n• 综合应用能力：+4分\n• 学习活跃度：非常高\n\n**动态评分：14/20**',
      type: 'score',
    },
    {
      id: 'msg-6',
      role: 'student',
      content: '谢谢导师！我一直在努力成为全能型人才，希望能够在多个领域都有所建树。',
    },
    {
      id: 'msg-7',
      role: 'assessor',
      content: '非常 admirable！现在让我为你设计一个综合能力挑战。\n\n🎯 **任务挑战**\n\n假设你要独立负责一个新产品从0到1的完整项目，包括：\n1. 市场调研和竞品分析\n2. 产品功能规划和原型设计\n3. 技术方案选型（前端+后端）\n4. 项目计划和团队协调\n5. 上线后的数据分析和优化\n\n请概述你的整体方案。',
      type: 'challenge',
    },
    {
      id: 'msg-8',
      role: 'student',
      content: '我会先用市场分析工具调研目标用户和竞品，确定差异化定位。然后设计MVP功能，用UI设计工具制作原型。技术选型选择React+Node.js，快速开发。用项目管理工具制定2个月的开发计划，协调设计、开发、测试资源。上线后用数据分析引擎监控关键指标，根据用户反馈快速迭代优化。',
    },
    {
      id: 'msg-9',
      role: 'assessor',
      content: '非常全面的方案！让我为你评分：\n\n✅ **方案评分：24/25**\n\n**亮点：**\n• 全流程覆盖，体现综合能力\n• 工具应用熟练，效率高\n• 考虑了MVP和快速迭代\n• 数据驱动决策思维\n• 展现了优秀的项目管理能力\n\n**小建议：**\n可以增加风险评估和应对预案。\n\n你的综合能力已经达到专家级别，是一位难得的全能型人才！',
      type: 'score',
    },
  ],
  challengeTask: '产品从0到1完整项目方案',
  studentSolution: '市场调研、原型设计、技术选型、项目管理、数据驱动迭代',
  assessorFeedback: '方案全面专业，体现优秀的综合能力',
  result: {
    totalScore: 97,
    skillScores: [
      { category: '技术能力', score: 26, maxScore: 30 },
      { category: '创意能力', score: 22, maxScore: 25 },
      { category: '商业能力', score: 20, maxScore: 25 },
      { category: '沟通能力', score: 19, maxScore: 20 },
      { category: '学习能力', score: 14, maxScore: 15 },
    ],
    newSkillsBonus: 10,
    connectionsBonus: 4,
    finalLevel: '全能专家',
    recommendations: [
      '继续保持全面学习的习惯',
      '选择1-2个领域深入钻研',
      '考虑向技术管理或产品总监方向发展',
      '分享经验，指导其他学员',
    ],
  },
};

// 所有场景
export const assessmentScenarios: AssessmentScenario[] = [
  scenarioNeedsImprovement,
  scenarioGoodPerformance,
  scenarioProgramming,
  scenarioDesign,
  scenarioDataAnalysis,
  scenarioBusiness,
  scenarioProjectManagement,
  scenarioCreativity,
  scenarioCommunication,
  scenarioComprehensive,
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
