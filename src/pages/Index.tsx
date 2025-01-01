import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { AboutMe } from "@/components/AboutMe";
import { CursorLight } from "@/components/CursorLight";
import { Blog } from "@/components/Blog";

const Index = () => {
  return (
    <div className="container mx-auto px-4">
      <CursorLight />
      <Hero />
      <AboutMe />
      <Projects />
      <Skills />
      <Timeline />
      <Blog />
      <Contact />
    </div>
  );
};

export default Index;