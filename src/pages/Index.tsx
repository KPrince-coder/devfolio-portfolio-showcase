import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { AboutMe } from "@/components/AboutMe";
import { CursorLight } from "@/components/CursorLight";
import { Blog } from "@/components/Blog";
import { Header } from "@/components/Header";
import { TechnicalSkills } from "@/components/technical/TechnicalSkills";
import { Education } from "@/components/education/Education";
import { TechnicalProficiency } from "@/components/technical/TechnicalProficiency";

const Index = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-16">
        <CursorLight />
        <Hero />
        <AboutMe />
        <Education />
        <TechnicalProficiency />
        <TechnicalSkills />
        <Projects />
        <Timeline />
        <Blog />
        <Contact />
      </div>
    </>
  );
};

export default Index;