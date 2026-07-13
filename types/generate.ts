export type JobJudgement = {
  priority: "A" | "B" | "C" | "不建议投递";
  recommendation: "建议投递" | "谨慎投递" | "不建议投递";
  job_type: "纯执行岗" | "高级执行岗" | "策略执行结合岗" | "项目负责人岗" | "管理岗";
  execution_risk: "低" | "中" | "高";
  workload_risk: "正常" | "偏忙" | "高压" | "明显996风险";
  salary_city_fit: "符合" | "待确认" | "不符合";
  reasons: string[];
  risk_note: string;
};

export type OutreachScripts = {
  recommended: "hr" | "headhunter" | "manager" | "founder";
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

export type GenerateResult = {
  job_judgement: JobJudgement;
  scripts: OutreachScripts;
  analysis: GenerateAnalysis;
  resume_suggestions: string[];
  interview_questions: string[];
};

export type GenerateRequest = {
  jobDescription: string;
  companyName: string;
  jobTitle: string;
  jobLink: string;
  platform: string;
  recipient: string;
  focusAreas: string[];
  personalPreferences: {
    expectedSalary: string;
    minimumSalary: string;
    salaryNegotiable: boolean;
    city: string;
    workMode: string;
  };
  resumeText: string;
};
