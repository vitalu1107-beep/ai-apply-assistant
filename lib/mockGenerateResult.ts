import type { GenerateResult } from "../types/generate";

export const mockGenerateResult: GenerateResult = {
  job_judgement: {
    priority: "A",
    recommendation: "建议投递",
    job_type: "项目负责人岗",
    execution_risk: "低",
    workload_risk: "正常",
    salary_city_fit: "待确认",
    reasons: [
      "岗位方向偏 AI 运营和用户增长，符合当前求职方向",
      "岗位具备项目推进和工具提效空间，不是单纯执行",
      "可以结合过往用户增长、私域运营和 AI Agent 项目进行表达",
    ],
    risk_note: "需要确认岗位是否有实际项目 owner 权限，避免责任大于资源",
  },
  scripts: {
    recommended: "hr",
    hr: "你好，我关注到这个 AI 运营岗位，岗位中提到用户增长、AI工具和运营提效，这和我过往的用户增长、私域运营经验，以及正在搭建的 AI Agent 项目比较匹配。想进一步沟通这个机会。",
    headhunter:
      "你好，我目前重点关注 AI运营、用户增长和运营提效方向。我的经历包括用户增长、私域运营、数据复盘和 AI Agent 项目实践。如果这个岗位重视业务理解和工具落地，我觉得匹配度较高。",
    manager:
      "你好，我对这个 AI 运营岗位很感兴趣。我比较擅长从业务流程里找增长和提效空间，也有用户增长、私域运营、数据复盘经验，最近在搭建 AI Agent 项目，希望能把 AI 工具真正用到运营场景里。",
    founder:
      "你好，我关注到贵司正在招聘 AI 运营。我过往做过用户增长、私域运营和项目推进，也在实践 AI Agent，希望能从业务需求出发，用 AI 提升运营效率和转化效果，期待有机会聊聊。",
  },
  analysis: {
    keywords: ["用户增长", "AI工具", "私域运营", "数据复盘"],
    match_points: [
      "有用户增长和社区团购运营经验",
      "有私域运营和项目推进经验",
      "正在搭建 AI Agent 项目",
    ],
    risk_points: ["需要确认岗位是否偏技术或纯执行"],
  },
  resume_suggestions: [
    "将 AI Agent 项目放到个人优势或项目经历中",
    "强化用户增长、私域转化、数据复盘关键词",
    "对目标岗位补充更贴近 JD 的一句个人定位",
  ],
  interview_questions: [
    "你为什么想转向 AI 运营？",
    "你做过哪些用户增长项目？",
    "你如何理解 AI Agent 在运营场景中的价值？",
    "你如何判断一个岗位和自己是否匹配？",
    "如果让你设计一个运营提效工具，你会怎么做？",
  ],
};
