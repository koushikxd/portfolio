import Link from "next/link";
import { Background } from "@/components/background";

export default function NotFound() {
  return (
    <main className="min-h-screen font-mono selection:bg-foreground selection:text-background relative flex items-center justify-center">
      <Background />
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
