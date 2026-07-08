"use client";

import { Clipboard, FileText, Link2, Save, Send, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const APPLICATION_RECORDS_KEY = "ai-apply-assistant:application-records";

const platforms = ["Boss直聘", "猎聘", "拉勾", "其他"];
const targets = ["HR", "猎头", "业务主管", "老板/创始人"];
const focusOptions = [
  "AI运营能力",
  "用户增长经验",
  "Agent项目经验",
  "私域/社群运营",
  "内容运营",
  "数据复盘",
  "项目管理",
  "业务理解",
];
const defaultFocus = ["AI运营能力", "用户增长经验", "Agent项目经验"];

const statusOptions = ["已投递", "已回复", "待跟进", "已约面", "已拒绝", "放弃"] as const;
const filterOptions = ["全部", ...statusOptions] as const;

const hrMessage =
  "你好，我关注到这个 AI 运营岗位，岗位中提到用户增长、AI工具和运营提效，这和我过往的用户增长、私域运营经验，以及正在搭建的 AI Agent 项目比较匹配。想进一步沟通这个机会。";

const messages = [
  {
    title: "HR版",
    recommended: true,
    text: hrMessage,
  },
  {
    title: "猎头版",
    recommended: false,
    text: "你好，我目前重点关注 AI 运营、用户增长和运营提效方向。我的经历里有社区团购、私域转化和数据复盘，同时在做 AI Agent 项目实践，如果这个岗位重视业务理解和工具落地，我觉得匹配度较高。",
  },
  {
    title: "业务主管版",
    recommended: false,
    text: "你好，我对这个 AI 运营岗位很感兴趣。我比较擅长从业务流程里找增长和提效空间，也有用户增长、私域运营、数据复盘经验，最近在搭建 AI Agent 项目，希望能把 AI 工具真正用到运营场景里。",
  },
  {
    title: "老板/创始人版",
    recommended: false,
    text: "你好，我关注到贵司正在招聘 AI 运营。我过往做过用户增长、私域运营和项目推进，也在实践 AI Agent，希望能从业务需求出发，用 AI 提升运营效率和转化效果，期待有机会聊聊。",
  },
];

const matchPoints = [
  "有用户增长和社区团购运营经验",
  "有私域运营和团长运营经验",
  "正在搭建 AI Agent 项目",
];

const resumeTips = [
  "将 AI Agent 项目放到个人优势或项目经历中",
  "强化用户增长、私域转化、数据复盘关键词",
  "对目标岗位补充更贴近 JD 的一句个人定位",
];

const interviewQuestions = [
  "你为什么想转向 AI 运营？",
  "你做过哪些用户增长项目？",
  "你如何理解 AI Agent 在运营场景中的价值？",
  "你如何判断一个岗位和自己是否匹配？",
  "如果让你设计一个运营提效工具，你会怎么做？",
];

type AnalysisTab = "match" | "resume" | "interview";
type ViewTab = "workbench" | "records";
type ApplicationStatus = (typeof statusOptions)[number];
type ApplicationFilter = (typeof filterOptions)[number];

type ApplicationRecord = {
  id: string;
  companyName: string;
  jobTitle: string;
  jobLink: string;
  platform: string;
  recipient: string;
  focusAreas: string[];
  recommendedScriptType: string;
  status: ApplicationStatus;
  appliedAt: string;
  lastContactAt: string;
  nextFollowUpAt: string;
  notes: string;
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getFollowUpDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return formatDate(date);
}

function isApplicationRecord(value: unknown): value is ApplicationRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<ApplicationRecord>;
  return Boolean(record.id && record.companyName && record.jobTitle && record.status);
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewTab>("workbench");
  const [selectedPlatform, setSelectedPlatform] = useState("Boss直聘");
  const [selectedTarget, setSelectedTarget] = useState("HR");
  const [selectedFocus, setSelectedFocus] = useState(defaultFocus);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [localPrompt, setLocalPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<AnalysisTab>("match");
  const [copiedTitle, setCopiedTitle] = useState("");
  const [records, setRecords] = useState<ApplicationRecord[]>([]);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ApplicationFilter>("全部");
  const [saveNotice, setSaveNotice] = useState("");

  useEffect(() => {
    try {
      const rawRecords = window.localStorage.getItem(APPLICATION_RECORDS_KEY);
      if (rawRecords) {
        const parsed = JSON.parse(rawRecords);
        if (Array.isArray(parsed)) {
          setRecords(parsed.filter(isApplicationRecord));
        }
      }
    } catch {
      setRecords([]);
    } finally {
      setIsStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    window.localStorage.setItem(APPLICATION_RECORDS_KEY, JSON.stringify(records));
  }, [isStorageReady, records]);

  const allMessageText = useMemo(
    () => messages.map((message) => `${message.title}\n${message.text}`).join("\n\n"),
    [],
  );

  const visibleRecords = useMemo(
    () =>
      activeFilter === "全部"
        ? records
        : records.filter((record) => record.status === activeFilter),
    [activeFilter, records],
  );

  const stats = useMemo(() => {
    const total = records.length;
    const replied = records.filter((record) => ["已回复", "已约面"].includes(record.status)).length;
    const waiting = records.filter((record) => record.status === "待跟进").length;
    const interviewing = records.filter((record) => record.status === "已约面").length;
    const rejected = records.filter((record) => record.status === "已拒绝").length;

    return {
      total,
      replied,
      replyRate: total > 0 ? `${Math.round((replied / total) * 100)}%` : "0%",
      waiting,
      interviewing,
      rejected,
    };
  }, [records]);

  function toggleFocus(option: string) {
    setSelectedFocus((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function clearForm() {
    setCompanyName("");
    setJobTitle("");
    setJobLink("");
    setResumeText("");
    setJdText("");
    setLocalPrompt("");
    setSelectedPlatform("Boss直聘");
    setSelectedTarget("HR");
    setSelectedFocus(defaultFocus);
    setCopiedTitle("");
    setSaveNotice("");
  }

  function saveCurrentApplication() {
    const today = formatDate(new Date());
    const record: ApplicationRecord = {
      id: `application-${Date.now()}`,
      companyName: companyName.trim() || "某 AI 公司",
      jobTitle: jobTitle.trim() || "AI 运营",
      jobLink: jobLink.trim() || "https://example.com/jobs/ai-ops",
      platform: selectedPlatform,
      recipient: selectedTarget,
      focusAreas: selectedFocus,
      recommendedScriptType: "HR版",
      status: "已投递",
      appliedAt: today,
      lastContactAt: today,
      nextFollowUpAt: getFollowUpDate(),
      notes:
        localPrompt.trim() ||
        "已保存推荐 HR 话术，可根据回复情况更新状态和下次跟进。",
    };

    setRecords((current) => [record, ...current]);
    setSaveNotice("已保存到投递记录");
    setActiveView("records");
    window.setTimeout(() => setSaveNotice(""), 1800);
  }

  function updateRecordStatus(recordId: string, status: ApplicationStatus) {
    const today = formatDate(new Date());
    setRecords((current) =>
      current.map((record) =>
        record.id === recordId
          ? {
              ...record,
              status,
              lastContactAt: today,
              nextFollowUpAt: status === "待跟进" ? getFollowUpDate() : record.nextFollowUpAt,
            }
          : record,
      ),
    );
  }

  function updateRecordNotes(recordId: string, notes: string) {
    setRecords((current) =>
      current.map((record) => (record.id === recordId ? { ...record, notes } : record)),
    );
  }

  function deleteRecord(recordId: string) {
    setRecords((current) => current.filter((record) => record.id !== recordId));
  }

  async function copyText(title: string, text: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.top = "-1000px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedTitle(title);
      window.setTimeout(() => setCopiedTitle(""), 1600);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "-1000px";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedTitle(copied ? title : "");
      if (copied) {
        window.setTimeout(() => setCopiedTitle(""), 1600);
      }
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <h1 className="app-title">AI 智能投递助手</h1>
          <p className="app-subtitle">高频投递前的生成、复制与轻量记录工作台</p>
        </div>
        <div className="status-group" aria-label="当前原型状态">
          <span className="status-pill">UI 原型</span>
          <span className="status-pill is-muted">未接 API</span>
        </div>
      </header>

      <nav className="view-tabs" aria-label="主视图切换">
        <button
          className={`view-tab ${activeView === "workbench" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveView("workbench")}
        >
          工作台
        </button>
        <button
          className={`view-tab ${activeView === "records" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveView("records")}
        >
          投递记录
        </button>
      </nav>

      {activeView === "workbench" ? (
        <div className="workbench-grid">
          <section className="workbench-panel input-workbench" aria-label="输入工作台">
            <div className="panel-header">
              <div className="panel-heading">
                <h2>输入信息</h2>
                <p>粘贴岗位 JD，选择投递场景，生成可直接复制的话术。</p>
              </div>
            </div>

            <div className="panel-body">
              <label className="field module-block">
                <span className="module-title">岗位 JD</span>
                <textarea
                  className="text-area jd-area"
                  value={jdText}
                  onChange={(event) => setJdText(event.target.value)}
                  placeholder="粘贴岗位 JD，包括岗位职责、任职要求、加分项等"
                />
              </label>

              <section className="module-block" aria-label="基础信息">
                <h3 className="module-title">基础信息</h3>
                <div className="field-grid compact-fields">
                  <label className="field">
                    <span className="field-label">公司名称</span>
                    <input
                      className="text-input"
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      placeholder="某 AI 公司"
                    />
                  </label>
                  <label className="field">
                    <span className="field-label">岗位名称</span>
                    <input
                      className="text-input"
                      value={jobTitle}
                      onChange={(event) => setJobTitle(event.target.value)}
                      placeholder="AI 运营"
                    />
                  </label>
                  <label className="field full-row">
                    <span className="field-label">岗位链接</span>
                    <input
                      className="text-input"
                      value={jobLink}
                      onChange={(event) => setJobLink(event.target.value)}
                      placeholder="粘贴岗位链接"
                    />
                  </label>
                </div>
              </section>

              <section className="module-block">
                <h3 className="module-title">投递平台</h3>
                <div className="chip-list" aria-label="投递平台选择">
                  {platforms.map((platform) => (
                    <button
                      className={`chip ${selectedPlatform === platform ? "is-selected" : ""}`}
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      type="button"
                      aria-pressed={selectedPlatform === platform}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </section>

              <section className="module-block">
                <h3 className="module-title">投递对象</h3>
                <div className="chip-list" aria-label="投递对象选择">
                  {targets.map((target) => (
                    <button
                      className={`chip ${selectedTarget === target ? "is-selected" : ""}`}
                      key={target}
                      onClick={() => setSelectedTarget(target)}
                      type="button"
                      aria-pressed={selectedTarget === target}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </section>

              <section className="module-block">
                <h3 className="module-title">强调方向</h3>
                <div className="chip-list" aria-label="强调方向选择">
                  {focusOptions.map((option) => (
                    <button
                      className={`chip ${selectedFocus.includes(option) ? "is-selected" : ""}`}
                      key={option}
                      onClick={() => toggleFocus(option)}
                      type="button"
                      aria-pressed={selectedFocus.includes(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>

              <details className="resume-collapse module-block">
                <summary>
                  <span>
                    <FileText size={15} aria-hidden="true" />
                    当前使用：投递版简历
                  </span>
                  <span className="summary-action">展开编辑</span>
                </summary>
                <textarea
                  className="text-area resume-area"
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  placeholder="粘贴你的简历文本，建议使用投递版简历内容。"
                />
              </details>
            </div>

            <div className="panel-footer">
              <div className="button-row">
                <button className="primary-button" type="button">
                  <Send size={16} aria-hidden="true" />
                  生成投递方案
                </button>
                <button className="secondary-button" onClick={clearForm} type="button">
                  <Trash2 size={16} aria-hidden="true" />
                  清空内容
                </button>
              </div>
            </div>
          </section>

          <section className="workbench-panel output-workbench" aria-label="输出工作台">
            <div className="panel-header">
              <div className="panel-heading">
                <h2>生成结果</h2>
                <p>优先展示可复制话术，其它分析作为辅助信息。</p>
              </div>
            </div>

            <div className="panel-body">
              <section className="summary-strip" aria-label="当前岗位摘要">
                <span>当前岗位摘要</span>
                <strong>某 AI 公司｜AI 运营｜Boss直聘｜HR｜建议优先级 A</strong>
              </section>

              <section className="module-block">
                <div className="section-row">
                  <h3 className="module-title">打招呼话术</h3>
                  <button
                    className="subtle-button"
                    type="button"
                    onClick={() => copyText("全部话术", allMessageText)}
                  >
                    <Clipboard size={14} aria-hidden="true" />
                    {copiedTitle === "全部话术" ? "已复制全部" : "复制全部"}
                  </button>
                </div>
                <div className="message-grid">
                  {messages.map((message) => (
                    <article
                      className={`message-card ${message.recommended ? "is-recommended" : ""}`}
                      key={message.title}
                    >
                      <div className="message-card-header">
                        <div className="message-title-row">
                          <h4>{message.title}</h4>
                          {message.recommended ? <span className="recommend-badge">推荐</span> : null}
                        </div>
                        <button
                          className="copy-button"
                          type="button"
                          onClick={() => copyText(message.title, message.text)}
                        >
                          <Clipboard size={14} aria-hidden="true" />
                          {copiedTitle === message.title ? "已复制" : "复制"}
                        </button>
                      </div>
                      <p>{message.text}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="local-tune module-block" aria-label="补充要求">
                <h3 className="module-title">补充要求</h3>
                <div className="local-tune-row">
                  <input
                    className="text-input"
                    value={localPrompt}
                    onChange={(event) => setLocalPrompt(event.target.value)}
                    placeholder="比如：语气更自然一点，控制在 80 字内，适合 Boss 直聘第一句话。"
                  />
                  <button className="secondary-button" type="button">
                    优化选中话术
                  </button>
                </div>
              </section>

              <section className="analysis-panel module-block" aria-label="更多分析">
                <h3 className="module-title">更多分析</h3>
                <div className="tab-list" role="tablist" aria-label="更多分析">
                  <button
                    className={`tab-button ${activeTab === "match" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("match")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "match"}
                  >
                    匹配分析
                  </button>
                  <button
                    className={`tab-button ${activeTab === "resume" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("resume")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "resume"}
                  >
                    简历微调
                  </button>
                  <button
                    className={`tab-button ${activeTab === "interview" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("interview")}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "interview"}
                  >
                    面试问题
                  </button>
                </div>

                {activeTab === "match" ? (
                  <div className="tab-content" role="tabpanel">
                    <div className="match-summary">
                      <span className="score-badge">匹配度：82%</span>
                      <div className="keyword-list" aria-label="核心关键词">
                        {["用户增长", "AI工具", "私域运营", "数据复盘"].map((keyword) => (
                          <span className="keyword" key={keyword}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="analysis-grid">
                      <div>
                        <h4>匹配点</h4>
                        <ul className="clean-list">
                          {matchPoints.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4>风险点</h4>
                        <ul className="clean-list risk-list">
                          <li>如果岗位偏技术，需要补充 AI 工具落地表达</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeTab === "resume" ? (
                  <div className="tab-content" role="tabpanel">
                    <ul className="clean-list">
                      {resumeTips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {activeTab === "interview" ? (
                  <div className="tab-content" role="tabpanel">
                    <ol className="question-list">
                      {interviewQuestions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </section>
            </div>

            <div className="panel-footer">
              <button className="primary-button full-width-button" type="button" onClick={saveCurrentApplication}>
                <Save size={16} aria-hidden="true" />
                保存到投递记录
              </button>
              <span className="save-notice" aria-live="polite">
                {saveNotice}
              </span>
            </div>
          </section>
        </div>
      ) : (
        <section className="records-view" aria-label="投递记录">
          <div className="records-header">
            <div>
              <h2>投递记录</h2>
              <p>记录已投递岗位、回复情况和下次跟进动作，只保留高频投递需要的信息。</p>
            </div>
            <button className="secondary-button" type="button" onClick={() => setActiveView("workbench")}>
              回到工作台
            </button>
          </div>

          <section className="stats-grid" aria-label="投递统计">
            <article className="stat-card">
              <span>总投递数</span>
              <strong>{stats.total}</strong>
            </article>
            <article className="stat-card">
              <span>已回复数</span>
              <strong>{stats.replied}</strong>
            </article>
            <article className="stat-card">
              <span>回复率</span>
              <strong>{stats.replyRate}</strong>
            </article>
            <article className="stat-card">
              <span>待跟进数</span>
              <strong>{stats.waiting}</strong>
            </article>
            <article className="stat-card">
              <span>已约面数</span>
              <strong>{stats.interviewing}</strong>
            </article>
            <article className="stat-card">
              <span>已拒绝数</span>
              <strong>{stats.rejected}</strong>
            </article>
          </section>

          <section className="records-toolbar" aria-label="状态筛选">
            <h3 className="module-title">状态筛选</h3>
            <div className="chip-list">
              {filterOptions.map((filter) => (
                <button
                  className={`chip ${activeFilter === filter ? "is-selected" : ""}`}
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                  aria-pressed={activeFilter === filter}
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>

          <section className="records-list" aria-label="投递记录列表">
            {visibleRecords.length === 0 ? (
              <div className="empty-state">
                <h3>还没有投递记录</h3>
                <p>在工作台保存当前岗位后，这里会显示公司、岗位、状态和跟进信息。</p>
                <button className="primary-button" type="button" onClick={() => setActiveView("workbench")}>
                  去工作台保存
                </button>
              </div>
            ) : (
              visibleRecords.map((record) => (
                <article className="record-card" key={record.id}>
                  <div className="record-main">
                    <div>
                      <h3>{record.companyName}</h3>
                      <p>{record.jobTitle}</p>
                    </div>
                    <label className="select-field">
                      <span>当前状态</span>
                      <select
                        value={record.status}
                        onChange={(event) =>
                          updateRecordStatus(record.id, event.target.value as ApplicationStatus)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="record-meta-grid">
                    <span>投递平台：{record.platform}</span>
                    <span>投递对象：{record.recipient}</span>
                    <span>推荐话术：{record.recommendedScriptType}</span>
                    <span>投递日期：{record.appliedAt}</span>
                    <span>下次跟进日期：{record.nextFollowUpAt}</span>
                    <span>强调方向：{record.focusAreas.join("、")}</span>
                  </div>

                  <div className="record-link-row">
                    <Link2 size={14} aria-hidden="true" />
                    <a href={record.jobLink} target="_blank" rel="noreferrer">
                      岗位链接
                    </a>
                  </div>

                  <label className="field">
                    <span className="field-label">备注</span>
                    <textarea
                      className="text-area notes-area"
                      value={record.notes}
                      onChange={(event) => updateRecordNotes(record.id, event.target.value)}
                      placeholder="记录回复情况、沟通要点或下次跟进计划。"
                    />
                  </label>

                  <div className="record-actions">
                    <button className="secondary-button danger-button" type="button" onClick={() => deleteRecord(record.id)}>
                      <Trash2 size={15} aria-hidden="true" />
                      删除
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      )}
    </main>
  );
}
