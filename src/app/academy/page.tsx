'use client';

import { useState } from 'react';
import Link from 'next/link';
import AgentCard from '@/components/academy/AgentCard';
import SkillCard from '@/components/academy/SkillCard';
import { mockAgents } from '@/data/academy/mock-agents';
import { mockSkills } from '@/data/academy/mock-skills';
import { Skill } from '@/data/academy/types';

// 简化版技能卡片组件 - 用于"已掌握技能"选项卡
function SimpleSkillCard({ skill }: { skill: Skill }) {
  // 根据分类返回对应的图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '写作':
        return '✍️';
      case '分析':
        return '📊';
      case '编程':
        return '💻';
      case '设计':
        return '🎨';
      case '商业':
        return '💼';
      default:
        return '💬';
    }
  };

  return (
    <Link href={`/academy/skills/${skill.id}`}>
      <div className="group min-w-[220px] rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-2xl">
            {getCategoryIcon(skill.category)}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 group-hover:text-purple-600 transition-colors line-clamp-1">
              {skill.title}
            </h3>
            <p className="text-xs text-zinc-400">{skill.category}</p>
          </div>
        </div>
        <p className="text-xs text-zinc-500 line-clamp-2">{skill.description}</p>
      </div>
    </Link>
  );
}

export default function AcademyDashboard() {
  const agents = mockAgents;
  const recommendedSkills = mockSkills.slice(0, 6);
  const [activeTab, setActiveTab] = useState<'agents' | 'skills'>('agents');

  const totalActiveSkills = agents.reduce(
    (sum, a) => sum + a.acquiredSkills.filter((s) => s.status === 'active').length,
    0
  );

  // 获取所有已安装的技能（去重）
  const installedSkillIds = new Set<string>();
  agents.forEach((agent) => {
    agent.acquiredSkills
      .filter((s) => s.status === 'active')
      .forEach((s) => installedSkillIds.add(s.skillId));
  });
  const installedSkills = mockSkills.filter((skill) => installedSkillIds.has(skill.id));

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 课程咨询入口 - 轻柔上下浮动 */}
          <Link
            href="/consultation"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 animate-[float_3s_ease-in-out_infinite]"
          >
            <div className="flex items-center justify-between">
              <div className="transition-transform duration-300 group-hover:translate-x-2">
                <h2 className="mb-2 text-xl font-bold">课程咨询</h2>
                <p className="text-sm text-indigo-100">获取专业课程建议，规划晋级路径</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl transition-all duration-100 group-hover:scale-125 group-hover:bg-white/30 group-hover:rotate-6">
                📚
              </div>
            </div>
          </Link>

          {/* 技能考核评估入口 - 轻柔摆动 */}
          <Link
            href="/assessment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 animate-[float_3s_ease-in-out_infinite]"
          >
            <div className="flex items-center justify-between">
              <div className="transition-transform duration-300 group-hover:translate-x-2">
                <h2 className="mb-2 text-xl font-bold">技能考核评估</h2>
                <p className="text-sm text-emerald-100">测试你的技能水平，获取能力认证</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-2xl transition-all duration-100 group-hover:scale-125 group-hover:bg-white/30">
                🎯
              </div>
            </div>
          </Link>
        </div>

        {/* 我的能力模型 */}
        <section className="relative mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">我的能力模型</h2>
          </div>

          {/* 创建 Agent 按钮 - 固定定位在右上角 */}
          <Link
            href="/academy/create-agent"
            className={`absolute right-6 top-6 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-700 ${
              activeTab === 'agents' ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            + 创建 Agent
          </Link>

          {/* 选项卡 */}
          <div className="mb-6 flex border-b border-zinc-200">
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-sm">🤖</span>
              我的 Agent
              <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {agents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-50 text-sm">🔧</span>
              已掌握技能
              <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                {installedSkills.length}
              </span>
            </button>
          </div>

          {/* 选项卡内容 */}
          {activeTab === 'agents' ? (
            /* Agent 列表 */
            agents.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pt-2 pb-2">
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-zinc-50 p-8 text-center">
                <p className="mb-4 text-zinc-500">你还没有创建任何 Agent</p>
                <Link
                  href="/academy/create-agent"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  创建第一个 Agent
                </Link>
              </div>
            )
          ) : (
            /* 技能列表 */
            installedSkills.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {installedSkills.map((skill) => (
                  <SimpleSkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-zinc-50 p-8 text-center">
                <p className="mb-4 text-zinc-500">你还没有安装任何技能</p>
                <Link
                  href="/academy/skills"
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                >
                  浏览技能市场
                </Link>
              </div>
            )
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
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
