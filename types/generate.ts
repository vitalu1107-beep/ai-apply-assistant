export type Platform = "Boss直聘" | "猎聘" | "拉勾" | "其他";

export type Recipient = "HR" | "猎头" | "业务主管" | "老板/创始人";

export type FocusArea =
  | "AI运营能力"
  | "用户增长经验"
  | "Agent项目经验"
  | "私域/社群运营"
  | "内容运营"
  | "数据复盘"
  | "项目管理"
  | "业务理解";

export type PersonalPreferences = {
  targetCities?: string[];
  expectedSalary?: string;
  minimumSalary?: string;
  workModes?: string[];
};

export type GenerateRequest = {
  jobDescription: string;
  companyName?: string;
  jobTitle?: string;
  jobLink?: string;
  platform?: Platform;
  recipient?: Recipient;
  focusAreas?: FocusArea[];
  personalPreferences?: PersonalPreferences;
  resumeText?: string;
};

export type JobPriority = "A" | "B" | "C" | "不建议投递";

export type Recommendation = "建议投递" | "谨慎投递" | "不建议投递";

export type JobType =
  | "纯执行岗"
  | "高级执行岗"
  | "策略执行结合岗"
  | "项目负责人岗"
  | "管理岗"
  | "不确定";

export type RiskLevel = "低" | "中" | "高" | "不确定";

export type WorkloadRisk = "正常" | "偏忙" | "高压" | "明显996风险" | "不确定";

export type FitStatus = "符合" | "待确认" | "不符合";

export type JobJudgement = {
  priority: JobPriority;
  recommendation: Recommendation;
  job_type: JobType;
  execution_risk: RiskLevel;
  workload_risk: WorkloadRisk;
  salary_city_fit: FitStatus;
  reasons: string[];
  risk_note: string;
};

export type ScriptType = "hr" | "headhunter" | "manager" | "founder";

export type OutreachScripts = {
  recommended: ScriptType;
  hr: string;
  headhunter: string;
  manager: string;
  founder: string;
};

export type GenerateAnalysis = {
  keywords: string[];
  match_points: string[];
  risk_points: string[];
};

export type GenerateMeta = {
  provider?: string;
  model?: string;
  isMock?: boolean;
  generatedAt?: string;
};

export type GenerateResult = {
  job_judgement: JobJudgement;
  scripts: OutreachScripts;
  analysis: GenerateAnalysis;
  resume_suggestions: string[];
  interview_questions: string[];
  meta?: GenerateMeta;
};
