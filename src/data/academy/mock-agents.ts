import { Agent } from './types';

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Echo',
    avatar: '🤖',
    personality: ['严谨', '高效', '善于分析'],
    skillLevel: 5,
    acquiredSkills: [
      { skillId: 'skill-1', installedAt: '2025-12-15', status: 'active' },
      { skillId: 'skill-3', installedAt: '2026-01-05', status: 'active' },
      { skillId: 'skill-7', installedAt: '2026-01-20', status: 'inactive' },
    ],
    totalCalls: 1280,
    createdAt: '2025-12-01',
  },
  {
    id: 'agent-2',
    name: 'Spark',
    avatar: '⚡',
    personality: ['创新', '幽默', '灵活'],
    skillLevel: 3,
    acquiredSkills: [
      { skillId: 'skill-2', installedAt: '2026-01-15', status: 'active' },
      { skillId: 'skill-5', installedAt: '2026-01-28', status: 'active' },
    ],
    totalCalls: 560,
    createdAt: '2026-01-10',
  },
  {
    id: 'agent-3',
    name: 'Nova',
    avatar: '🌟',
    personality: ['耐心', '细致', '善于沟通'],
    skillLevel: 7,
    acquiredSkills: [
      { skillId: 'skill-1', installedAt: '2025-11-20', status: 'active' },
      { skillId: 'skill-4', installedAt: '2025-12-01', status: 'active' },
      { skillId: 'skill-6', installedAt: '2026-01-05', status: 'active' },
      { skillId: 'skill-8', installedAt: '2026-01-25', status: 'error' },
    ],
    totalCalls: 3450,
    createdAt: '2025-11-15',
  },
];
