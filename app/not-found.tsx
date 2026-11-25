import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh font-mono relative flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute size-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-medium tracking-tighter text-foreground">
            404
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            Page Not Found
          </p>
        </div>

        <div className="w-12 h-px bg-muted/60" />

        <Link
          href="/"
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span>Return Home</span>
        </Link>
      </div>
    </main>
  );
}
