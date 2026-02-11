'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AcademyHeader from '@/components/academy/AcademyHeader';
import { mockSkills } from '@/data/academy/mock-skills';
import { Capability } from '@/data/academy/types';
import { getProtocolLabel, getProtocolColor } from '@/lib/academy/utils';

export default function SkillPlaygroundPage() {
  const params = useParams();
  const skillId = params.id as string;

  const skill = mockSkills.find((s) => s.id === skillId);

  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(
    skill?.capabilities[0] || null
  );
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  if (!skill) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <AcademyHeader />
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

  const handleSelectCapability = (cap: Capability) => {
    setSelectedCapability(cap);
    setInputValues({});
    setOutput(null);
  };

  const handleRun = () => {
    if (!selectedCapability) return;
    setRunning(true);
    setOutput(null);

    // Simulate API call
    setTimeout(() => {
      const replaced = selectedCapability.outputFormat
        .replace(/string\[\]/g, '["标签1", "标签2"]')
        .replace(/object\[\]/g, '[]')
        .replace(/string/g, '"示例文本"')
        .replace(/number/g, '42')
        .replace(/boolean/g, 'true')
        .replace(/object/g, '{}');
      try {
        const parsed = JSON.parse(replaced);
        setOutput(JSON.stringify(parsed, null, 2));
      } catch {
        setOutput(replaced);
      }
      setRunning(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <AcademyHeader />
      <div className="flex">
        {/* Left Sidebar - Capability List */}
        <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto p-5">
            <Link
              href={`/academy/skills/${skill.id}`}
              className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-indigo-600"
            >
              &larr; 返回技能详情
            </Link>
            <h2 className="mb-1 text-base font-semibold text-zinc-900">
              {skill.title}
            </h2>
            <div className="mb-4 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getProtocolColor(skill.protocol)}`}>
                {getProtocolLabel(skill.protocol)}
              </span>
              <span className="text-xs text-zinc-400">v{skill.version}</span>
            </div>
            <div className="space-y-1">
              {skill.capabilities.map((cap) => {
                const isCurrent = selectedCapability?.id === cap.id;
                return (
                  <button
                    key={cap.id}
                    onClick={() => handleSelectCapability(cap)}
                    className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      isCurrent
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs ${
                        isCurrent
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      &gt;
                    </span>
                    <div className="flex-1 min-w-0">
                      <code className="block truncate text-xs">{cap.name}</code>
                      <span className="block truncate text-xs text-zinc-400 mt-0.5">
                        {cap.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <main className="flex-1 px-6 py-8 lg:px-12">
          {/* Mobile breadcrumb */}
          <div className="mb-4 lg:hidden">
            <Link
              href={`/academy/skills/${skill.id}`}
              className="text-sm text-zinc-500 hover:text-indigo-600"
            >
              &larr; 返回
            </Link>
          </div>

          {selectedCapability ? (
            <>
              {/* Capability Header */}
              <div className="mb-6">
                <code className="text-lg font-bold text-zinc-900">
                  {selectedCapability.name}
                </code>
                <p className="mt-1 text-sm text-zinc-500">
                  {selectedCapability.description}
                </p>
              </div>

              {/* Mobile Capability Selector */}
              <div className="mb-6 lg:hidden">
                <select
                  value={selectedCapability.id}
                  onChange={(e) => {
                    const cap = skill.capabilities.find((c) => c.id === e.target.value);
                    if (cap) handleSelectCapability(cap);
                  }}
                  className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm"
                >
                  {skill.capabilities.map((cap) => (
                    <option key={cap.id} value={cap.id}>
                      {cap.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Parameters Form */}
              <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-zinc-900">
                  输入参数
                </h3>
                <div className="space-y-4">
                  {selectedCapability.inputParams.map((param) => (
                    <div key={param.name}>
                      <label className="mb-1.5 flex items-center gap-2 text-sm">
                        <code className="font-medium text-zinc-700">{param.name}</code>
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500">
                          {param.type}
                        </span>
                        {param.required && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                      </label>
                      <p className="mb-1.5 text-xs text-zinc-400">{param.description}</p>
                      {param.type.includes('[]') || param.type === 'object' ? (
                        <textarea
                          rows={3}
                          value={inputValues[param.name] || ''}
                          onChange={(e) =>
                            setInputValues({ ...inputValues, [param.name]: e.target.value })
                          }
                          placeholder={`请输入 ${param.type} 格式的数据`}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-sm text-zinc-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      ) : (
                        <input
                          type={param.type === 'number' ? 'number' : 'text'}
                          value={inputValues[param.name] || ''}
                          onChange={(e) =>
                            setInputValues({ ...inputValues, [param.name]: e.target.value })
                          }
                          placeholder={`请输入${param.description}`}
                          className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRun}
                  disabled={running}
                  className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {running ? '执行中...' : '运行'}
                </button>
              </div>

              {/* Output */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-zinc-900">
                  返回结果
                </h3>
                {output ? (
                  <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-green-400">
                    {output}
                  </pre>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg bg-zinc-50 text-sm text-zinc-400">
                    {running ? (
                      <span className="animate-pulse">正在调用技能...</span>
                    ) : (
                      '点击"运行"按钮查看返回结果'
                    )}
                  </div>
                )}
              </div>

              {/* Example */}
              {selectedCapability.example && (
                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-900">
                    调用示例
                  </h3>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-amber-300">
                    {selectedCapability.example}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center text-zinc-400">
              请从左侧选择一个技能函数
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
