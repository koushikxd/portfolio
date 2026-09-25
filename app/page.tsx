import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { TabsSection } from "@/components/tabs-section";
import { DitherHeader } from "@/components/ui/dither-header";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col font-mono selection:bg-foreground selection:text-background relative">
      <div className="container max-w-2xl mx-auto px-6 pb-8 md:pt-10 pt-6 space-y-12 relative z-10 flex-1">
        <DitherHeader />
        <Hero />
        <TabsSection />
        {/* <Activity />  */}
      </div>
      <Footer />
    </main>
  );
}
