import { useMemo, useState } from "react";
import { SCHEMES, type Scheme } from "@/data/schemes";
import { applyToScheme } from "@/lib/tracker";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";

type Profile = {
  age: number;
  gender: "any" | "female" | "male";
  income: number;
  occupation: string;
};

function matches(s: Scheme, p: Profile): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  let ok = true;
  if (s.eligibility.minAge && p.age < s.eligibility.minAge) {
    ok = false;
    reasons.push(`Min age ${s.eligibility.minAge}`);
  }
  if (s.eligibility.maxAge && p.age > s.eligibility.maxAge) {
    ok = false;
    reasons.push(`Max age ${s.eligibility.maxAge}`);
  }
  if (s.eligibility.gender && s.eligibility.gender !== "any" && s.eligibility.gender !== p.gender) {
    ok = false;
    reasons.push(`For ${s.eligibility.gender} applicants`);
  }
  if (s.eligibility.maxIncome && p.income > s.eligibility.maxIncome) {
    ok = false;
    reasons.push(`Income above ₹${s.eligibility.maxIncome.toLocaleString("en-IN")}`);
  }
  if (s.eligibility.occupation && p.occupation && !s.eligibility.occupation.includes(p.occupation.toLowerCase())) {
    ok = false;
    reasons.push(`For ${s.eligibility.occupation.join(", ")}`);
  }
  return { ok, reasons };
}

export function EligibilityChecker() {
  const [p, setP] = useState<Profile>({ age: 22, gender: "female", income: 180000, occupation: "student" });
  const [submitted, setSubmitted] = useState(false);

  const results = useMemo(
    () => SCHEMES.map((s) => ({ scheme: s, ...matches(s, p) })).sort((a, b) => Number(b.ok) - Number(a.ok)),
    [p],
  );
  const eligible = results.filter((r) => r.ok);

  return (
    <section id="eligibility" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Smart eligibility</p>
          <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">Check what you qualify for in 30 seconds</h2>
          <p className="mt-2 text-muted-foreground">Tell us about yourself. We will instantly match you to relevant schemes.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold text-foreground">Your profile</h3>
            <div className="mt-5 space-y-4">
              <Field label="Age">
                <input type="number" min={1} max={100} value={p.age}
                  onChange={(e) => setP({ ...p, age: +e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
              </Field>
              <Field label="Gender">
                <select value={p.gender}
                  onChange={(e) => setP({ ...p, gender: e.target.value as Profile["gender"] })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent">
                  <option value="any">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </Field>
              <Field label="Annual household income (₹)">
                <input type="number" min={0} step={10000} value={p.income}
                  onChange={(e) => setP({ ...p, income: +e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
              </Field>
              <Field label="Occupation">
                <select value={p.occupation}
                  onChange={(e) => setP({ ...p, occupation: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent">
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="salaried">Salaried</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="homemaker">Homemaker</option>
                </select>
              </Field>
            </div>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-soft transition-smooth hover:shadow-glow">
              <Sparkles className="h-4 w-4" /> Find my schemes
            </button>
          </form>

          <div className="space-y-3">
            <div className="rounded-xl bg-gradient-hero p-4 text-primary-foreground shadow-soft">
              <div className="text-sm opacity-80">Matched schemes</div>
              <div className="text-3xl font-bold text-accent">{eligible.length}<span className="ml-2 text-base text-primary-foreground/70">/ {SCHEMES.length}</span></div>
            </div>
            <div className="space-y-3">
              {(submitted ? results : results.slice(0, 4)).map((r) => (
                <div key={r.scheme.id} className={`flex items-start gap-3 rounded-xl border p-4 shadow-soft ${r.ok ? "border-success/40 bg-success/5" : "border-border bg-card opacity-80"}`}>
                  {r.ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-foreground">{r.scheme.name}</h4>
                      {r.ok && (
                        <button
                          onClick={() => {
                            applyToScheme(r.scheme);
                            toast.success(`Applied to ${r.scheme.name}`);
                          }}
                          className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-secondary"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{r.scheme.summary}</p>
                    {!r.ok && <p className="mt-1 text-xs text-destructive">Not eligible: {r.reasons.join(" · ")}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}