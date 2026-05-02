import { useMemo, useState } from "react";
import { CATEGORIES, SCHEMES, type Scheme } from "@/data/schemes";
import { applyToScheme } from "@/lib/tracker";
import { toast } from "sonner";
import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export function SchemeBrowser() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return SCHEMES.filter(
      (s) =>
        (cat === "All" || s.category === cat) &&
        (q === "" || s.name.toLowerCase().includes(q.toLowerCase()) || s.summary.toLowerCase().includes(q.toLowerCase())),
    );
  }, [cat, q]);

  const onApply = (s: Scheme) => {
    applyToScheme(s);
    toast.success(`Applied to ${s.name}`, { description: "Tracking added to your dashboard." });
  };

  return (
    <section id="schemes" className="container py-20">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Discover</p>
          <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">Personalized scheme suggestions</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Browse curated central &amp; state schemes by category, or search for what you need.</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search schemes…"
          className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm shadow-soft outline-none transition-smooth focus:border-accent md:w-72"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-smooth ${
              cat === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <SchemeCard key={s.id} s={s} onApply={onApply} />
        ))}
      </div>
    </section>
  );
}

function SchemeCard({ s, onApply }: { s: Scheme; onApply: (s: Scheme) => void }) {
  const days = Math.ceil((new Date(s.deadline).getTime() - Date.now()) / 86400000);
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-gradient-card p-5 shadow-soft transition-smooth hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
          {s.category}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {days}d left
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">{s.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{s.ministry}</p>
      <p className="mt-3 text-sm text-foreground/80">{s.summary}</p>
      <div className="mt-3 flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-success" /> {s.benefit}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onApply(s)}
          className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-secondary"
        >
          Apply &amp; Track
        </button>
        <a
          href={s.applyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-input bg-card px-3 py-2 text-sm font-medium text-foreground transition-smooth hover:border-accent"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}