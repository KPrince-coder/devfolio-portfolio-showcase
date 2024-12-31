import { motion } from "framer-motion";

const experiences = [
  {
    year: "2023",
    title: "Senior Developer",
    company: "Tech Corp",
    description: "Led development of multiple full-stack applications",
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    company: "Startup Inc",
    description: "Built and maintained various web applications",
  },
  {
    year: "2019",
    title: "Frontend Developer",
    company: "Web Agency",
    description: "Developed responsive websites for clients",
  },
];

export const Timeline = () => {
  return (
    <section className="py-20">
      <h2 className="mb-12 text-center text-3xl font-bold">Experience</h2>
      <div className="mx-auto max-w-2xl">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.year}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="timeline-dot" />
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">{experience.year}</span>
              <h3 className="text-lg font-bold">
                {experience.title} · {experience.company}
              </h3>
              <p className="text-muted-foreground">{experience.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};