'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StarRating from '@/components/academy/StarRating';
import { mockSkills } from '@/data/academy/mock-skills';
import { mockReviews } from '@/data/academy/mock-skills';
import { mockAgents } from '@/data/academy/mock-agents';
import { Capability } from '@/data/academy/types';
import {
  getDifficultyLabel,
  getDifficultyColor,
  getProtocolLabel,
  getProtocolColor,
  formatPrice,
} from '@/lib/academy/utils';

function CapabilityItem({ capability, index }: { capability: Capability; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left hover:bg-zinc-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
            {index + 1}
          </span>
          <div>
            <code className="text-sm font-semibold text-zinc-800">{capability.name}</code>
            <p className="mt-0.5 text-xs text-zinc-500">{capability.description}</p>
          </div>
        </div>
        <span className="shrink-0 text-zinc-300">
          {expanded ? '▲' : '▼'}
        </span>
      </button>
      {expanded && (
        <div className="border-t border-zinc-100 px-4 py-4 space-y-4">
          {/* Input Parameters */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              输入参数
            </h4>
            <div className="space-y-1.5">
              {capability.inputParams.map((param) => (
                <div
                  key={param.name}
                  className="flex items-start gap-2 rounded-md bg-zinc-50 px-3 py-2"
                >
                  <code className="shrink-0 text-sm font-medium text-indigo-600">
                    {param.name}
                  </code>
                  <span className="shrink-0 rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-600">
                    {param.type}
                  </span>
                  {param.required && (
                    <span className="shrink-0 rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-500">
                      必填
                    </span>
                  )}
                  <span className="text-xs text-zinc-500">{param.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Output Format */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              返回格式
            </h4>
            <pre className="overflow-x-auto rounded-md bg-zinc-900 px-3 py-2 text-xs text-green-400">
              {capability.outputFormat}
            </pre>
          </div>

          {/* Example */}
          {capability.example && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                调用示例
              </h4>
              <pre className="overflow-x-auto rounded-md bg-zinc-900 px-3 py-2 text-xs text-amber-300">
                {capability.example}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.id as string;

  const skill = mockSkills.find((s) => s.id === skillId);
  const reviews = mockReviews.filter((r) => r.skillId === skillId);

  const [selectedAgent, setSelectedAgent] = useState(mockAgents[0]?.id || '');
  const [installed, setInstalled] = useState(false);

  if (!skill) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <main className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="mb-4 text-lg text-zinc-500">未找到该技能</p>
          <Link
            href="/academy/skills"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            返回技能市场
          </Link>
        </main>
      </div>
    );
  }

  const handleInstall = () => {
    setInstalled(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/academy/skills" className="hover:text-indigo-600">
            技能市场
          </Link>
          <span>/</span>
          <span className="text-zinc-900">{skill.title}</span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left Content */}
          <div className="flex-1">
            {/* Cover */}
            <div
              className={`mb-6 flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.coverGradient}`}
            >
              <span className="text-7xl opacity-80">
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
              </span>
            </div>

            {/* Title & Meta */}
            <h1 className="mb-3 text-2xl font-bold text-zinc-900">
              {skill.title}
            </h1>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getProtocolColor(skill.protocol)}`}
              >
                {getProtocolLabel(skill.protocol)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}
              >
                {getDifficultyLabel(skill.difficulty)}
              </span>
              <span className="text-sm text-zinc-500">
                v{skill.version}
              </span>
              <StarRating rating={skill.rating} count={reviews.length} />
            </div>
            <p className="mb-8 leading-relaxed text-zinc-600">
              {skill.description}
            </p>

            {/* Capability List */}
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">
                技能清单 ({skill.capabilities.length})
              </h2>
              <div className="space-y-2">
                {skill.capabilities.map((capability, index) => (
                  <CapabilityItem
                    key={capability.id}
                    capability={capability}
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-zinc-900">
                  用户评价 ({reviews.length})
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-zinc-200 bg-white p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                            {review.userName[0]}
                          </div>
                          <span className="text-sm font-medium text-zinc-800">
                            {review.userName}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400">
                          {review.createdAt}
                        </span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-2 text-sm text-zinc-600">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-8 rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 text-center">
                <p className="text-3xl font-bold text-zinc-900">
                  {formatPrice(skill.price)}
                </p>
              </div>

              {/* Agent Selector */}
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  安装到哪个 Agent
                </label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {mockAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.avatar} {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              {installed || skill.price === 0 ? (
                <button
                  disabled={installed}
                  onClick={handleInstall}
                  className={`mb-4 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
                    installed
                      ? 'bg-green-50 text-green-600 cursor-default'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {installed ? '已安装' : '安装技能'}
                </button>
              ) : (
                <button
                  onClick={handleInstall}
                  className="mb-4 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                >
                  购买并安装
                </button>
              )}

              {/* Stats */}
              <div className="space-y-3 border-t border-zinc-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">协议类型</span>
                  <span className="text-zinc-900">
                    {getProtocolLabel(skill.protocol)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">技能数量</span>
                  <span className="text-zinc-900">{skill.capabilities.length} 个</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">安装次数</span>
                  <span className="text-zinc-900">
                    {skill.installCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">难度等级</span>
                  <span className="text-zinc-900">
                    {getDifficultyLabel(skill.difficulty)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">版本</span>
                  <span className="text-zinc-900">v{skill.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">作者</span>
                  <span className="text-zinc-900">{skill.author}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 border-t border-zinc-100 pt-4">
                <div className="flex flex-wrap gap-1.5">
                  {skill.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
