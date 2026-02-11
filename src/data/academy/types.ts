export interface SkillParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  inputParams: SkillParam[];
  outputFormat: string;
  example?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  rating: number;
  installCount: number;
  author: string;
  tags: string[];
  capabilities: Capability[];
  version: string;
  protocol: 'mcp' | 'api' | 'function' | 'business';
  coverGradient: string;
}

export interface AcquiredSkill {
  skillId: string;
  installedAt: string;
  status: 'active' | 'inactive' | 'error';
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  personality: string[];
  skillLevel: number;
  acquiredSkills: AcquiredSkill[];
  totalCalls: number;
  createdAt: string;
}

export interface Review {
  id: string;
  skillId: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface SkillFilters {
  search: string;
  category: string;
  difficulty: string;
  sort: string;
}
