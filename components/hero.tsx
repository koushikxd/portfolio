export function Hero() {
  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-4">
        <div
          className="flex items-center justify-between border-b-2 border-muted/80 pb-2 border-dashed opacity-0 animate-slide-up-fade"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            00 {"//"} About
          </h2>
        </div>
        <h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground uppercase font-(family-name:--font-geist-pixel-grid) opacity-0 animate-slide-up-fade"
          style={{ animationDelay: "150ms" }}
        >
          Koushik
        </h1>
        <div
          className="flex flex-col gap-2 text-sm text-muted-foreground max-w-xl leading-relaxed pl-0 opacity-0 animate-slide-up-fade"
          style={{ animationDelay: "300ms" }}
        >
          <p>{"-"} SDE @ Steps AI</p>
          <p>
            {"-"} I build software. I prefer dark mode, minimalist interfaces,
            and doing most of my work in the terminal
          </p>
          <p>{"//"} neovim btw</p>
        </div>
      </div>
    </section>
  );
}
