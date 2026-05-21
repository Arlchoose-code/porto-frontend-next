import {
  Brain,
  Cloud,
  Code2,
  Container,
  Database,
  GitBranch,
  Globe,
  Layers3,
  Palette,
  Server,
  Sparkles,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { Skill } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  ai: Brain,
  "ai/ml": Brain,
  api: Server,
  backend: Server,
  cloud: Cloud,
  code: Code2,
  database: Database,
  design: Palette,
  docker: Container,
  frontend: Globe,
  git: GitBranch,
  github: GitBranch,
  go: Terminal,
  golang: Terminal,
  javascript: Code2,
  llm: Brain,
  next: Layers3,
  nextjs: Layers3,
  node: Server,
  react: Layers3,
  sql: Database,
  typescript: Code2,
};

export function SkillIcon({ skill, className = "size-4" }: { skill: Skill; className?: string }) {
  const key = `${skill.category ?? ""} ${skill.name ?? ""}`.toLowerCase();
  const match = Object.entries(iconMap).find(([name]) => key.includes(name));
  const Icon = match?.[1] ?? Sparkles;
  return <Icon aria-hidden className={className} />;
}
