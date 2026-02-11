'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Agent } from '@/data/academy/types';
import { mockAgents } from '@/data/academy/mock-agents';
import { mockSkills } from '@/data/academy/mock-skills';
import { getDifficultyColor, getStatusLabel, getStatusColor, getProtocolLabel, getProtocolColor } from '@/lib/academy/utils';

const achievements = [
  { id: 'a1', name: '初出茅庐', icon: '🌱', description: '创建你的第一个Agent', condition: () => true },
  { id: 'a2', name: '首次安装', icon: '🔧', description: '安装第一个技能', condition: (a: Agent) => a.acquiredSkills.length > 0 },
  { id: 'a3', name: '技能收集者', icon: '📦', description: '安装3个以上技能', condition: (a: Agent) => a.acquiredSkills.length >= 3 },
  { id: 'a4', name: '活跃调用', icon: '📡', description: '累计调用超过1000次', condition: (a: Agent) => a.totalCalls >= 1000 },
  { id: 'a5', name: '超级用户', icon: '⚡', description: '累计调用超过3000次', condition: (a: Agent) => a.totalCalls >= 3000 },
  { id: 'a6', name: '全能选手', icon: '🌟', description: '技能等级达到Lv.5', condition: (a: Agent) => a.skillLevel >= 5 },
];

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id as string;

  const agent: Agent | null = useMemo(() => {
    const mockAgent = mockAgents.find((a) => a.id === agentId);
    if (mockAgent) return mockAgent;

    if (typeof window !== 'undefined') {
      const saved: Agent[] = JSON.parse(localStorage.getItem('academy_agents') || '[]');
      return saved.find((a) => a.id === agentId) || null;
    }
    return null;
  }, [agentId]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <main className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="mb-4 text-lg text-zinc-500">未找到该 Agent</p>
          <Link
            href="/academy"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            返回控制台
          </Link>
        </main>
      </div>
    );
  }

  const earnedAchievements = achievements.filter((a) => a.condition(agent));
  const activeSkillCount = agent.acquiredSkills.filter((s) => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Hero Card */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-indigo-50 text-4xl shadow-sm">
                {agent.avatar}
              </div>
              <div className="flex-1 sm:pb-1">
                <h1 className="text-2xl font-bold text-zinc-900">
                  {agent.name}
                </h1>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {agent.personality.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-zinc-400">
                  创建于 {agent.createdAt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-indigo-600">
              Lv.{agent.skillLevel}
            </p>
            <p className="mt-1 text-sm text-zinc-500">技能等级</p>
          </div>
          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-purple-600">
              {activeSkillCount}
            </p>
            <p className="mt-1 text-sm text-zinc-500">已安装技能</p>
          </div>
          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-emerald-600">
              {agent.totalCalls.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-zinc-500">累计调用</p>
          </div>
        </div>

        {/* Acquired Skills */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            已安装技能
          </h2>
          {agent.acquiredSkills.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {agent.acquiredSkills.map((as) => {
                const skill = mockSkills.find((s) => s.id === as.skillId);
                if (!skill) return null;
                return (
                  <Link
                    key={as.skillId}
                    href={`/academy/skills/${as.skillId}`}
                    className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${skill.coverGradient} text-xl`}
                    >
                      {skill.category === '写作'
                        ? '✍️'
                        : skill.category === '分析'
                          ? '📊'
                          : skill.category === '编程'
                            ? '💻'
                            : skill.category === '设计'
                              ? '🎨'
                              : skill.category === '商业'
                                ? '💼'
                                : '💬'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900 truncate">
                          {skill.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(as.status)}`}
                        >
                          {getStatusLabel(as.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getProtocolColor(skill.protocol)}`}>
                          {getProtocolLabel(skill.protocol)}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                          {skill.capabilities.length} 个能力
                        </span>
                        <span className="text-xs text-zinc-400">
                          安装于 {as.installedAt}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="mb-3 text-zinc-500">还没有安装任何技能</p>
              <Link
                href="/academy/skills"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                去技能市场看看 &rarr;
              </Link>
            </div>
          )}
        </section>

        {/* Achievements */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            获得成就
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {achievements.map((achievement) => {
              const earned = earnedAchievements.some(
                (a) => a.id === achievement.id
              );
              return (
                <div
                  key={achievement.id}
                  className={`rounded-xl p-4 text-center transition-colors ${
                    earned
                      ? 'bg-white shadow-sm'
                      : 'bg-zinc-100 opacity-50'
                  }`}
                  title={achievement.description}
                >
                  <div className="mb-2 text-3xl">
                    {earned ? achievement.icon : '🔒'}
                  </div>
                  <p
                    className={`text-xs font-medium ${earned ? 'text-zinc-900' : 'text-zinc-400'}`}
                  >
                    {achievement.name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
