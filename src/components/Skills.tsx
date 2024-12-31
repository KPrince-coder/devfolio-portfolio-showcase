import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB"] },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Figma"] },
];

export const Skills = () => {
  return (
    <section className="py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">Skills</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6">
              <h3 className="mb-4 text-xl font-bold">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="skill-item">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};