import { useEffect, useState } from "react";
import { SCHEMES, type Scheme } from "@/data/schemes";

export type AppStatus = "Applied" | "Under Review" | "Approved" | "Rejected";

export type TrackedApplication = {
  id: string;
  schemeId: string;
  schemeName: string;
  status: AppStatus;
  appliedAt: string;
  updatedAt: string;
  missingDocuments: string[];
  deadline: string;
  history: { status: AppStatus; at: string }[];
};

const KEY = "scheme_applications_v1";

function read(): TrackedApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(apps: TrackedApplication[]) {
  localStorage.setItem(KEY, JSON.stringify(apps));
  window.dispatchEvent(new Event("apps:update"));
}

function seed(): TrackedApplication[] {
  const now = new Date();
  const ago = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
  const demo: TrackedApplication[] = [
    {
      id: crypto.randomUUID(),
      schemeId: "pm-kisan",
      schemeName: "PM-KISAN Samman Nidhi",
      status: "Under Review",
      appliedAt: ago(12),
      updatedAt: ago(2),
      missingDocuments: [],
      deadline: SCHEMES.find((s) => s.id === "pm-kisan")!.deadline,
      history: [
        { status: "Applied", at: ago(12) },
        { status: "Under Review", at: ago(2) },
      ],
    },
    {
      id: crypto.randomUUID(),
      schemeId: "nsp-scholarship",
      schemeName: "National Scholarship (Post-Matric)",
      status: "Applied",
      appliedAt: ago(4),
      updatedAt: ago(4),
      missingDocuments: ["Income certificate"],
      deadline: SCHEMES.find((s) => s.id === "nsp-scholarship")!.deadline,
      history: [{ status: "Applied", at: ago(4) }],
    },
    {
      id: crypto.randomUUID(),
      schemeId: "ayushman-bharat",
      schemeName: "Ayushman Bharat (PM-JAY)",
      status: "Approved",
      appliedAt: ago(30),
      updatedAt: ago(5),
      missingDocuments: [],
      deadline: SCHEMES.find((s) => s.id === "ayushman-bharat")!.deadline,
      history: [
        { status: "Applied", at: ago(30) },
        { status: "Under Review", at: ago(20) },
        { status: "Approved", at: ago(5) },
      ],
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(demo));
  return demo;
}

export function useApplications() {
  const [apps, setApps] = useState<TrackedApplication[]>([]);
  useEffect(() => {
    setApps(read());
    const h = () => setApps(read());
    window.addEventListener("apps:update", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("apps:update", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return apps;
}

export function applyToScheme(scheme: Scheme, missing: string[] = []) {
  const apps = read();
  if (apps.some((a) => a.schemeId === scheme.id)) return;
  const now = new Date().toISOString();
  apps.unshift({
    id: crypto.randomUUID(),
    schemeId: scheme.id,
    schemeName: scheme.name,
    status: "Applied",
    appliedAt: now,
    updatedAt: now,
    missingDocuments: missing,
    deadline: scheme.deadline,
    history: [{ status: "Applied", at: now }],
  });
  write(apps);
}

export function advanceStatus(id: string) {
  const order: AppStatus[] = ["Applied", "Under Review", "Approved"];
  const apps = read().map((a) => {
    if (a.id !== id) return a;
    const idx = order.indexOf(a.status);
    const next = order[Math.min(idx + 1, order.length - 1)];
    if (next === a.status) return a;
    const at = new Date().toISOString();
    return { ...a, status: next, updatedAt: at, history: [...a.history, { status: next, at }] };
  });
  write(apps);
}

export function removeApplication(id: string) {
  write(read().filter((a) => a.id !== id));
}

export type Alert = {
  id: string;
  kind: "deadline" | "documents" | "status" | "reminder";
  title: string;
  message: string;
  appId: string;
  severity: "info" | "warn" | "danger";
};

export function deriveAlerts(apps: TrackedApplication[]): Alert[] {
  const out: Alert[] = [];
  const now = Date.now();
  for (const a of apps) {
    const days = Math.ceil((new Date(a.deadline).getTime() - now) / 86400000);
    if (days >= 0 && days <= 7 && a.status !== "Approved" && a.status !== "Rejected") {
      out.push({
        id: a.id + "-d",
        kind: "deadline",
        title: "Deadline approaching",
        message: `${a.schemeName} closes in ${days} day${days === 1 ? "" : "s"}.`,
        appId: a.id,
        severity: days <= 3 ? "danger" : "warn",
      });
    }
    if (a.missingDocuments.length) {
      out.push({
        id: a.id + "-m",
        kind: "documents",
        title: "Missing documents",
        message: `${a.schemeName}: upload ${a.missingDocuments.join(", ")}.`,
        appId: a.id,
        severity: "warn",
      });
    }
    if (a.status === "Approved") {
      out.push({
        id: a.id + "-s",
        kind: "status",
        title: "Application approved 🎉",
        message: `${a.schemeName} has been approved. Check your bank/portal.`,
        appId: a.id,
        severity: "info",
      });
    }
  }
  return out;
}