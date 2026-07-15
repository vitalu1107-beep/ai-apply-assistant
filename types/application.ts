import type {
  FocusArea,
  GenerateAnalysis,
  JobJudgement,
  OutreachScripts,
  Platform,
  Recipient,
} from "./generate";

export type ApplicationStatus = "已投递" | "已回复" | "待跟进" | "已约面" | "已拒绝" | "放弃";

export type ApplicationRecord = {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobLink?: string;
  platform?: Platform;
  recipient?: Recipient;
  focusAreas?: FocusArea[];
  jobJudgement?: JobJudgement;
  scripts?: OutreachScripts;
  analysis?: GenerateAnalysis;
  resumeSuggestions?: string[];
  interviewQuestions?: string[];
  status: ApplicationStatus;
  appliedAt: string;
  lastContactAt?: string;
  nextFollowUpAt?: string;
  notes?: string;

  expectedSalary?: string;
  minimumSalary?: string;
  salaryNegotiable?: boolean;
  city?: string;
  workMode?: string;
  jobDirection?: string;
  jobType?: string;
  workloadRisk?: string;
  recommendedScriptType?: string;
};
