'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  mentorInfo, 
  getRandomScenario, 
  ChatMessage, 
  ConsultationScenario,
  ConsultationPhase 
} from '@/data/academy/mock-consultation';
import { 
  MessageCircle, 
  User, 
  Bot, 
  RotateCcw, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Zap,
  Clock,
  ChevronRight,
  CheckCircle2,
  Star,
  Award,
  Crown
} from 'lucide-react';

// 消息气泡组件
interface MessageBubbleProps {
  message: ChatMessage;
  isLatest: boolean;
  showTyping?: boolean;
}

function MessageBubble({ message, isLatest, showTyping }: MessageBubbleProps) {
  const isMentor = message.role === 'mentor';
  
  return (
    <div className={`flex gap-3 ${isMentor ? '' : 'flex-row-reverse'}`}>
      {/* 头像 */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isMentor ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'
      }`}>
        {isMentor ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>
      
      {/* 消息内容 */}
      <div className={`max-w-[80%] ${isMentor ? '' : 'items-end'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isMentor 
            ? 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-tr-none'
        }`}>
          {showTyping && isLatest && isMentor ? (
            <div className="flex items-center gap-1 h-6">
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <div className="whitespace-pre-line text-sm leading-relaxed">{message.content}</div>
          )}
        </div>
        
        {/* 消息类型标签 */}
        {message.type === 'plan' && !showTyping && (
          <div className={`mt-1 flex items-center gap-1 text-xs ${isMentor ? 'text-violet-600' : 'text-blue-600'}`}>
            <Sparkles className="w-3 h-3" />
            <span>学习计划</span>
          </div>
        )}
        {message.type === 'achievement' && !showTyping && (
          <div className={`mt-1 flex items-center gap-1 text-xs text-amber-600`}>
            <Star className="w-3 h-3" />
            <span>学习收获</span>
          </div>
        )}
        {message.type === 'levelup' && !showTyping && (
          <div className={`mt-1 flex items-center gap-1 text-xs text-orange-600`}>
            <Crown className="w-3 h-3" />
            <span>技能升级</span>
          </div>
        )}
        {message.type === 'result' && !showTyping && (
          <div className={`mt-1 flex items-center gap-1 text-xs ${isMentor ? 'text-emerald-600' : 'text-emerald-600'}`}>
            <Award className="w-3 h-3" />
            <span>完整成果</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 技能升级动画组件
function LevelUpAnimation({ from, to }: { from: number; to: number }) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(from);
  
  useEffect(() => {
    if (currentLevel < to) {
      const timer = setTimeout(() => {
        setCurrentLevel(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentLevel, from, to]);
  
  if (!showAnimation) return null;
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      {/* 等级徽章动画 */}
      <div className="relative">
        {/* 外圈光晕 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 animate-pulse opacity-50" />
        
        {/* 主徽章 */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-2xl animate-bounce">
          <Crown className="w-10 h-10 text-white" />
        </div>
        
        {/* 星星装饰 */}
        <div className="absolute -top-2 -right-2 animate-pulse">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
        </div>
        <div className="absolute -bottom-1 -left-2 animate-pulse" style={{ animationDelay: '200ms' }}>
          <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
        </div>
        <div className="absolute -top-1 -left-3 animate-pulse" style={{ animationDelay: '400ms' }}>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
      </div>
      
      {/* 等级显示 */}
      <div className="mt-6 text-center">
        <div className="text-sm text-zinc-500 mb-2">技能等级提升</div>
        <div className="flex items-center justify-center gap-4">
          <div className={`text-2xl font-bold transition-all duration-500 ${currentLevel > from ? 'text-zinc-400 scale-75' : 'text-zinc-700'}`}>
            Lv.{from}
          </div>
          <div className="flex items-center">
            <ChevronRight className="w-6 h-6 text-orange-500 animate-pulse" />
            <ChevronRight className="w-6 h-6 text-orange-500 -ml-4 animate-pulse" style={{ animationDelay: '100ms' }} />
          </div>
          <div className={`text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent transition-all duration-500 ${currentLevel >= to ? 'scale-110' : 'scale-100'}`}>
            Lv.{currentLevel}
          </div>
        </div>
        <div className="mt-3 text-lg font-semibold text-orange-600">
          {currentLevel >= to ? '🎉 升级成功！' : '升级中...'}
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="mt-4 w-48 h-2 bg-zinc-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700 ease-out"
          style={{ width: `${((currentLevel - from) / (to - from)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// 成果展示卡片
function ResultCard({ scenario }: { scenario: ConsultationScenario }) {
  const { result } = scenario;
  
  return (
    <div className="mt-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-emerald-900">完整学习成果</h3>
      </div>
      
      <div className="space-y-3">
        {/* 等级提升 */}
        <div className="flex items-center gap-3 bg-white rounded-lg p-3">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <div className="text-xs text-zinc-500 mb-1">技能等级提升</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-600">Lv.{result.levelUp.from}</span>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
              <span className="text-lg font-bold text-emerald-600">Lv.{result.levelUp.to}</span>
            </div>
          </div>
        </div>
        
        {/* 新增人脉 */}
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-zinc-500">新增人脉资源</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.newConnections.map((connection, idx) => (
              <span 
                key={idx} 
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
              >
                {connection}
              </span>
            ))}
          </div>
        </div>
        
        {/* 新技能 */}
        <div className="bg-white rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-zinc-500">为Agent配置的新技能</span>
          </div>
          <div className="text-sm text-zinc-700">
            {scenario.id === 'scenario-academic' && (
              <ul className="space-y-1">
                <li>• 智能视频生成器（高级版）</li>
                <li>• 个性化风格定制引擎</li>
                <li>• 专业化视频渲染服务</li>
              </ul>
            )}
            {scenario.id === 'scenario-legal' && (
              <ul className="space-y-1">
                <li>• 合同审阅工具（高级版）</li>
                <li>• 法律风险识别引擎</li>
                <li>• 智能法务咨询助手</li>
              </ul>
            )}
            {scenario.id === 'scenario-efficiency' && (
              <ul className="space-y-1">
                <li>• DOCUMENT ASSISTANT SKILL（专业版）</li>
                <li>• 智能文档结构分析器</li>
                <li>• 多轮对话优化引擎</li>
                <li>• 批量文档处理工具</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 场景信息卡片
function ScenarioCard({ scenario }: { scenario: ConsultationScenario }) {
  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-violet-900 mb-1">{scenario.title}</h3>
          <p className="text-sm text-violet-700 mb-2">{scenario.description}</p>
          <div className="flex flex-wrap gap-1">
            {scenario.tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 bg-white text-violet-600 text-xs rounded-full border border-violet-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 学习状态类型
type LearningState = 
  | 'chatting'         // 对话中
  | 'waitingConfirmPlan'  // 等待确认学习计划（第1个确认点）
  | 'showingAchievement'  // 展示学习收获
  | 'waitingConfirmStart' // 等待确认开始学习（第2个确认点）
  | 'learning'         // 学习进行中
  | 'completed';       // 学习完成，展示成果

// 学习进行中卡片组件
function LearningInProgressCard() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center">
        {/* 加载动画 */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-blue-900 mb-2">学习进行中...</h3>
        <p className="text-sm text-blue-600 mb-4">正在为你的Agent配置新技能，请稍候</p>
        
        {/* 进度条 */}
        <div className="w-full max-w-xs h-2 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-100 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* 动态提示文字 */}
        <div className="mt-3 text-xs text-blue-500">
          {progress < 30 && '正在分析学习需求...'}
          {progress >= 30 && progress < 60 && '正在配置技能模块...'}
          {progress >= 60 && progress < 90 && '正在扩展人脉资源...'}
          {progress >= 90 && '即将完成...'}
        </div>
      </div>
    </div>
  );
}

// 主页面组件
export default function ConsultationPage() {
  const [scenario, setScenario] = useState<ConsultationScenario | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [learningState, setLearningState] = useState<LearningState>('chatting');
  const [currentPhase, setCurrentPhase] = useState<ConsultationPhase>('greeting');
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 初始化场景
  useEffect(() => {
    const initialScenario = getRandomScenario();
    setScenario(initialScenario);
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setLearningState('chatting');
    setWaitingForConfirmation(false);
    setCurrentPhase('greeting');
  }, []);

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayedMessages, scrollToBottom]);

  // 更新当前阶段
  useEffect(() => {
    if (!scenario) return;
    
    if (currentMessageIndex === 0) {
      setCurrentPhase('greeting');
    } else if (currentMessageIndex === 2) {
      setCurrentPhase('requirement');
    } else if (currentMessageIndex === 3) {
      setCurrentPhase('proposal');
    } else if (currentMessageIndex === 4) {
      setCurrentPhase('negotiation');
    } else if (currentMessageIndex === scenario.confirmPlanIndex) {
      setCurrentPhase('confirmation');
    } else if (currentMessageIndex === scenario.confirmStartIndex) {
      setCurrentPhase('achievement');
    } else if (currentMessageIndex > scenario.confirmStartIndex) {
      setCurrentPhase('result');
    }
  }, [currentMessageIndex, scenario]);

  // 对话流程控制
  useEffect(() => {
    if (!scenario || isPaused || waitingForConfirmation || learningState !== 'chatting') return;

    const messages = scenario.messages;
    
    // 到达第1个确认点（确认学习计划）
    if (currentMessageIndex === scenario.confirmPlanIndex) {
      const currentMessage = messages[currentMessageIndex];
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, currentMessage]);
        setCurrentMessageIndex(prev => prev + 1);
        setLearningState('waitingConfirmPlan');
      }, 800);
      return () => clearTimeout(timer);
    }
    
    // 到达第2个确认点（确认开始学习）
    if (currentMessageIndex === scenario.confirmStartIndex) {
      const currentMessage = messages[currentMessageIndex];
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, currentMessage]);
        setCurrentMessageIndex(prev => prev + 1);
        setLearningState('waitingConfirmStart');
      }, 800);
      return () => clearTimeout(timer);
    }
    
    // 所有对话消息显示完毕
    if (currentMessageIndex >= messages.length) {
      setLearningState('completed');
      setTimeout(() => {
        scrollToBottom();
      }, 300);
      return;
    }

    const currentMessage = messages[currentMessageIndex];
    const isMentor = currentMessage.role === 'mentor';

    // 导师消息显示打字效果
    if (isMentor) {
      setIsTyping(true);
      const typingDelay = Math.min(1500 + currentMessage.content.length * 20, 3000);
      
      const timer = setTimeout(() => {
        setIsTyping(false);
        setDisplayedMessages(prev => [...prev, currentMessage]);
        setCurrentMessageIndex(prev => prev + 1);
      }, typingDelay);

      return () => clearTimeout(timer);
    } else {
      // 学员消息直接显示，延迟短一些
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, currentMessage]);
        setCurrentMessageIndex(prev => prev + 1);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [scenario, currentMessageIndex, isPaused, waitingForConfirmation, learningState]);

  // 重新开始咨询
  const handleRestart = () => {
    const newScenario = getRandomScenario();
    setScenario(newScenario);
    setDisplayedMessages([]);
    setCurrentMessageIndex(0);
    setIsTyping(false);
    setIsPaused(false);
    setLearningState('chatting');
    setWaitingForConfirmation(false);
    setCurrentPhase('greeting');
  };

  // 确认学习计划（第1个确认点）
  const handleConfirmPlan = () => {
    setLearningState('chatting');
  };

  // 确认开始学习（第2个确认点）
  const handleStartLearning = () => {
    setLearningState('learning');

    setTimeout(() => {
       scrollToBottom();
    }, 300);
  };

  // 学习进行中状态控制 - 5秒后自动完成
  useEffect(() => {
    if (learningState === 'learning') {
      const timer = setTimeout(() => {
        setLearningState('completed');
        setTimeout(() => {
          scrollToBottom();
      }, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [learningState]);

  // 暂停/继续
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  // 快速完成
  const handleFastForward = () => {
    if (!scenario) return;
    setDisplayedMessages(scenario.messages);
    setCurrentMessageIndex(scenario.messages.length);
    setIsTyping(false);
    setLearningState('completed');
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-zinc-900">{mentorInfo.name}</h1>
                <p className="text-xs text-zinc-500">{mentorInfo.title}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                新咨询
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主聊天区域 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 场景信息 */}
        {/* <ScenarioCard scenario={scenario} /> */}

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
                  role: 'mentor',
                  content: '',
                }}
                isLatest={true}
                showTyping={true}
              />
            )}

            {/* 学习进行中卡片 */}
            {learningState === 'learning' && <LearningInProgressCard />}
            
            {/* 成果展示 */}
            {learningState === 'completed' && <ResultCard scenario={scenario} />}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 第1个确认按钮：确认学习计划 */}
        {learningState === 'waitingConfirmPlan' && (
          <div className="mt-4 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={handleConfirmPlan}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-full hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl animate-pulse"
            >
              <CheckCircle2 className="w-5 h-5" />
              确认学习计划
            </button>
          </div>
        )}

        {/* 第2个确认按钮：确认开始学习 */}
        {learningState === 'waitingConfirmStart' && (
          <div className="mt-4 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={handleStartLearning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl animate-pulse"
            >
              <CheckCircle2 className="w-5 h-5" />
              确认开始学习
            </button>
          </div>
        )}


        {/* 底部控制栏 */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Clock className="w-4 h-4" />
            <span>
              {learningState === 'completed' 
                ? '学习已完成' 
                : learningState === 'learning'
                ? '学习进行中...'
                : learningState === 'waitingConfirmPlan'
                ? '等待确认学习计划'
                : learningState === 'waitingConfirmStart'
                ? '等待确认开始学习'
                : `对话进行中 (${currentMessageIndex + (isTyping ? 0 : 1)}/${scenario.messages.length})`
              }
            </span>
          </div>
          
          {learningState === 'completed' && (
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-full hover:from-violet-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              开始新的咨询
            </button>
          )}
        </div>

        {/* 导师介绍 */}
        <div className="mt-8 bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-xl p-6 border border-zinc-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">关于你的导师</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">{mentorInfo.introduction}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white text-zinc-600 text-xs rounded-full border border-zinc-200">
                  学习计划定制
                </span>
                <span className="px-2 py-1 bg-white text-zinc-600 text-xs rounded-full border border-zinc-200">
                  技能评估
                </span>
                <span className="px-2 py-1 bg-white text-zinc-600 text-xs rounded-full border border-zinc-200">
                  人脉推荐
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
