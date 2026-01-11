export function Hero() {
  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-4">
        <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground uppercase">
          Koushik
        </h1>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground max-w-xl leading-relaxed border-l-2 border-muted pl-4">
          <p>SDE @ Some Company</p>
          <p>
            I build software. I prefer dark mode, minimalist interfaces, and
            doing most of my work in the terminal
          </p>
          <p>Neovim btw</p>
        </div>
      </div>
    </section>
  );
}
