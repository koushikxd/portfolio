import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { DitherHeader } from "@/components/ui/dither-header";

export default function Home() {
  return (
    <main className="min-h-screen font-mono selection:bg-foreground selection:text-background pb-20 relative">
      <div className="container max-w-2xl mx-auto px-6 pb-8 pt-10 space-y-12 relative z-10">
        <DitherHeader />
        <Hero />
        <Projects />
        {/* <Activity />  */}
      </div>
      <Footer />
    </main>
  );
}
