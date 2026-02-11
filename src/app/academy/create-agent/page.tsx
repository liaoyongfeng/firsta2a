'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AcademyHeader from '@/components/academy/AcademyHeader';
import StepIndicator from '@/components/academy/StepIndicator';

const avatarOptions = ['🤖', '⚡', '🌟', '🦊', '🐉', '🎯'];

const personalityOptions = [
  '严谨', '高效', '创新', '幽默', '耐心', '细致',
  '善于分析', '善于沟通', '灵活', '果断', '好奇', '务实',
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [personality, setPersonality] = useState<string[]>([]);
  const [error, setError] = useState('');

  const togglePersonality = (tag: string) => {
    setPersonality((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 5) return prev;
      return [...prev, tag];
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('请输入Agent名称');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (personality.length < 1) {
        setError('请至少选择1个性格标签');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleCreate = () => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: name.trim(),
      avatar,
      personality,
      skillLevel: 1,
      acquiredSkills: [],
      totalCalls: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const existing = JSON.parse(localStorage.getItem('academy_agents') || '[]');
    existing.push(newAgent);
    localStorage.setItem('academy_agents', JSON.stringify(existing));

    router.push(`/academy/agents/${newAgent.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <AcademyHeader />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <StepIndicator
            currentStep={step}
            totalSteps={3}
            labels={['基本信息', '个性设定', '确认创建']}
          />
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                为你的 Agent 命名
              </h2>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Agent 名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  placeholder="给你的Agent起个好听的名字..."
                  className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <p className="mt-1.5 text-xs text-zinc-400">
                  {name.length}/20 个字符
                </p>
              </div>
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-zinc-700">
                  选择头像
                </label>
                <div className="flex flex-wrap gap-3">
                  {avatarOptions.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`flex h-16 w-16 items-center justify-center rounded-xl text-3xl transition-all ${
                        avatar === a
                          ? 'border-2 border-indigo-600 bg-indigo-50 scale-110'
                          : 'border-2 border-zinc-100 bg-zinc-50 hover:border-zinc-300'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personality */}
          {step === 2 && (
            <div>
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                设定 Agent 个性
              </h2>
              <p className="mb-6 text-sm text-zinc-500">
                选择 1-5 个性格标签来定义你的Agent的风格
              </p>
              <div className="flex flex-wrap gap-2.5">
                {personalityOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => togglePersonality(tag)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      personality.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400">
                已选择 {personality.length}/5 个标签
              </p>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-zinc-900">
                确认创建
              </h2>
              <div className="mb-6 flex items-center gap-5 rounded-xl bg-zinc-50 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-5xl">
                  {avatar}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-zinc-900">
                    {name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {personality.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-amber-700">
                  🎯 你的 Agent 将从 Lv.1 开始，前往技能市场为它安装新技能吧！
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => { setStep(step - 1); setError(''); }}
                className="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                上一步
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                下一步
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                创建 Agent
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
