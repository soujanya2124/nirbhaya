import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Safety from "@/components/Safety";
import Community from "@/components/Community";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />
      <Features />
      <Safety />
      <Community />
    </main>
  );
}
