import { useMemo } from "react";
import { deriveAlerts, useApplications } from "@/lib/tracker";
import { AlertTriangle, BellRing, FileWarning, PartyPopper } from "lucide-react";

const iconMap = {
  deadline: AlertTriangle,
  documents: FileWarning,
  status: PartyPopper,
  reminder: BellRing,
} as const;

const sevStyle = {
  info: "bg-success/10 text-success ring-success/30",
  warn: "bg-warning/15 text-warning-foreground ring-warning/40",
  danger: "bg-destructive/10 text-destructive ring-destructive/40",
};

export function Alerts() {
  const apps = useApplications();
  const alerts = useMemo(() => deriveAlerts(apps), [apps]);

  return (
    <section id="alerts" className="bg-muted/40 py-20">
      <div className="container">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Smart alerts</p>
          <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">Never miss a deadline again</h2>
          <p className="mt-2 text-muted-foreground">Automatic alerts for deadlines, missing documents, status changes &amp; reminders.</p>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            🎉 You're all caught up — no pending alerts.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {alerts.map((a) => {
              const Icon = iconMap[a.kind];
              return (
                <div key={a.id} className={`flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${sevStyle[a.severity]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{a.title}</h4>
                    <p className="text-sm text-muted-foreground">{a.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}