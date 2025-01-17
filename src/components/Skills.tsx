import { Card } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Code2, Server, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: "Frontend" | "Backend" | "Tools" | "Other";
}

interface SkillCategory {
  name: string;
  icon: any;
  color: string;
  description: string;
}

const skillCategories: Record<string, SkillCategory> = {
  Frontend: {
    name: "Frontend Development",
    icon: Code2,
    color: "from-primary-teal to-secondary-blue",
    description: "Building responsive and interactive user interfaces"
  },
  Backend: {
    name: "Backend Development",
    icon: Server,
    color: "from-accent-coral to-primary-mint",
    description: "Creating scalable server-side applications"
  },
  Tools: {
    name: "Development Tools",
    icon: Wrench,
    color: "from-secondary-blue to-primary-teal",
    description: "Utilizing modern development tools and practices"
  },
  Other: {
    name: "Additional Skills",
    icon: Sparkles,
    color: "from-primary-mint to-accent-coral",
    description: "Complementary skills and technologies"
  }
};

export const Skills = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: skills } = useQuery<Skill[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("proficiency", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) ?? {};

  return (
    <section id="skills" className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold">
            Technical <span className="bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">Skills</span>
          </h2>
          <motion.div
            className="mt-4 h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          <p className="mt-4 text-muted-foreground">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          style={{ y }}
        >
          {Object.entries(groupedSkills).map(([category, skills], categoryIndex) => {
            const categoryInfo = skillCategories[category];
            const Icon = categoryInfo.icon;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full overflow-hidden p-6 transition-all hover:shadow-lg">
                  {/* Category Header */}
                  <div className="mb-6">
                    <motion.div
                      className={cn(
                        "mb-4 inline-block rounded-full bg-gradient-to-r p-3",
                        categoryInfo.color
                      )}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold">{categoryInfo.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {categoryInfo.description}
                    </p>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        className="relative"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              categoryInfo.color
                            )}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};