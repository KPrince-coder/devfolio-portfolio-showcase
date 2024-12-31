import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="container mx-auto px-4">
      <Hero />
      <Projects />
      <Skills />
      <Timeline />
      <Contact />
    </div>
  );
};

export default Index;