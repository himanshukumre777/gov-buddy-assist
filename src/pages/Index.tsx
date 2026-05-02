import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { SchemeBrowser } from "@/components/sections/SchemeBrowser";
import { EligibilityChecker } from "@/components/sections/EligibilityChecker";
import { Tracker } from "@/components/sections/Tracker";
import { Alerts } from "@/components/sections/Alerts";
import { ChatBot } from "@/components/sections/ChatBot";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SchemeBrowser />
        <EligibilityChecker />
        <Tracker />
        <Alerts />
        <ChatBot />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
