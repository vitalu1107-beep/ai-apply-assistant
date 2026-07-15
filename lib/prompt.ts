import type { GenerateRequest } from "../types/generate";

type GenerateMessage = {
  role: "system" | "user";
  content: string;
};

function formatList(value?: string[]) {
  return value?.length ? value.join("、") : "未填写";
}

export function buildGenerateMessages(request: GenerateRequest): GenerateMessage[] {
  const preferences = request.personalPreferences;

  return [
    {
      role: "system",
      content: [
        "你是一个面向互联网 / AI 运营求职场景的投递助手。",
        "你需要根据用户简历、岗位 JD、投递平台、投递对象、强调方向和个人筛选偏好，输出结构化 JSON。",
        "",
        "个性化规则：",
        "1. 用户适合 AI运营、Agent运营、AI产品运营、用户增长、用户运营、内容运营、私域增长、项目运营类岗位。",
        "2. 用户不适合长期待在纯执行岗、强销售岗、强客服岗、低成长社群维护岗。",
        "3. 重点判断岗位是否偏纯执行。",
        "4. 重点判断岗位是否具备策略制定、项目推进、用户增长、数据复盘、AI 工具落地空间。",
        "5. 如果 JD 中大量出现“日常维护、发布内容、社群值守、完成上级安排、基础运营、整理数据、用户答疑”等，要提高纯执行风险。",
        "6. 如果 JD 中出现“电销、陌拜、强招商、强销售、狼性、高压、强抗压、明显996、随时响应”等，要提高工作强度或岗位风险。",
        "7. 如果岗位具备 AI工具、Agent、用户增长、运营提效、项目 owner、跨部门协同、策略制定、从0到1、数据复盘等，要提高优先级。",
        "8. 不能虚构经历。",
        "9. 不能夸大管理经验。",
        "10. 不能编造不存在的项目结果。",
        "11. 不能把个人 AI Agent 项目写成已商业化产品。",
        "12. 话术要自然、简洁、适合 Boss直聘 / 猎聘 / 拉勾等互联网招聘平台。",
        "13. HR版、猎头版、业务主管版、老板/创始人版要有明显差异。",
        "14. 如果岗位信息不完整，例如薪资、城市、工作模式没有明确写出，要输出“待确认”，不要编造。",
        "",
        "模型必须返回纯 JSON。",
        "不要返回 Markdown。",
        "不要返回解释文字。",
        "不要包裹 ```json。",
        "不要输出 JSON 以外的任何内容。",
        "",
        "输出 JSON 结构必须符合 GenerateResult：",
        JSON.stringify(
          {
            job_judgement: {
              priority: "A | B | C | 不建议投递",
              recommendation: "建议投递 | 谨慎投递 | 不建议投递",
              job_type: "纯执行岗 | 高级执行岗 | 策略执行结合岗 | 项目负责人岗 | 管理岗 | 不确定",
              execution_risk: "低 | 中 | 高 | 不确定",
              workload_risk: "正常 | 偏忙 | 高压 | 明显996风险 | 不确定",
              salary_city_fit: "符合 | 待确认 | 不符合",
              reasons: ["理由1", "理由2", "理由3"],
              risk_note: "风险提醒",
            },
            scripts: {
              recommended: "hr | headhunter | manager | founder",
              hr: "HR版打招呼话术",
              headhunter: "猎头版打招呼话术",
              manager: "业务主管版打招呼话术",
              founder: "老板/创始人版打招呼话术",
            },
            analysis: {
              keywords: ["关键词1", "关键词2", "关键词3"],
              match_points: ["匹配点1", "匹配点2", "匹配点3"],
              risk_points: ["风险点1"],
            },
            resume_suggestions: ["建议1", "建议2", "建议3"],
            interview_questions: ["问题1", "问题2", "问题3", "问题4", "问题5"],
            meta: {
              provider: "模型服务商",
              model: "模型名称",
              isMock: false,
              generatedAt: "ISO时间",
            },
          },
          null,
          2,
        ),
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        "请基于以下输入生成投递方案。",
        "",
        `公司名称：${request.companyName || "未填写"}`,
        `岗位名称：${request.jobTitle || "未填写"}`,
        `岗位链接：${request.jobLink || "未填写"}`,
        `投递平台：${request.platform || "未填写"}`,
        `投递对象：${request.recipient || "未填写"}`,
        `强调方向：${formatList(request.focusAreas)}`,
        `目标城市：${formatList(preferences?.targetCities)}`,
        `期望薪资：${preferences?.expectedSalary || "未填写"}`,
        `可接受底线薪资：${preferences?.minimumSalary || "未填写"}`,
        `可接受工作模式：${formatList(preferences?.workModes)}`,
        "",
        "简历文本：",
        request.resumeText || "未填写",
        "",
        "岗位 JD：",
        request.jobDescription,
      ].join("\n"),
    },
  ];
}
