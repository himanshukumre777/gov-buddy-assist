import { Landmark } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero shadow-soft">
            <Landmark className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">SchemeMitra</div>
            <div className="text-[11px] text-muted-foreground">Govt. Scheme Assistant</div>
          </div>
        </a>
        <nav className="hidden gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#schemes" className="hover:text-foreground transition-smooth">Schemes</a>
          <a href="#eligibility" className="hover:text-foreground transition-smooth">Eligibility</a>
          <a href="#tracker" className="hover:text-foreground transition-smooth">Tracker</a>
          <a href="#alerts" className="hover:text-foreground transition-smooth">Alerts</a>
          <a href="#chat" className="hover:text-foreground transition-smooth">Ask AI</a>
        </nav>
        <a
          href="#chat"
          className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-soft transition-smooth hover:shadow-glow md:inline-block"
        >
          Talk to AI
        </a>
      </div>
    </header>
  );
}