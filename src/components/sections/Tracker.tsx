import { advanceStatus, removeApplication, useApplications, type AppStatus } from "@/lib/tracker";
import { Check, ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

const STAGES: AppStatus[] = ["Applied", "Under Review", "Approved"];

const statusColor: Record<AppStatus, string> = {
  Applied: "bg-accent/15 text-accent ring-accent/30",
  "Under Review": "bg-warning/15 text-warning-foreground ring-warning/40",
  Approved: "bg-success/15 text-success ring-success/40",
  Rejected: "bg-destructive/15 text-destructive ring-destructive/40",
};

export function Tracker() {
  const apps = useApplications();

  return (
    <section id="tracker" className="container py-20">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Application tracking</p>
        <h2 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">Every application. One dashboard.</h2>
        <p className="mt-2 text-muted-foreground">Watch your applications move through Applied → Under Review → Approved with timestamps.</p>
      </div>

      {apps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          No applications yet — apply to a scheme above to start tracking.
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const stageIdx = STAGES.indexOf(a.status);
            return (
              <article key={a.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{a.schemeName}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Applied {new Date(a.appliedAt).toLocaleDateString()} · Updated {new Date(a.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusColor[a.status]}`}>{a.status}</span>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  {STAGES.map((st, i) => {
                    const reached = i <= stageIdx && a.status !== "Rejected";
                    return (
                      <div key={st} className="flex flex-1 items-center gap-2">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2 transition-smooth ${reached ? "bg-success text-success-foreground ring-success" : "bg-muted text-muted-foreground ring-border"}`}>
                          {reached ? <Check className="h-4 w-4" /> : i + 1}
                        </div>
                        <span className={`text-xs font-medium ${reached ? "text-foreground" : "text-muted-foreground"}`}>{st}</span>
                        {i < STAGES.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < stageIdx ? "bg-success" : "bg-border"}`} />}
                      </div>
                    );
                  })}
                </div>

                {a.missingDocuments.length > 0 && (
                  <div className="mt-4 rounded-lg bg-warning/10 p-3 text-xs text-foreground ring-1 ring-warning/30">
                    <strong>Missing:</strong> {a.missingDocuments.join(", ")}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <div className="flex flex-wrap gap-3">
                    {a.history.map((h, i) => (
                      <span key={i}>{h.status} → {new Date(h.at).toLocaleDateString()}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {a.status !== "Approved" && a.status !== "Rejected" && (
                      <button
                        onClick={() => {
                          advanceStatus(a.id);
                          toast.success("Status updated");
                        }}
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-secondary"
                      >
                        Advance <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        removeApplication(a.id);
                        toast("Removed from tracker");
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}