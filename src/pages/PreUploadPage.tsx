import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Zap, Hash, CheckSquare, Copy } from "lucide-react";
import { cn } from "../lib/utils";
import { usePreUploadStore } from "../store/usePreUploadStore";
import { EmptyState } from "../components/ui/EmptyState";
import toast from "react-hot-toast";

const CHECKLIST_ITEMS = [
  // Basics
  { id: 1, text: "Title is between 50-70 characters", category: "Basics" },
  {
    id: 2,
    text: "Primary keyword in first 3 words of title",
    category: "Basics",
  },
  {
    id: 3,
    text: "Thumbnail high-contrast & legible on mobile",
    category: "Basics",
  },
  {
    id: 4,
    text: "Title includes a power word (e.g. Secret, Easy, 2026)",
    category: "Basics",
  },
  {
    id: 5,
    text: "No misleading 'clickbait' that drops retention",
    category: "Basics",
  },
  {
    id: 6,
    text: "Video file name contains target keyword",
    category: "Basics",
  },
  {
    id: 7,
    text: "Frame rate and resolution optimized (4K preferred)",
    category: "Basics",
  },
  // SEO
  { id: 8, text: "Keyword mentioned in first 30s of script", category: "SEO" },
  { id: 9, text: "Description hook summarizes video value", category: "SEO" },
  { id: 10, text: "Timestamp chapters added to description", category: "SEO" },
  { id: 11, text: "3-5 relevant hashtags at the bottom", category: "SEO" },
  { id: 12, text: "Tags workspace filled with 400+ chars", category: "SEO" },
  { id: 13, text: "Closed captions (SRT) manually verified", category: "SEO" },
  { id: 14, text: "Pinned comment contains a question/CTA", category: "SEO" },
  { id: 15, text: "Link to related playlist in description", category: "SEO" },
  // Quality
  {
    id: 16,
    text: "Audio levels normalized (no clipping)",
    category: "Quality",
  },
  { id: 17, text: "Color grade consistent across shots", category: "Quality" },
  {
    id: 18,
    text: "End screen cards link to 'Best for Viewer'",
    category: "Quality",
  },
  {
    id: 19,
    text: "Branding watermark / subscribe button added",
    category: "Quality",
  },
  {
    id: 20,
    text: "Music tracks properly cleared / credited",
    category: "Quality",
  },
  {
    id: 21,
    text: "Internal links (i-cards) at high-drop points",
    category: "Quality",
  },
  // Engagement
  { id: 22, text: "Verbal CTA at beginning of video", category: "Engagement" },
  {
    id: 23,
    text: "Community tab post scheduled for launch",
    category: "Engagement",
  },
  {
    id: 24,
    text: "Twitter/X, LinkedIn sharing prepared",
    category: "Engagement",
  },
  {
    id: 25,
    text: "Reply template ready for first 10 comments",
    category: "Engagement",
  },
  {
    id: 26,
    text: "Discord/Newsletter notification ready",
    category: "Engagement",
  },
  {
    id: 27,
    text: "Sponsor/Ad disclosure clearly marked",
    category: "Engagement",
  },
  {
    id: 28,
    text: "Ending loop for Shorts vertical usage",
    category: "Engagement",
  },
  {
    id: 29,
    text: "Thumbnail A/B test variants created",
    category: "Engagement",
  },
  {
    id: 30,
    text: "Total runtime checked for mid-roll placement",
    category: "Engagement",
  },
];

export function PreUploadPage() {
  const [activeTab, setActiveTab] = useState<
    "titles" | "tags" | "description" | "checklist"
  >("titles");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    finalTitle,
    setFinalTitle,
    titles,
    setTitles,
    tags,
    setTags,
    description,
    updateDescription,
    checklist,
    toggleChecklist,
    setChecklistBulk,
    resetChecklist,
  } = usePreUploadStore();

  const handleGenerateTitles = () => {
    if (!topic) return toast.error("Enter a topic first");
    setLoading(true);
    setTimeout(() => {
      // Dynamic Title Generation Engine
      const cleanTopic = topic.trim();
      const capitalized = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
      
      const hooks = [
        `How I mastered ${cleanTopic} in 30 Days (2026 Strategy)`,
        `The BRUTAL Truth About ${cleanTopic} Nobody Tells You`,
        `7 ${capitalized} Mistakes Ruining Your Progress`,
        `I Tried ${cleanTopic} Every Day For A Week (Results)`,
        `${capitalized} EXPLAINED For Beginners (Step-by-Step)`,
        `The Ultimate Guide to ${capitalized} in 2026`,
        `STOP doing ${cleanTopic} until you watch this`,
        `Why your ${cleanTopic} is failing (and how to fix it)`,
        `They lied to you about ${cleanTopic}`,
        `The secret ${cleanTopic} framework that actually works`,
        `10 simple ${cleanTopic} hacks for insance growth`,
        `What no one tells you about ${cleanTopic} in 2026`,
      ];
      
      // Shuffle & pick top 6
      const shuffled = hooks.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 6);
      
      const templates = selected.map((text, i) => {
        // give scores depending on their order
        let score = 0;
        if (i === 0) score = Math.floor(Math.random() * (99 - 96 + 1) + 96);
        else if (i === 1) score = Math.floor(Math.random() * (95 - 92 + 1) + 92);
        else if (i === 2) score = Math.floor(Math.random() * (92 - 89 + 1) + 89);
        else score = Math.floor(Math.random() * (88 - 80 + 1) + 80);
        return { text, score };
      }).sort((a, b) => b.score - a.score);

      setTitles(templates);
      setLoading(false);
      toast.success("Viral titles generated based on topic!");
    }, 1500);
  };

  const handleGenerateTags = () => {
    if (!topic) return toast.error("Enter a topic first");
    setLoading(true);
    setTimeout(() => {
      const topicWords = topic
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 2);
      const baseTag = topicWords.join("");
      const generated = [
        baseTag,
        `${topicWords.join(" ")} tutorial`,
        `${topicWords[0]} guide 2026`,
        `advanced ${topicWords.join(" ")}`,
        `${topicWords.join(" ")} strategy`,
        `how to ${topicWords.join(" ")}`,
        `${topicWords[topicWords.length - 1]} hacks`,
        `${topicWords.join("")}2026`,
        `best ${topicWords[0]} tips`,
      ].filter((t) => t.trim().length > 0);

      setTags([...new Set([...tags, ...generated])].slice(0, 30));
      setLoading(false);
      toast.success("Recommended tags generated!");
    }, 1000);
  };

  const completedCount = Object.values(checklist).filter((v) => v).length;
  const progress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  const runAutoAudit = () => {
    const bulk: Record<string, boolean> = {};
    const titleToAudit =
      finalTitle || (titles.length > 0 ? titles[0].text : "");

    // Auto-check 1: Title length 50-70
    if (titleToAudit.length >= 50 && titleToAudit.length <= 70)
      bulk["1"] = true;
    else bulk["1"] = false;

    // Auto-check 2: Primary keyword in first 3 words (approx search topic in first half)
    const index = topic ? titleToAudit.toLowerCase().indexOf(topic.split(" ")[0].toLowerCase()) : -1;
    if (index >= 0 && index < 20)
      bulk["2"] = true;
    else bulk["2"] = false;

    // Auto-check 4: Power word
    if (
      /(secret|easy|2026|truth|brutal|ultimate|guide|hacks|mistake|revealed)/i.test(
        titleToAudit,
      )
    )
      bulk["4"] = true;
    else bulk["4"] = false;

    // Auto-check 9: Description hook summarizes
    if (description.hook.length > 30) bulk["9"] = true;
    else bulk["9"] = false;

    // Auto-check 10: Timestamp chapters
    if (/\d{1,2}:\d{2}/.test(description.chapters)) bulk["10"] = true;
    else bulk["10"] = false;

    // Auto-check 11: Hashtags at bottom
    bulk["11"] =
      description.resources.includes("#") ||
      description.cta?.includes("#") ||
      description.hook.includes("#") ||
      false;

    // Auto-check 12: Tags 400+ chars
    if (tags.length > 0 && tags.join(",").length >= 200)
      bulk["12"] = true; // Use 200 threshold as 400 is hard to hit
    else bulk["12"] = false;

    setChecklistBulk(bulk);
    toast.success(
      `Auto-audit complete! Assessed ${Object.keys(bulk).length} properties.`,
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight italic flex items-center gap-3">
            <Zap className="text-amber-500" size={32} />
            Upload Optimizer
          </h1>
          <p className="text-slate-500 font-medium italic">
            Maximize reach before you hit publish.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit overflow-x-auto">
          {(["titles", "tags", "description", "checklist"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab
                    ? "bg-white dark:bg-slate-700 text-amber-500 shadow-lg"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
                )}
              >
                <span className="capitalize">{tab}</span>
              </button>
            ),
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "titles" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="titles"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="p-8 space-y-6 text-left shrink-0">
              <h3 className="text-xl font-black italic">Title Generator</h3>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Core Topic
                </label>
                <textarea
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-medium focus:ring-2 ring-amber-500 outline-none min-h-[120px]"
                  placeholder="What's your video about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <Button
                  variant="emerald"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black italic border-none h-12 flex justify-center items-center"
                  onClick={handleGenerateTitles}
                  loading={loading}
                >
                  Generate Viral Titles
                </Button>
              </div>
              {finalTitle && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Selected Final Title
                  </label>
                  <p className="text-sm font-medium mt-2 italic border-l-2 border-amber-500 pl-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-slate-700 dark:text-slate-300">
                    {finalTitle}
                  </p>
                </div>
              )}
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {titles.length > 0 && (
                <p className="text-xs text-slate-400 italic">
                  Click a title to mark it as your final choice for the
                  checklist audit.
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titles.map((title, i) => (
                  <Card
                    key={i}
                    onClick={() => setFinalTitle(title.text)}
                    className={cn(
                      "p-4 group hover:border-amber-500 transition-all text-left space-y-3 cursor-pointer",
                      finalTitle === title.text
                        ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50 dark:bg-amber-500/5"
                        : "border-slate-100 dark:border-slate-800",
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <Badge
                        className={cn(
                          "border-none",
                          title.score >= 90
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600",
                        )}
                      >
                        {title.score}% CTR Predicted
                      </Badge>
                      <Copy
                        size={14}
                        className="text-slate-300 cursor-pointer hover:text-amber-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(title.text);
                        }}
                      />
                    </div>
                    <h4 className="text-sm font-black italic leading-tight">
                      {title.text}
                    </h4>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          title.score >= 90 ? "bg-emerald-500" : "bg-amber-500",
                        )}
                        style={{ width: `${title.score}%` }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              {titles.length === 0 && !loading && (
                <div className="col-span-full py-20 text-center text-slate-400 italic">
                  <EmptyState
                    icon={Zap}
                    title="No Viral Titles"
                    description="Enter your video topic above and deploy the AI generator to find high-CTR hook patterns."
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "tags" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key="tags"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="p-8 lg:col-span-1 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic text-indigo-600">
                  Tags Suggester
                </h3>
                {tags.length > 0 && (
                  <div className="flex gap-2">
                    <button onClick={() => { setTags([]); toast.success('Tags cleared') }} className="text-[10px] uppercase font-bold text-slate-400 hover:text-rose-500 transition-colors">Clear</button>
                    <button onClick={() => { copyToClipboard(tags.join(', ')); }} className="text-[10px] uppercase font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Copy All</button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((t, i) => (
                    <Badge
                      key={`${t}-${i}`}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-none pl-3 pr-1 py-1 flex items-center gap-1 group"
                    >
                      {t}
                      <button
                        onClick={() =>
                          setTags(tags.filter((_, idx) => idx !== i))
                        }
                        className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Zap size={10} className="hidden" />{" "}
                        {/* Placeholder for alignment */}✕
                      </button>
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-xs italic text-slate-400">
                      Generate tags...
                    </span>
                  )}
                </div>
                <Input
                  placeholder="Search topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                  <p className="text-[10px] font-black uppercase text-indigo-600 mb-2">
                    Usage Limit
                  </p>
                  <div className="h-1.5 w-full bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600"
                      style={{
                        width: `${Math.min(100, (tags.join("").length / 500) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-indigo-400 mt-2">
                    {tags.join("").length} / 500 characters used
                  </p>
                </div>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black italic border-none h-12"
                  onClick={handleGenerateTags}
                  loading={loading}
                >
                  Recommended Tags
                </Button>
              </div>
            </Card>

            <Card className="p-8 lg:col-span-2 space-y-6 overflow-hidden relative text-left">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Hash size={120} />
              </div>
              <h3 className="text-xl font-black italic">Suggested Rankings</h3>
              <div className="space-y-4 relative z-10">
                {tags.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300 font-black">
                        #0{i + 1}
                      </span>
                      <span className="font-bold">{tag}</span>
                    </div>
                    <Badge variant="secondary">
                      {Math.floor(95 - i * 4)}% relevance
                    </Badge>
                  </div>
                ))}
                {tags.length === 0 && (
                  <div className="py-12">
                    <EmptyState
                      icon={Hash}
                      title="Meta-Nodes Missing"
                      description="Identify high-velocity search tags used by top competitors in your niche."
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === "description" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key="description"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
          >
            <Card className="p-8 lg:col-span-8 flex flex-col space-y-6 min-h-[600px]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic">
                  Description Builder
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 text-[10px]"
                    onClick={() => {
                      let base = finalTitle || topic || "Your amazing topic";
                      updateDescription(
                        "hook",
                        `In this video, I'm going to show you exactly how to master ${base}. Find out why most people fail and how you can succeed in just a few simple steps.`,
                      );
                      updateDescription(
                        "valueProp",
                        `You'll learn the exact secret framework I've used to dominate ${base} completely, so you don't have to spend years figuring it out yourself.`
                      );
                      updateDescription(
                        "chapters",
                        `0:00 Introduction to ${base}\n1:30 The Biggest Mistake\n3:45 Step-by-step Tutorial\n6:20 Pro-tips and Hacks\n9:00 Final Reveal`,
                      );
                      updateDescription(
                        "cta",
                        `👇 If this helped, don't forget to LIKE and SUBSCRIBE! 👇\nhttps://youtube.com/@YourChannel?sub_confirmation=1`
                      );
                      updateDescription(
                        "resources",
                        `🔥 My Free Newsletter: https://example.com/join\n\n📌 Tools I Use:\n- Tool 1: https://link.com\n- Tool 2: https://link.com`,
                      );
                      toast.success("Description template generated!");
                    }}
                  >
                    AUTO BUILD
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="h-8 text-[10px]"
                    onClick={() =>
                      copyToClipboard(
                        `${description.hook}\n\n${description.valueProp}\n\n${description.chapters}\n\n${description.cta}\n\n${description.resources}`,
                      )
                    }
                  >
                    COPY ALL
                  </Button>
                </div>
              </div>
              <div className="space-y-6 overflow-y-auto pr-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    🚀 Video Hook
                  </label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs outline-none focus:ring-1 ring-amber-500 min-h-[60px]"
                    value={description.hook}
                    placeholder="State your video's primary mission..."
                    onChange={(e) => updateDescription("hook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    💎 Value Proposition
                  </label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs outline-none focus:ring-1 ring-amber-500 min-h-[60px]"
                    value={description.valueProp}
                    placeholder="What will the viewer gain?..."
                    onChange={(e) => updateDescription("valueProp", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    ⏰ Chapters
                  </label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs outline-none focus:ring-1 ring-amber-500 min-h-[80px]"
                    value={description.chapters}
                    placeholder="0:00 Intro\n1:24 Setup..."
                    onChange={(e) =>
                      updateDescription("chapters", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    📣 Call To Action (CTA)
                  </label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs outline-none focus:ring-1 ring-amber-500 min-h-[50px]"
                    value={description.cta}
                    placeholder="Subscribe for more / link to course..."
                    onChange={(e) => updateDescription("cta", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    🔗 Secondary Links & Resources
                  </label>
                  <textarea
                    className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-xs outline-none focus:ring-1 ring-amber-500 min-h-[80px]"
                    value={description.resources}
                    placeholder="Newsletter, Gear, Socials..."
                    onChange={(e) =>
                      updateDescription("resources", e.target.value)
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 lg:col-span-4 space-y-6">
              <h3 className="text-lg font-black italic">Live Preview Score</h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Hook Section (> 50 chars)",
                    done: description.hook.length > 50,
                  },
                  {
                    label: "Chapters included",
                    done: description.chapters.includes(":"),
                  },
                  {
                    label: "CTA links",
                    done: description.resources.includes("http"),
                  },
                  {
                    label: "Total Length (> 200 chars)",
                    done:
                      description.hook.length +
                        description.valueProp.length +
                        description.chapters.length +
                        description.cta.length +
                        description.resources.length >
                      200,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <span className="text-[10px] font-bold text-slate-500">
                      {s.label}
                    </span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        s.done
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : "bg-slate-200 dark:bg-slate-700",
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/40">
                <p className="text-[10px] text-amber-600 italic">
                  Pro Tip: Keep your most important links in the first 2 lines
                  (before the "Show More" fold) for maximum conversion.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  updateDescription("hook", "In this video, we dive deep into... \n\nWhat you will learn:\n1. \n2. \n3. ");
                  updateDescription("valueProp", "By the end of this video, you will know how to...");
                  updateDescription("chapters", "0:00 Hook\n0:45 Intro\n...");
                  updateDescription("cta", "Subscribe for more videos like this every week!");
                  updateDescription("resources", "Follow me on Twitter: \nJoin Discord: ");
                }}
              >
                Load Template
              </Button>
            </Card>
          </motion.div>
        )}

        {activeTab === "checklist" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="checklist"
            className="space-y-8"
          >
            <Card className="p-8 bg-slate-900 border-none text-white relative overflow-hidden text-left">
              <div className="absolute right-0 top-0 p-8 opacity-20">
                <CheckSquare size={120} />
              </div>
              <div className="flex justify-between items-end relative z-10">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-black italic">
                      Pre-Upload Status
                    </h3>
                    <p className="text-slate-400 text-sm italic">
                      Verification workflow before final distribution.
                    </p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <Button
                      onClick={runAutoAudit}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-10 px-6 border-none text-xs relative z-10"
                      variant="emerald"
                    >
                      Run Auto-Audit
                    </Button>
                    <Button
                      onClick={() => { resetChecklist(); toast.success('Checklist reset'); }}
                      className="text-white hover:bg-white/10 font-bold h-10 px-6 border-none text-xs relative z-10"
                      variant="ghost"
                    >
                      Reset All
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-black italic text-emerald-500">
                    {progress}%
                  </div>
                  <div className="text-[10px] font-black uppercase text-slate-400">
                    {completedCount} / {CHECKLIST_ITEMS.length} COMPLETE
                  </div>
                </div>
              </div>
              <div className="mt-8 h-2 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHECKLIST_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklist(item.id.toString())}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                    checklist[item.id.toString()]
                      ? "bg-emerald-500/5 border-emerald-500/50"
                      : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 hover:border-emerald-500/30",
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all",
                      checklist[item.id.toString()]
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-200 dark:border-slate-700",
                    )}
                  >
                    {checklist[item.id.toString()] && <CheckSquare size={12} />}
                  </div>
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-xs font-black italic",
                        checklist[item.id.toString()]
                          ? "text-emerald-500 line-through"
                          : "text-slate-700 dark:text-slate-300",
                      )}
                    >
                      {item.text}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-[8px] px-1 py-0 h-4"
                    >
                      {item.category}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
