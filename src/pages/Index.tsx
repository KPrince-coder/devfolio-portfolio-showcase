import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { AboutMe } from "@/components/AboutMe";
import { CursorLight } from "@/components/CursorLight";
import { Blog } from "@/components/Blog";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { TechnicalSkills } from "@/components/technical/TechnicalSkills";
import { Education } from "@/components/education/Education";
import { TechnicalProficiency } from "@/components/technical/TechnicalProficiency";
import { Hobbies } from "@/components/hobbies/Hobbies";

const Index = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 pt-16">
        <CursorLight />
        <Hero />
        <AboutMe />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Education />
          <TechnicalProficiency />
        </div>
        <TechnicalSkills />
        <Hobbies />
        <Projects />
        <Timeline />
        <Blog />
        <Contact />
      </div>
      <ScrollToTop />
      <Footer />
    </>
  );
};

export default Index;