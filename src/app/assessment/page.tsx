'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  assessorInfo,
  getRandomScenario,
  ChatMessage,
  AssessmentScenario,
  MessageRole,
} from '@/data/academy/mock-assessment';
import {
  MessageCircle,
  User,
  Bot,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Star,
  Target,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

// 消息气泡组件
interface MessageBubbleProps {
  message: ChatMessage;
  isLatest: boolean;
  showTyping?: boolean;
}

function MessageBubble({ message, isLatest, showTyping }: MessageBubbleProps) {
  const isAssessor = message.role === 'assessor';

  return (
    <div className={`flex gap-3 ${isAssessor ? '' : 'flex-row-reverse'}`}>
      {/* 头像 */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isAssessor
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
        }`}
      >
        {isAssessor ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* 消息内容 */}
      <div className={`max-w-[80%] ${isAssessor ? '' : 'items-end'}`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isAssessor
              ? 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-none'
          }`}
        >
          {showTyping && isLatest && isAssessor ? (
            <div className="flex items-center gap-1 h-6">
              <span
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          ) : (
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {message.content}
            </div>
          )}
        </div>

        {/* 消息类型标签 */}
        {message.type === 'score' && !showTyping && (
          <div
            className={`mt-1 flex items-center gap-1 text-xs ${
              isAssessor ? 'text-emerald-600' : 'text-blue-600'
            }`}
          >
            <Target className="w-3 h-3" />
            <span>评分结果</span>
          </div>
        )}
        {message.type === 'challenge' && !showTyping && (
          <div className={`mt-1 flex items-center gap-1 text-xs text-amber-600`}>
            <Star className="w-3 h-3" />
            <span>任务挑战</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 评估结果卡片
function AssessmentResultCard({
  scenario,
}: {
  scenario: AssessmentScenario;
}) {
  const { result } = scenario;
  const isPass = result.totalScore >= 60;

  return (
    <div className="mt-4 bg-gradient-to-br from-white to-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 总分展示 */}
      <div className="text-center mb-6">
        <div className="inline-flex flex-col items-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 ${
              isPass
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                : 'bg-gradient-to-br from-amber-400 to-orange-500'
            }`}
          >
            <Award className="w-10 h-10 text-white" />
          </div>
          <div className="text-4xl font-bold text-zinc-900 mb-1">
            {result.totalScore}
          </div>
          <div className="text-sm text-zinc-500">总分 / 100</div>
          <div
            className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              isPass
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {result.finalLevel}
          </div>
        </div>
      </div>

      {/* 技能分类得分 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          技能分类得分
        </h3>
        <div className="space-y-2">
          {result.skillScores.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-16 text-xs text-zinc-500">{item.category}</div>
              <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    item.score >= item.maxScore * 0.7
                      ? 'bg-emerald-500'
                      : item.score >= item.maxScore * 0.4
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${(item.score / item.maxScore) * 100}%`,
                  }}
                />
              </div>
              <div className="w-16 text-xs text-zinc-600 text-right">
                {item.score}/{item.maxScore}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 动态评分 */}
      <div className="mb-6 p-4 bg-zinc-50 rounded-xl">
        <h3 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          动态评分
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900">
              +{result.newSkillsBonus}
            </div>
            <div className="text-xs text-zinc-500">新技能加分</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-900">
              +{result.connectionsBonus}
            </div>
            <div className="text-xs text-zinc-500">人脉扩展加分</div>
          </div>
        </div>
      </div>

      {/* 导师评语 */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          导师评语
        </h3>
        <p className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-lg">
          {scenario.type === 'needs-improvement'
            ? '你在基础技能方面有一定的积累，但近期学习进度有所放缓。建议制定更规律的学习计划，重点补强商业类技能，并多参与实战任务提升应用能力。'
            : '你展现出了优秀的学习能力和工具应用水平。技能储备丰富且均衡，近期学习表现非常积极。继续保持，你很快就能达到专家级别！'}
        </p>
      </div>

      {/* 改进建议 */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          {isPass ? '进阶建议' : '改进建议'}
        </h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600">
              <ChevronRight className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 主页面组件
export default function AssessmentPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<AssessmentScenario | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 初始化场景
  useEffect(() => {
    const initialScenario = getRandomScenario();
    setScenario(initialScenario);
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setIsCompleted(false);
  }, []);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages, scrollToBottom]);

  // 对话流程控制
  useEffect(() => {
    if (!scenario || isCompleted) return;

    const messages = scenario.messages;

    // 所有对话消息显示完毕
    if (currentMessageIndex >= messages.length) {
      setIsCompleted(true);
      setTimeout(() => {
        scrollToBottom();
      }, 300);
      return;
    }

    const currentMessage = messages[currentMessageIndex];
    const isAssessor = currentMessage.role === 'assessor';

    // 导师消息显示打字效果
    if (isAssessor) {
      setIsTyping(true);
      const typingDelay = Math.min(
        1500 + currentMessage.content.length * 20,
        3000
      );

      const timer = setTimeout(() => {
        setIsTyping(false);
        setDisplayedMessages((prev) => [...prev, currentMessage]);
        setCurrentMessageIndex((prev) => prev + 1);
      }, typingDelay);

      return () => clearTimeout(timer);
    } else {
      // 学员消息直接显示，延迟短一些
      const timer = setTimeout(() => {
        setDisplayedMessages((prev) => [...prev, currentMessage]);
        setCurrentMessageIndex((prev) => prev + 1);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [scenario, currentMessageIndex, isCompleted, scrollToBottom]);

  if (!scenario) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-zinc-600">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-zinc-900">
                  {assessorInfo.name}
                </h1>
                <p className="text-xs text-zinc-500">{assessorInfo.title}</p>
              </div>
            </div>

            <Link
              href="/academy"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              返回学院
            </Link>
          </div>
        </div>
      </header>

      {/* 主聊天区域 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 聊天容器 */}
        <div
          ref={chatContainerRef}
          className="bg-white rounded-2xl border border-zinc-200 shadow-sm min-h-[500px] max-h-[700px] overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {displayedMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={index === displayedMessages.length - 1}
              />
            ))}

            {/* 打字效果 */}
            {isTyping && currentMessageIndex < scenario.messages.length && (
              <MessageBubble
                message={{
                  id: 'typing',
                  role: 'assessor',
                  content: '',
                }}
                isLatest={true}
                showTyping={true}
              />
            )}

            {/* 评估结果 */}
            {isCompleted && <AssessmentResultCard scenario={scenario} />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 底部状态栏 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            {isCompleted ? (
              <>
                <Award className="w-4 h-4" />
                <span>评估已完成</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>
                  评估进行中 ({currentMessageIndex + (isTyping ? 0 : 1)}/
                  {scenario.messages.length})
                </span>
              </>
            )}
          </div>

          {isCompleted && (
            <Link
              href="/academy/skills"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              前往技能广场
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* 导师介绍 */}
        <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">
                关于技能评估
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {assessorInfo.introduction}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white text-zinc-600 text-xs rounded-full border border-zinc-200">
                  技能水平评估
                </span>
                <span className="px-2 py-1 bg-white text-zinc-600 text-xs rounded-full border border-zinc-200">
                  能力模型分析
                </span>
                <span className="px-2 py-1 bg-white text-zinc-600 text-xs rounded-full border border-zinc-200">
                  个性化建议
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
