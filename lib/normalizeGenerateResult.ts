import type {
  FitStatus,
  GenerateResult,
  JobPriority,
  JobType,
  Recommendation,
  RiskLevel,
  ScriptType,
  WorkloadRisk,
} from "../types/generate";

const jobPriorities: JobPriority[] = ["A", "B", "C", "不建议投递"];
const recommendations: Recommendation[] = ["建议投递", "谨慎投递", "不建议投递"];
const jobTypes: JobType[] = [
  "纯执行岗",
  "高级执行岗",
  "策略执行结合岗",
  "项目负责人岗",
  "管理岗",
  "不确定",
];
const riskLevels: RiskLevel[] = ["低", "中", "高", "不确定"];
const workloadRisks: WorkloadRisk[] = ["正常", "偏忙", "高压", "明显996风险", "不确定"];
const fitStatuses: FitStatus[] = ["符合", "待确认", "不符合"];
const scriptTypes: ScriptType[] = ["hr", "headhunter", "manager", "founder"];

type UnknownRecord = Record<string, unknown>;

function isRecord(input: unknown): input is UnknownRecord {
  return Boolean(input && typeof input === "object" && !Array.isArray(input));
}

function normalizeEnum<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function normalizeGenerateResult(input: unknown): GenerateResult {
  const result = isRecord(input) ? input : {};
  const judgement = isRecord(result.job_judgement) ? result.job_judgement : {};
  const scripts = isRecord(result.scripts) ? result.scripts : {};
  const analysis = isRecord(result.analysis) ? result.analysis : {};
  const meta = isRecord(result.meta) ? result.meta : {};

  return {
    job_judgement: {
      priority: normalizeEnum(judgement.priority, jobPriorities, "C"),
      recommendation: normalizeEnum(judgement.recommendation, recommendations, "谨慎投递"),
      job_type: normalizeEnum(judgement.job_type, jobTypes, "不确定"),
      execution_risk: normalizeEnum(judgement.execution_risk, riskLevels, "不确定"),
      workload_risk: normalizeEnum(judgement.workload_risk, workloadRisks, "不确定"),
      salary_city_fit: normalizeEnum(judgement.salary_city_fit, fitStatuses, "待确认"),
      reasons: normalizeStringArray(judgement.reasons),
      risk_note: normalizeString(judgement.risk_note),
    },
    scripts: {
      recommended: normalizeEnum(scripts.recommended, scriptTypes, "hr"),
      hr: normalizeString(scripts.hr),
      headhunter: normalizeString(scripts.headhunter),
      manager: normalizeString(scripts.manager),
      founder: normalizeString(scripts.founder),
    },
    analysis: {
      keywords: normalizeStringArray(analysis.keywords),
      match_points: normalizeStringArray(analysis.match_points),
      risk_points: normalizeStringArray(analysis.risk_points),
    },
    resume_suggestions: normalizeStringArray(result.resume_suggestions),
    interview_questions: normalizeStringArray(result.interview_questions),
    meta: {
      provider: normalizeString(meta.provider) || undefined,
      model: normalizeString(meta.model) || undefined,
      isMock: typeof meta.isMock === "boolean" ? meta.isMock : undefined,
      generatedAt: normalizeString(meta.generatedAt) || undefined,
    },
  };
}
