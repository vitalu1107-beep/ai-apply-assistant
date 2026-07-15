import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagePath = join(root, "app", "page.tsx");
const forbiddenPaths = [
  join(root, "pages", "api"),
  join(root, ".env.local"),
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function listFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    return stats.isDirectory() ? listFiles(path) : [path];
  });
}

assert(existsSync(pagePath), "app/page.tsx should exist");

const page = readFileSync(pagePath, "utf8");
const cssPath = join(root, "app", "globals.css");
const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
const mockPath = join(root, "lib", "mockGenerateResult.ts");
const normalizePath = join(root, "lib", "normalizeGenerateResult.ts");
const typePath = join(root, "types", "generate.ts");
const applicationTypePath = join(root, "types", "application.ts");
const generatedSource = [
  page,
  existsSync(mockPath) ? readFileSync(mockPath, "utf8") : "",
  existsSync(normalizePath) ? readFileSync(normalizePath, "utf8") : "",
  existsSync(typePath) ? readFileSync(typePath, "utf8") : "",
  existsSync(applicationTypePath) ? readFileSync(applicationTypePath, "utf8") : "",
].join("\n");
const requiredText = [
  "AI 智能投递助手",
  "UI 原型",
  "未接 API",
  "工作台",
  "投递记录",
  "高频投递前的岗位筛选、话术生成与轻量记录工作台",
  "生成投递方案",
  "清空内容",
  "保存到投递记录",
  "个人筛选偏好",
  "目标城市",
  "可接受工作模式",
  "期望薪资",
  "可接受底线薪资",
  "面议",
  "杭州",
  "上海",
  "深圳",
  "广州",
  "远程",
  "到岗",
  "混合办公",
  "不确定",
  "AI运营",
  "输入信息",
  "粘贴岗位 JD，选择投递场景，生成可直接复制的话术。",
  "生成结果",
  "优先展示岗位判断和可复制话术，其它分析作为辅助信息。",
  "投递设置",
  "当前岗位摘要",
  "某 AI 公司｜AI 运营｜Boss直聘｜HR｜建议优先级 A",
  "岗位筛选判断",
  "投递优先级",
  "是否建议投递",
  "岗位类型判断",
  "纯执行岗",
  "高级执行岗",
  "策略执行结合岗",
  "项目负责人岗",
  "管理岗",
  "纯执行风险",
  "低",
  "中",
  "高",
  "工作强度风险",
  "正常",
  "偏忙",
  "高压",
  "明显996风险",
  "薪资城市适配",
  "符合",
  "待确认",
  "不符合",
  "个性化判断理由",
  "风险提醒",
  "需要确认岗位是否有实际项目 owner 权限，避免责任大于资源",
  "打招呼话术",
  "推荐",
  "补充要求",
  "优化选中话术",
  "更多分析",
  "匹配分析",
  "简历微调",
  "面试问题",
  "AI运营能力",
  "用户增长经验",
  "Agent项目经验",
  "私域/社群运营",
  "Boss直聘",
  "业务主管",
  "老板/创始人",
  "当前使用：投递版简历",
  "总投递数",
  "已回复",
  "回复率",
  "待跟进数",
  "已约面数",
  "已拒绝数",
  "全部",
  "已投递",
  "已回复",
  "待跟进",
  "已约面",
  "已拒绝",
  "放弃",
  "当前状态",
  "投递日期",
  "下次跟进",
  "岗位链接",
  "备注",
  "操作",
  "删除",
  "GenerateRequest",
  "GenerateResult",
  "GenerateMeta",
  "Platform",
  "Recipient",
  "FocusArea",
  "PersonalPreferences",
  "targetCities",
  "workModes",
  "ScriptType",
  "ApplicationRecord",
  "ApplicationStatus",
  "normalizeGenerateResult",
  "meta",
  "provider",
  "model",
  "isMock",
  "generatedAt",
];

for (const text of requiredText) {
  assert(generatedSource.includes(text), `generated UI source should include "${text}"`);
}

function assertOrder(content, first, second, label) {
  const firstIndex = content.indexOf(first);
  const secondIndex = content.indexOf(second);
  assert(firstIndex >= 0, `${label}: missing "${first}"`);
  assert(secondIndex >= 0, `${label}: missing "${second}"`);
  assert(
    firstIndex < secondIndex,
    `${label}: "${first}" should appear before "${second}"`,
  );
}

const inputWorkspace = page.slice(page.indexOf("<section className=\"workbench-panel input-workbench\""));
const outputWorkspace = page.slice(page.indexOf("<section className=\"workbench-panel output-workbench\""));

assert(
  !inputWorkspace.includes("<h3 className=\"module-title\">岗位类型</h3>"),
  "input workbench should not ask users to manually choose 岗位类型",
);
assert(
  !inputWorkspace.includes("<h3 className=\"module-title\">工作强度风险</h3>"),
  "input workbench should not ask users to manually choose 工作强度风险",
);

assertOrder(inputWorkspace, "岗位 JD", "基础信息", "input workbench order");
assertOrder(inputWorkspace, "基础信息", "投递平台", "input workbench order");
assertOrder(inputWorkspace, "投递平台", "投递对象", "input workbench order");
assertOrder(inputWorkspace, "投递对象", "强调方向", "input workbench order");
assertOrder(inputWorkspace, "强调方向", "个人筛选偏好", "input workbench order");
assertOrder(inputWorkspace, "个人筛选偏好", "当前使用：投递版简历", "input workbench order");
assertOrder(inputWorkspace, "当前使用：投递版简历", "生成投递方案", "input workbench order");
assertOrder(outputWorkspace, "当前岗位摘要", "岗位筛选判断", "output workbench order");
assertOrder(outputWorkspace, "岗位筛选判断", "打招呼话术", "output workbench order");
assertOrder(outputWorkspace, "打招呼话术", "补充要求", "output workbench order");
assertOrder(outputWorkspace, "补充要求", "更多分析", "output workbench order");

for (const path of forbiddenPaths) {
  assert(!existsSync(path), `${path} should not exist`);
}

for (const path of [mockPath, normalizePath, typePath, applicationTypePath]) {
  assert(existsSync(path), `${path} should exist`);
}

const forbiddenUiPatterns = [
  "h-screen",
  "overflow-hidden",
  "overflow: hidden",
  "position: sticky",
];

for (const pattern of forbiddenUiPatterns) {
  assert(!page.includes(pattern), `app/page.tsx should not include ${pattern}`);
  assert(!css.includes(pattern), `app/globals.css should not include ${pattern}`);
}

assert(
  css.includes("width: min(1280px"),
  "app/globals.css should keep the workbench max-width around 1280px",
);
assert(
  css.includes("grid-template-columns: 1fr 1fr"),
  "app/globals.css should use a symmetric 1fr 1fr workbench grid",
);
assert(
  css.includes("align-items: stretch"),
  "app/globals.css should stretch the symmetric panels to equal height",
);
assert(
  css.includes("height: calc(100vh - 180px)"),
  "app/globals.css should keep both workbench panels at a fixed viewport-relative height",
);
assert(
  css.includes("min-height: 720px"),
  "app/globals.css should keep both workbench panels visually substantial",
);
assert(
  css.includes("flex: 1"),
  "app/globals.css should make panel bodies flex to fill the fixed panel height",
);
assert(
  css.includes("height: 76px"),
  "app/globals.css should keep panel footers at an identical fixed height",
);
assert(
  css.includes("align-items: center"),
  "app/globals.css should vertically center the fixed footer button rows",
);
assert(
  css.includes("grid-template-columns: 1fr 120px"),
  "app/globals.css should use identical 1fr 120px footer button columns",
);
assert(
  css.includes("--accent: #059669"),
  "app/globals.css should use green as the primary color",
);
assert(
  css.includes("--accent-soft: #ecfdf5"),
  "app/globals.css should use a light green selected background",
);
assert(
  css.includes("records-table"),
  "app/globals.css should style the records page as a lightweight table",
);
assert(
  css.includes("overflow-y: auto"),
  "app/globals.css should allow internal scrolling inside panel bodies or tab content",
);

for (const panelPart of ["panel-header", "panel-body", "panel-footer"]) {
  assert(page.includes(panelPart), `app/page.tsx should use ${panelPart}`);
}

for (const storageTerm of [
  "APPLICATION_RECORDS_KEY",
  "localStorage",
  "saveCurrentApplication",
  "generatedResult",
  "generateApplicationPlan",
  "displayResult",
  "normalizeGenerateResult",
  "salaryNegotiable",
  "selectedCity",
  "selectedWorkMode",
  "updateRecordStatus",
  "updateRecordNotes",
  "deleteRecord",
]) {
  assert(page.includes(storageTerm), `app/page.tsx should include ${storageTerm}`);
}

for (const duplicatedType of [
  "type ApplicationRecord =",
  "type ApplicationStatus =",
  "function isGenerateResult",
]) {
  assert(!page.includes(duplicatedType), `app/page.tsx should not locally define ${duplicatedType}`);
}

const generateTypes = readFileSync(typePath, "utf8");
for (const typeTerm of [
  "export type Platform",
  "export type Recipient",
  "export type FocusArea",
  "export type PersonalPreferences",
  "export type GenerateMeta",
  "export type JobPriority",
  "export type Recommendation",
  "export type JobType",
  "export type RiskLevel",
  "export type WorkloadRisk",
  "export type FitStatus",
  "export type ScriptType",
  "targetCities?: string[]",
  "workModes?: string[]",
  "jobDescription: string",
]) {
  assert(generateTypes.includes(typeTerm), `types/generate.ts should include ${typeTerm}`);
}

const applicationTypes = readFileSync(applicationTypePath, "utf8");
for (const typeTerm of [
  "export type ApplicationStatus",
  "export type ApplicationRecord",
  "jobJudgement?: JobJudgement",
  "scripts?: OutreachScripts",
  "analysis?: GenerateAnalysis",
  "resumeSuggestions?: string[]",
  "interviewQuestions?: string[]",
]) {
  assert(applicationTypes.includes(typeTerm), `types/application.ts should include ${typeTerm}`);
}

const normalizeSource = readFileSync(normalizePath, "utf8");
for (const normalizeTerm of [
  "export function normalizeGenerateResult",
  "priority: normalizeEnum",
  "recommendation: normalizeEnum",
  "recommended: normalizeEnum",
  "keywords: normalizeStringArray",
  "resume_suggestions: normalizeStringArray",
  "interview_questions: normalizeStringArray",
]) {
  assert(normalizeSource.includes(normalizeTerm), `lib/normalizeGenerateResult.ts should include ${normalizeTerm}`);
}

const forbiddenUiText = [
  "邮件",
  "推荐使用话术",
  "推荐平台：Boss直聘",
  "推荐对象：HR",
  "话术长度：约 100 字",
  "全部话术版本",
  "重新生成局部话术",
  "是否适合我",
  "是否偏纯执行",
  "是否值得定制话术",
  "岗位判断卡",
];

for (const text of forbiddenUiText) {
  assert(!page.includes(text), `app/page.tsx should not include "${text}"`);
}

const forbiddenBlueColors = [
  "#2563eb",
  "#1d4ed8",
  "#eff6ff",
  "#eef2ff",
  "#3730a3",
  "rgba(37, 99, 235",
];

for (const color of forbiddenBlueColors) {
  assert(!css.includes(color), `app/globals.css should not use old blue color ${color}`);
}

const expectedMessageTitles = ["HR版", "猎头版", "业务主管版", "老板/创始人版"];
for (const title of expectedMessageTitles) {
  assert(page.includes(title), `app/page.tsx should include "${title}"`);
}

assert(
  css.includes("border-radius: 16px"),
  "app/globals.css should use rounded large workbench panels",
);

const sourceFiles = [
  ...listFiles(join(root, "app")),
  ...listFiles(join(root, "components")),
  ...listFiles(join(root, "lib")),
].filter((path) => /\.(ts|tsx|js|jsx)$/.test(path));

const forbiddenTerms = [
  "VOLC",
  "ARK_API",
  "OPENAI_API_KEY",
  "process.env",
  "createClient",
  "database",
];

for (const file of sourceFiles) {
  const content = readFileSync(file, "utf8");
  for (const term of forbiddenTerms) {
    assert(!content.includes(term), `${file} should not include ${term}`);
  }
}

console.log("Static UI constraints look good.");
