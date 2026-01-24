export function Hero() {
  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-4">
        <h1 
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase font-(family-name:--font-doto) opacity-0 animate-slide-up-fade"
          style={{ animationDelay: "150ms" }}
        >
          Koushik
        </h1>
        <div 
          className="flex flex-col gap-2 text-sm text-muted-foreground max-w-xl leading-relaxed pl-0 opacity-0 animate-slide-up-fade"
          style={{ animationDelay: "300ms" }}
        >
          <p>{"-"} SDE @ Some Company</p>
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
