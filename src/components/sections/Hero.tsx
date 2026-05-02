import { Sparkles, ShieldCheck, BellRing } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, hsl(var(--accent) / 0.4), transparent 40%), radial-gradient(circle at 80% 60%, hsl(var(--accent) / 0.25), transparent 45%)",
      }} />
      <div className="container relative grid gap-10 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div className="animate-fade-in-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI-powered • Powered by Gemini
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl">
            Never miss a <span className="text-accent">government scheme</span> meant for you.
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/80 md:text-lg">
            SchemeMitra finds the right schemes for your profile, checks eligibility instantly,
            tracks your applications, and alerts you about deadlines &amp; missing documents — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#eligibility" className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-smooth hover:scale-[1.02]">
              Check my eligibility
            </a>
            <a href="#chat" className="rounded-lg border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-smooth hover:bg-primary-foreground/10">
              Ask the AI assistant
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-foreground/15 pt-6 text-sm">
            <div><dt className="text-primary-foreground/60">Schemes</dt><dd className="text-2xl font-bold text-accent">500+</dd></div>
            <div><dt className="text-primary-foreground/60">Citizens helped</dt><dd className="text-2xl font-bold text-accent">2.4L+</dd></div>
            <div><dt className="text-primary-foreground/60">Approval rate</dt><dd className="text-2xl font-bold text-accent">87%</dd></div>
          </dl>
        </div>

        <div className="relative animate-fade-in-up">
          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-5 shadow-elegant backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Your dashboard</div>
              <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success-foreground ring-1 ring-success/40">Live</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { name: "PM-KISAN", status: "Under Review", color: "bg-warning/20 text-warning-foreground ring-warning/40" },
                { name: "Ayushman Bharat", status: "Approved", color: "bg-success/20 text-success-foreground ring-success/40" },
                { name: "Scholarship (NSP)", status: "Applied", color: "bg-accent/20 text-accent ring-accent/40" },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-lg bg-primary-foreground/5 px-3 py-2.5">
                  <span>{r.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${r.color}`}>{r.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/15 p-3 text-xs text-primary-foreground/90 ring-1 ring-accent/30">
              <BellRing className="h-4 w-4 text-accent" />
              <span>Scholarship deadline in 3 days — upload income certificate.</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary-foreground/5 p-3 text-xs text-primary-foreground/80">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>Verified by official Govt. of India scheme registry.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}