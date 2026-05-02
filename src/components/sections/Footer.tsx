export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container flex flex-col items-center justify-between gap-3 py-8 text-sm md:flex-row">
        <div>© {new Date().getFullYear()} SchemeMitra · Hackathon Demo Project</div>
        <div className="text-primary-foreground/70">Built with Lovable AI · Gemini · React</div>
      </div>
    </footer>
  );
}