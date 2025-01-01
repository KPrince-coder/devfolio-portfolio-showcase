import { motion } from "framer-motion";

const experiences = [
  {
    year: "2023",
    title: "Senior Developer",
    company: "Tech Corp",
    description: "Led development of multiple full-stack applications",
    technologies: ["React", "Node.js", "AWS", "TypeScript"]
  },
  {
    year: "2021",
    title: "Full Stack Developer",
    company: "Startup Inc",
    description: "Built and maintained various web applications",
    technologies: ["Vue.js", "Python", "Docker", "PostgreSQL"]
  },
  {
    year: "2019",
    title: "Frontend Developer",
    company: "Web Agency",
    description: "Developed responsive websites for clients",
    technologies: ["React", "JavaScript", "CSS", "HTML"]
  },
];

export const Timeline = () => {
  return (
    <section className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
      <h2 className="mb-12 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
        Experience
      </h2>
      
      <div className="mx-auto max-w-2xl relative">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary to-primary/50" />
        
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.year}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="timeline-dot"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: index * 0.1 
              }}
            />
            <div className="space-y-2 bg-accent/5 p-6 rounded-lg backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-colors">
              <span className="text-sm text-primary font-medium">{experience.year}</span>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                {experience.title} · {experience.company}
              </h3>
              <p className="text-muted-foreground">{experience.description}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {experience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};