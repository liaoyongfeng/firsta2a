'use client';

import Link from 'next/link';
import AcademyHeader from '@/components/academy/AcademyHeader';
import AgentCard from '@/components/academy/AgentCard';
import SkillCard from '@/components/academy/SkillCard';
import { mockAgents } from '@/data/academy/mock-agents';
import { mockSkills } from '@/data/academy/mock-skills';

export default function AcademyDashboard() {
  const agents = mockAgents;
  const recommendedSkills = mockSkills.slice(0, 6);

  const totalActiveSkills = agents.reduce(
    (sum, a) => sum + a.acquiredSkills.filter((s) => s.status === 'active').length,
    0
  );
  const totalCalls = agents.reduce((sum, a) => sum + a.totalCalls, 0);

  const stats = [
    { label: '我的 Agent', value: agents.length, icon: '🤖', color: 'bg-indigo-50 text-indigo-600' },
    { label: '已安装技能', value: totalActiveSkills, icon: '🔧', color: 'bg-purple-50 text-purple-600' },
    { label: '累计调用次数', value: totalCalls.toLocaleString(), icon: '📡', color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <AcademyHeader />
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold">
                欢迎来到 AI Agent 技能学院
              </h1>
              <p className="text-indigo-100">
                为你的 Agent 安装强大技能，让它们即刻可用
              </p>
            </div>
            <Link
              href="/academy/create-agent"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 whitespace-nowrap"
            >
              + 创建新 Agent
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* My Agents */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">
              我的 Agent 团队
            </h2>
          </div>
          {agents.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="mb-4 text-zinc-500">你还没有创建任何 Agent</p>
              <Link
                href="/academy/create-agent"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                创建第一个 Agent
              </Link>
            </div>
          )}
        </section>

        {/* Recommended Skills */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">为你推荐</h2>
            <Link
              href="/academy/skills"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              浏览全部 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
