
import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Send,
  Plus,
  Trash2,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";

const MODEL = "claude-sonnet-4-6";

async function callClaude(system, userContent) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  if (!response.ok) throw new Error("The request failed. Please try again.");
  const data = await response.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function parseJSONResponse(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "email", label: "Email Generator", icon: Mail },
  { id: "notes", label: "Meeting Notes", icon: FileText },
  { id: "tasks", label: "Task Planner", icon: ListChecks },
  { id: "research", label: "Research Assistant", icon: Search },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
];

function Disclaimer({ compact }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      }`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>AI-generated content may require human review.</span>
    </div>
  );
}

function SpectrumBar({ className = "" }) {
  return (
    <div
      className={`h-1 w-full rounded-full ${className}`}
      style={{
        background: "linear-gradient(90deg, #7C3AED 0%, #6366F1 50%, #2563EB 100%)",
      }}
    />
  );
}

function PriorityBadge({ level }) {
  const map = {
    High: { bg: "#F3EEFF", fg: "#6B21A8", dot: "#7C3AED" },
    Medium: { bg: "#EEF2FF", fg: "#3730A3", dot: "#6366F1" },
    Low: { bg: "#EFF6FF", fg: "#1D4ED8", dot: "#2563EB" },
  };
  const c = map[level] || map.Medium;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {level}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p
          className="mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#7C3AED", fontFamily: "'JetBrains Mono', monospace" }}
        >
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-slate-500">{description}</p>}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      style={{ backgroundColor: "#1E1B4B" }}
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-semibold text-slate-600">{children}</label>;
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200";

/* ---------------- Dashboard ---------------- */

function Dashboard({ onNavigate }) {
  const features = [
    {
      id: "email",
      icon: Mail,
      title: "Smart Email Generator",
      desc: "Draft polished emails matched to tone and audience in seconds.",
    },
    {
      id: "notes",
      icon: FileText,
      title: "Meeting Notes Summarizer",
      desc: "Turn raw notes into key points, decisions, and action items.",
    },
    {
      id: "tasks",
      icon: ListChecks,
      title: "AI Task Planner",
      desc: "Prioritize your task list and get a suggested schedule.",
    },
    {
      id: "research",
      icon: Search,
      title: "AI Research Assistant",
      desc: "Get structured insights and summaries on any topic.",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "AI Chat",
      desc: "Ask anything and get a quick, professional answer.",
    },
  ];

  return (
    <div>
      <div
        className="mb-8 overflow-hidden rounded-2xl p-8 text-white"
        style={{ backgroundColor: "#1E1B4B" }}
      >
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Good to see you
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Let's clear the queue.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-300">
          Five focused tools for the work that eats your day — email, notes, planning,
          research, and a chat assistant for everything in between.
        </p>
        <SpectrumBar className="mt-6" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => onNavigate(f.id)}
            className="group text-left"
          >
            <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#F3EEFF" }}
              >
                <f.icon className="h-5 w-5" style={{ color: "#7C3AED" }} />
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">{f.desc}</p>
              <span
                className="mt-4 inline-flex items-center text-xs font-semibold group-hover:underline"
                style={{ color: "#7C3AED" }}
              >
                Open tool →
              </span>
            </Card>
          </button>
        ))}
        <Card className="flex h-full flex-col justify-between p-5">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              How this works
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Every tool uses a structured prompt built for its task, so outputs stay
              consistent and professional.
            </p>
          </div>
          <div className="mt-4">
            <Disclaimer compact />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Email Generator ---------------- */

function EmailGenerator() {
  const [audience, setAudience] = useState("Colleague");
  const [tone, setTone] = useState("Friendly");
  const [purpose, setPurpose] = useState("");
  const [length, setLength] = useState("Concise");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!purpose.trim()) {
      setError("Add a few key points or context first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const system = `You are an expert professional email writer embedded in a workplace productivity tool.
Write one email based on the audience, tone, and key points provided.
Rules:
- Match the requested tone and audience precisely.
- Keep it clear, well-structured, and free of filler.
- Length preference: ${length}.
- Respond ONLY with valid JSON in this exact shape, no markdown fences, no commentary:
{"subject": "string", "body": "string"}
- In "body", use \\n for line breaks and include a greeting and sign-off placeholder like [Your name].`;
    const user = `Audience: ${audience}\nTone: ${tone}\nKey points / context: ${purpose}`;
    try {
      const text = await callClaude(system, user);
      const parsed = parseJSONResponse(text);
      setResult(parsed);
    } catch (e) {
      setError("Couldn't generate the email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyEmail() {
    if (!result) return;
    navigator.clipboard?.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Feature 01"
        title="Smart Email Generator"
        description="Pick a tone and audience, add your key points, and get a ready-to-send draft."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <Label>Audience</Label>
              <select
                className={inputClass}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                {["Client", "Colleague", "Manager", "Executive", "Vendor"].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Tone</Label>
              <select className={inputClass} value={tone} onChange={(e) => setTone(e.target.value)}>
                {["Formal", "Friendly", "Direct", "Persuasive", "Apologetic"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Length</Label>
              <select className={inputClass} value={length} onChange={(e) => setLength(e.target.value)}>
                {["Concise", "Standard", "Detailed"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Key points / context</Label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-none`}
                placeholder="e.g. Following up on Tuesday's proposal, ask for a decision by Friday, offer a call this week."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <PrimaryButton onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate email
                </>
              )}
            </PrimaryButton>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          {!result && !loading && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-sm text-slate-400">
              <Mail className="mb-3 h-8 w-8" />
              Your generated email will appear here.
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          )}
          {result && !loading && (
            <div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Subject
                  </p>
                  <p className="font-display text-lg font-semibold text-slate-900">
                    {result.subject}
                  </p>
                </div>
                <button
                  onClick={copyEmail}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {result.body}
              </div>
              <div className="mt-4">
                <Disclaimer compact />
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Meeting Notes Summarizer ---------------- */

function NotesSummarizer() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function summarize() {
    if (!notes.trim()) {
      setError("Paste your meeting notes or transcript first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const system = `You are a meeting-notes summarization assistant for a workplace productivity tool.
Read the raw notes and extract a clean summary.
Rules:
- Be faithful to the source; do not invent decisions or owners that aren't implied.
- If no deadline or owner is stated for an action item, use "Not specified".
- Respond ONLY with valid JSON in this exact shape, no markdown fences, no commentary:
{"summary": "string (2-4 sentences)", "keyPoints": ["string", ...], "decisions": ["string", ...], "actionItems": [{"task": "string", "owner": "string", "deadline": "string"}]}`;
    try {
      const text = await callClaude(system, `Meeting notes:\n${notes}`);
      setResult(parseJSONResponse(text));
    } catch (e) {
      setError("Couldn't summarize these notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Feature 02"
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript to get key points, decisions, and action items."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Label>Raw meeting notes</Label>
          <textarea
            className={`${inputClass} min-h-[260px] resize-none`}
            placeholder="Paste your meeting notes or transcript here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
          <PrimaryButton onClick={summarize} disabled={loading} className="mt-4 w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Summarizing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Summarize notes
              </>
            )}
          </PrimaryButton>
        </Card>

        <Card className="p-6 lg:col-span-3">
          {!result && !loading && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-sm text-slate-400">
              <FileText className="mb-3 h-8 w-8" />
              Your summary will appear here.
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-full animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          )}
          {result && !loading && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Summary
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{result.summary}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Key points
                </p>
                <ul className="space-y-1.5">
                  {result.keyPoints?.map((k, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
              {result.decisions?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Decisions
                  </p>
                  <ul className="space-y-1.5">
                    {result.decisions.map((d, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#7C3AED" }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Action items
                </p>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Task</th>
                        <th className="px-3 py-2 text-left font-semibold">Owner</th>
                        <th className="px-3 py-2 text-left font-semibold">Deadline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.actionItems?.map((a, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-slate-700">{a.task}</td>
                          <td className="px-3 py-2 text-slate-500">{a.owner}</td>
                          <td className="px-3 py-2 text-slate-500">{a.deadline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Disclaimer compact />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Task Planner ---------------- */

function TaskPlanner() {
  const [tasks, setTasks] = useState([{ title: "", due: "", notes: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function updateTask(i, field, value) {
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));
  }
  function addTask() {
    setTasks((prev) => [...prev, { title: "", due: "", notes: "" }]);
  }
  function removeTask(i) {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function plan() {
    const valid = tasks.filter((t) => t.title.trim());
    if (valid.length === 0) {
      setError("Add at least one task.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const system = `You are an AI task planner in a workplace productivity tool.
Given a list of tasks (with optional due dates and notes), prioritize them and suggest a schedule.
Rules:
- Priority must be exactly one of "High", "Medium", "Low".
- suggestedTime should be a short, concrete slot like "Today, 9:00-10:00 AM" or "Tomorrow morning".
- reasoning should be one short sentence.
- Respond ONLY with valid JSON in this exact shape, no markdown fences, no commentary:
{"schedule": [{"task": "string", "priority": "High|Medium|Low", "suggestedTime": "string", "reasoning": "string"}]}
- Order the array by priority, highest first.`;
    const user = `Today's tasks:\n${valid
      .map((t, i) => `${i + 1}. ${t.title}${t.due ? ` (due: ${t.due})` : ""}${t.notes ? ` — ${t.notes}` : ""}`)
      .join("\n")}`;
    try {
      const text = await callClaude(system, user);
      setResult(parseJSONResponse(text));
    } catch (e) {
      setError("Couldn't build a schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Feature 03"
        title="AI Task Planner"
        description="List what's on your plate and get it prioritized and scheduled."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <Label>Tasks</Label>
          <div className="space-y-3">
            {tasks.map((t, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    placeholder="Task title"
                    value={t.title}
                    onChange={(e) => updateTask(i, "title", e.target.value)}
                  />
                  {tasks.length > 1 && (
                    <button
                      onClick={() => removeTask(i)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className={inputClass}
                    placeholder="Due (optional)"
                    value={t.due}
                    onChange={(e) => updateTask(i, "due", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Notes (optional)"
                    value={t.notes}
                    onChange={(e) => updateTask(i, "notes", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addTask}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add another task
          </button>
          {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
          <PrimaryButton onClick={plan} disabled={loading} className="mt-4 w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Planning…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Prioritize & schedule
              </>
            )}
          </PrimaryButton>
        </Card>

        <Card className="p-6 lg:col-span-3">
          {!result && !loading && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-sm text-slate-400">
              <ListChecks className="mb-3 h-8 w-8" />
              Your prioritized schedule will appear here.
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 w-full animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          )}
          {result && !loading && (
            <div className="space-y-3">
              {result.schedule?.map((s, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{s.task}</p>
                    <PriorityBadge level={s.priority} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-medium"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {s.suggestedTime}
                    </span>
                    <span>{s.reasoning}</span>
                  </div>
                </div>
              ))}
              <Disclaimer compact />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Research Assistant ---------------- */

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function research() {
    if (!topic.trim()) {
      setError("Enter a topic to research.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const system = `You are an AI research assistant in a workplace productivity tool.
Provide a structured, professional overview of the given topic based on your general knowledge.
Rules:
- Be balanced and clearly note where a claim is uncertain or context-dependent.
- Do not fabricate statistics, sources, or dates.
- Respond ONLY with valid JSON in this exact shape, no markdown fences, no commentary:
{"overview": "string (3-5 sentences)", "keyInsights": ["string", ...], "considerations": ["string", ...], "followUpQuestions": ["string", ...]}`;
    const user = `Topic: ${topic}${focus ? `\nFocus / angle: ${focus}` : ""}`;
    try {
      const text = await callClaude(system, user);
      setResult(parseJSONResponse(text));
    } catch (e) {
      setError("Couldn't complete the research. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Feature 04"
        title="AI Research Assistant"
        description="Get a structured overview, key insights, and follow-up questions on any topic."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-2">
          <div className="space-y-4">
            <div>
              <Label>Topic</Label>
              <input
                className={inputClass}
                placeholder="e.g. Hybrid work productivity trends"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <Label>Focus or angle (optional)</Label>
              <textarea
                className={`${inputClass} min-h-[100px] resize-none`}
                placeholder="e.g. Impact on mid-size engineering teams"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <PrimaryButton onClick={research} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Researching…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Get insights
                </>
              )}
            </PrimaryButton>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          {!result && !loading && (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center text-sm text-slate-400">
              <Search className="mb-3 h-8 w-8" />
              Your research summary will appear here.
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-full animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          )}
          {result && !loading && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Overview
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{result.overview}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Key insights
                </p>
                <ul className="space-y-1.5">
                  {result.keyInsights?.map((k, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "#7C3AED" }} />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Considerations
                </p>
                <ul className="space-y-1.5">
                  {result.considerations?.map((k, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "#6366F1" }} />
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Follow-up questions
                </p>
                <ul className="space-y-1.5">
                  {result.followUpQuestions?.map((k, i) => (
                    <li key={i} className="text-sm text-slate-700">
                      {i + 1}. {k}
                    </li>
                  ))}
                </ul>
              </div>
              <Disclaimer compact />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Chat ---------------- */

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your workplace assistant. Ask me to help draft something, think through a problem, or just talk through your day.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const system = `You are a helpful, professional AI assistant embedded in a workplace productivity tool.
Give clear, concise, well-organized answers appropriate for a professional context. Use plain text (no markdown headers).`;
    try {
      const text = await callClaude(
        system,
        next.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n")
      );
      setMessages((prev) => [...prev, { role: "assistant", content: text.trim() }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col">
      <SectionTitle eyebrow="Feature 05" title="AI Chat" description="A quick assistant for anything work-related." />
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "text-white" : "bg-slate-100 text-slate-800"
                }`}
                style={m.role === "user" ? { backgroundColor: "#1E1B4B" } : {}}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 p-3">
          <div className="mb-2">
            <Disclaimer compact />
          </div>
          <div className="flex items-center gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <PrimaryButton onClick={send} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- App shell ---------------- */

export default function App() {
  const [view, setView] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function navigate(id) {
    setView(id);
    setMobileNavOpen(false);
  }

  const views = {
    dashboard: <Dashboard onNavigate={navigate} />,
    email: <EmailGenerator />,
    notes: <NotesSummarizer />,
    tasks: <TaskPlanner />,
    research: <ResearchAssistant />,
    chat: <Chat />,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .font-display { font-family: 'Space Grotesk', 'Inter', sans-serif; }
      `}</style>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md text-white"
            style={{ backgroundColor: "#1E1B4B" }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-sm font-semibold">Workplace Assistant</span>
        </div>
        <button onClick={() => setMobileNavOpen((v) => !v)} className="rounded-lg p-2 hover:bg-slate-100">
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileNavOpen ? "block" : "hidden"
          } w-full shrink-0 border-b border-slate-200 bg-white lg:block lg:w-64 lg:border-b-0 lg:border-r lg:sticky lg:top-0 lg:h-screen`}
        >
          <div className="hidden items-center gap-2 border-b border-slate-100 px-6 py-5 lg:flex">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: "#1E1B4B" }}
            >
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold leading-none">Workplace</p>
              <p className="font-display text-sm font-semibold leading-none">Assistant</p>
            </div>
          </div>
          <nav className="space-y-1 p-3">
            {NAV_ITEMS.map((item) => {
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                      style={{
                        background: "linear-gradient(180deg, #7C3AED, #6366F1, #2563EB)",
                      }}
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto hidden p-4 lg:block">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
              Structured prompts power every tool for consistent, professional output.
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{views[view]}</main>
      </div>
    </div>
  );
}
