import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const pagePath = join(root, "app", "page.tsx");
const forbiddenPaths = [
  join(root, "app", "api"),
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
const requiredText = [
  "AI 智能投递助手",
  "UI 原型",
  "未接 API",
  "工作台",
  "投递记录",
  "生成投递方案",
  "清空内容",
  "保存到投递记录",
  "输入信息",
  "粘贴岗位 JD，选择投递场景，生成可直接复制的话术。",
  "生成结果",
  "优先展示可复制话术，其它分析作为辅助信息。",
  "当前岗位摘要",
  "某 AI 公司｜AI 运营｜Boss直聘｜HR｜建议优先级 A",
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
  "已回复数",
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
  "下次跟进日期",
  "岗位链接",
  "备注",
  "删除",
];

for (const text of requiredText) {
  assert(page.includes(text), `app/page.tsx should include "${text}"`);
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

assertOrder(inputWorkspace, "岗位 JD", "基础信息", "input workbench order");
assertOrder(inputWorkspace, "基础信息", "投递平台", "input workbench order");
assertOrder(inputWorkspace, "强调方向", "当前使用：投递版简历", "input workbench order");
assertOrder(inputWorkspace, "当前使用：投递版简历", "生成投递方案", "input workbench order");
assertOrder(outputWorkspace, "当前岗位摘要", "打招呼话术", "output workbench order");
assertOrder(outputWorkspace, "打招呼话术", "补充要求", "output workbench order");
assertOrder(outputWorkspace, "补充要求", "更多分析", "output workbench order");

for (const path of forbiddenPaths) {
  assert(!existsSync(path), `${path} should not exist`);
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
  "updateRecordStatus",
  "updateRecordNotes",
  "deleteRecord",
]) {
  assert(page.includes(storageTerm), `app/page.tsx should include ${storageTerm}`);
}

const forbiddenUiText = [
  "邮件",
  "推荐使用话术",
  "推荐平台：Boss直聘",
  "推荐对象：HR",
  "话术长度：约 100 字",
  "全部话术版本",
  "重新生成局部话术",
];

for (const text of forbiddenUiText) {
  assert(!page.includes(text), `app/page.tsx should not include "${text}"`);
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
  "/api/generate",
  "VOLC",
  "ARK_API",
  "OPENAI_API_KEY",
  "process.env",
  "fetch(",
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
