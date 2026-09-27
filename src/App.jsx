import { useState } from "react";

const DIMS = [
  { key: "resonance", label: "Resonance", color: "pink", desc: "Emotional pull — does it make someone feel something?" },
  { key: "relevance", label: "Relevance", color: "blue", desc: "Strategic fit — does it advance a business priority?" },
  { key: "rarity", label: "Rarity", color: "purple", desc: "Surprise factor — is this unexpected or counterintuitive?" },
  { key: "relatability", label: "Relatability", color: "yellow", desc: "Clarity — would someone outside your company get it instantly?" },
  { key: "riskReward", label: "Risk / Reward", color: "red", desc: "Boldness — does it say something most companies wouldn't?" },
];

const DIM_COLORS = {
  pink: "bg-pink-400", blue: "bg-blue-400", purple: "bg-purple-400",
  yellow: "bg-yellow-400", red: "bg-red-400",
};
const DIM_TEXT = {
  pink: "text-pink-400", blue: "text-blue-400", purple: "text-purple-400",
  yellow: "text-yellow-400", red: "text-red-400",
};

const SEED_STORIES = [
  {
    id: 1, scored: true,
    title: "Junior Engineer Fixes Critical Bug on Day 3",
    raw: "New hire Sarah discovered and patched a security vulnerability during her first week that could have exposed 50K users.",
    source: "Slack #engineering", age: "2 hours ago",
    score: 87, trend: "rising",
    dims: { resonance: 19, relevance: 16, rarity: 18, relatability: 17, riskReward: 17 },
    rationale: {
      resonance: "Pride, surprise, and the underdog arc — new hire saves the day is a genuinely moving story.",
      relevance: "Directly supports talent brand and security credibility narratives.",
      rarity: "A junior fix on day 3 is rare enough to stop the scroll.",
      relatability: "Everyone remembers first-week nerves. Universally understood.",
      riskReward: "Shows vulnerability (we had a bug) and strength (we caught it). That tension is valuable.",
    },
    nextStep: "This story is 2 hours old. Urgency modifier: 3/5. Draft a LinkedIn post today before the moment cools — Sarah is available for a quote.",
    audience: "Engineering recruiting, security buyers, culture storytelling",
    formats: ["LinkedIn story", "Recruiting video", "All-hands slide"],
  },
  {
    id: 2, scored: true,
    title: "Hospital Cuts ER Wait Times 67% With Our Platform",
    raw: "Regional hospital reduced emergency room wait times from 4.2 hours to 1.4 hours. Patient satisfaction hit 4.9/5.",
    source: "Customer call transcript", age: "1 day ago",
    score: 94, trend: "rising",
    dims: { resonance: 20, relevance: 19, rarity: 17, relatability: 18, riskReward: 20 },
    rationale: {
      resonance: "This story saves lives. That's the highest emotional register possible.",
      relevance: "Perfect timing for healthcare vertical expansion.",
      rarity: "67% reduction is a dramatic, measurable result — not easy to dismiss.",
      relatability: "Everyone has waited in an ER. The stakes are visceral and immediate.",
      riskReward: "Healthcare outcomes are high-stakes territory. Publishing this takes confidence.",
    },
    nextStep: "Highest-value story in the feed. Urgency modifier: 4/5. Begin HIPAA review and customer approval process today — this belongs in your next investor update and sales deck.",
    audience: "Healthcare prospects, investors, PR targets",
    formats: ["Case study", "Conference keynote", "PR announcement", "Sales deck"],
  },
  {
    id: 3, scored: true,
    title: "Part-Time Montana Contractor Saves $400K",
    raw: "A part-time contractor working remotely from rural Montana found a cloud infrastructure inefficiency saving $400K annually.",
    source: "Finance team email", age: "3 days ago",
    score: 76, trend: "stable",
    dims: { resonance: 15, relevance: 18, rarity: 14, relatability: 16, riskReward: 13 },
    rationale: {
      resonance: "Good underdog energy but lacks a personal arc — we don't know enough about the contractor yet.",
      relevance: "Strong fit for remote work culture and cost-efficiency narratives.",
      rarity: "Cost savings are common. The Montana detail adds color but doesn't transform the story.",
      relatability: "Remote work resonates broadly in 2025.",
      riskReward: "Safe story. Well-told but unlikely to provoke strong reaction either way.",
    },
    nextStep: "Evergreen — no urgency pressure. Spend 30 minutes getting the contractor's personal backstory. The Montana detail could become the whole story with the right angle.",
    audience: "Remote work advocates, cost-conscious buyers, talent acquisition",
    formats: ["Blog post", "Internal newsletter", "LinkedIn"],
  },
];

function scoreColor(s) {
  if (s >= 90) return "text-green-400";
  if (s >= 75) return "text-yellow-400";
  if (s >= 60) return "text-orange-400";
  return "text-gray-400";
}

function ScoreBar({ value, colorClass }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5">
      <div className={`h-1.5 rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${(value / 20) * 100}%` }} />
    </div>
  );
}

function StoryCard({ story, onSelect, selected }) {
  return (
    <div onClick={() => onSelect(story)}
      className={`rounded-lg p-4 cursor-pointer border transition-all duration-200 ${
        selected ? "border-teal-500 bg-gray-700/60" : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
      }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-sm leading-snug">{story.title}</h3>
          <div className="text-xs text-gray-500 mt-1">{story.source} · {story.age}</div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-2xl font-bold ${scoreColor(story.score)}`}>{story.score}</div>
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className={`text-xs ${story.trend === "rising" ? "text-green-400" : "text-red-400"}`}>
              {story.trend === "rising" ? "↑" : "↓"}
            </span>
            <span className="text-xs text-gray-500">signal</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed mb-3">{story.raw}</p>
      <div className="grid grid-cols-5 gap-1">
        {DIMS.map(d => (
          <div key={d.key} className="space-y-1">
            <ScoreBar value={story.dims[d.key]} colorClass={DIM_COLORS[d.color]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DeepDive({ story }) {
  const [openDim, setOpenDim] = useState(null);
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold leading-snug">{story.title}</h2>
          <div className="text-xs text-gray-500 mt-1">{story.source} · {story.age}</div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <div className={`text-4xl font-bold ${scoreColor(story.score)}`}>{story.score}</div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase mb-3">Score Breakdown</div>
        <div className="space-y-2">
          {DIMS.map(d => (
            <div key={d.key} className="bg-gray-800 rounded-lg overflow-hidden">
              <button onClick={() => setOpenDim(openDim === d.key ? null : d.key)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm">{d.label}</span>
                  <div className="flex-1 max-w-32">
                    <ScoreBar value={story.dims[d.key]} colorClass={DIM_COLORS[d.color]} />
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className={`text-sm font-bold ${DIM_TEXT[d.color]}`}>{story.dims[d.key]}/20</span>
                  <span className="text-gray-400 text-xs">{openDim === d.key ? "▲" : "▼"}</span>
                </div>
              </button>
              {openDim === d.key && (
                <div className="px-4 pb-3 text-xs text-gray-300 border-t border-gray-700 pt-3">
                  <div className="text-gray-500 mb-1 italic">{d.desc}</div>
                  {story.rationale[d.key]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-teal-900/30 border border-teal-500/30 rounded-lg p-4">
        <div className="text-xs font-semibold text-teal-400 uppercase mb-2">Recommended Next Step</div>
        <p className="text-sm text-gray-200 leading-relaxed">{story.nextStep}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Audience Fit</div>
          <p className="text-xs text-gray-300">{story.audience}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Format Potential</div>
          <div className="flex flex-wrap gap-1">
            {story.formats.map(f => (
              <span key={f} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddStoryPanel({ onAdd, onClose }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleScore() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-calls": "true",
},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a narrative intelligence engine. Score this story signal using the Story Signal Score framework. Return ONLY valid JSON, no markdown, no explanation outside the JSON.

Story text: "${text}"

Score each dimension out of 20 and provide a one-sentence rationale for each score. Also generate a title (max 10 words), recommended next step (2-3 sentences, specific and opinionated), audience fit (one line), and 3 format suggestions.

JSON schema:
{
  "title": "string",
  "score": number (sum of all 5 dims),
  "trend": "rising" | "stable" | "falling",
  "dims": {
    "resonance": number,
    "relevance": number,
    "rarity": number,
    "relatability": number,
    "riskReward": number
  },
  "rationale": {
    "resonance": "string",
    "relevance": "string",
    "rarity": "string",
    "relatability": "string",
    "riskReward": "string"
  },
  "nextStep": "string",
  "audience": "string",
  "formats": ["string", "string", "string"]
}`
          }]
        })
      });
      const data = await res.json();
      const raw = data.content.find(b => b.type === "text")?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      onAdd({
        ...parsed,
        id: Date.now(),
        scored: true,
        raw: text,
        source: "Manual input",
        age: "Just now",
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-800 border border-teal-500/40 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm text-teal-400">Score a New Signal</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg leading-none">×</button>
      </div>
      <p className="text-xs text-gray-400 mb-3">Paste a Slack message, customer quote, support ticket — anything with a story in it.</p>
      <textarea
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 resize-none focus:outline-none focus:border-teal-500 transition-colors"
        rows={4}
        placeholder="e.g. 'Just got off the phone with the Acme team — their VP literally cried when she saw the demo results...'"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleScore}
        disabled={!text.trim() || loading}
        className="mt-3 w-full bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? "Scoring…" : "Score This Signal"}
      </button>
    </div>
  );
}

export default function App() {
  const [stories, setStories] = useState(SEED_STORIES);
  const [selected, setSelected] = useState(SEED_STORIES[1]);
  const [addOpen, setAddOpen] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const filtered = stories.filter(s => s.score >= minScore).sort((a, b) => b.score - a.score);

  function handleAdd(story) {
    setStories(prev => [story, ...prev]);
    setSelected(story);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Top bar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            Story Signal
          </span>
          <span className="text-gray-500 text-sm ml-3">Narrative Intelligence</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Min score:</span>
            <input type="range" min="0" max="90" step="5" value={minScore}
              onChange={e => setMinScore(+e.target.value)}
              className="w-20 accent-teal-500" />
            <span className="text-white w-6">{minScore}</span>
          </div>
          <div className="text-xs text-gray-500">{filtered.length} signal{filtered.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Feed */}
        <div className="w-96 shrink-0 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {/* Add signal button / panel */}
            {addOpen
              ? <AddStoryPanel onAdd={handleAdd} onClose={() => setAddOpen(false)} />
              : <button onClick={() => setAddOpen(true)}
                  className="w-full border border-dashed border-gray-600 hover:border-teal-500 hover:text-teal-400 text-gray-500 text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  + Add a signal to score
                </button>
            }

            {filtered.map(s => (
              <StoryCard key={s.id} story={s} selected={selected?.id === s.id} onSelect={setSelected} />
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-12">
                No stories above score {minScore}. Lower the filter.
              </div>
            )}
          </div>
        </div>

        {/* Right — Deep Dive */}
        <div className="flex-1 overflow-y-auto p-8">
          {selected
            ? <DeepDive story={selected} />
            : <div className="flex items-center justify-center h-full text-gray-600">
                Select a story to see its Signal Score analysis
              </div>
          }
        </div>
      </div>
    </div>
  );
}
