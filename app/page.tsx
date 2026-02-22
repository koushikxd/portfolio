import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { DitherHeader } from "@/components/ui/dither-header";

export default function Home() {
  return (
    <main className="min-h-screen font-mono selection:bg-foreground selection:text-background pb-20 relative">
      <div className="container max-w-2xl mx-auto px-6 pb-8 md:pt-10 pt-6 space-y-12 relative z-10">
        <DitherHeader />
        <Hero />
        <Experience />
        <Projects />
        {/* <Activity />  */}
      </div>
      <Footer />
    </main>
  );
}
