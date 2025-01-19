import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Code, Server, Smartphone, Cloud, Database, Shield, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<any>> = {
  code: Code,
  server: Server,
  smartphone: Smartphone,
  cloud: Cloud,
  database: Database,
  shield: Shield,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "Frontend Development": {
    bg: "from-primary-teal/10 to-secondary-blue/10",
    text: "text-primary-teal",
    border: "border-primary-teal/20",
  },
  "Backend Development": {
    bg: "from-secondary-blue/10 to-accent-coral/10",
    text: "text-secondary-blue",
    border: "border-secondary-blue/20",
  },
  "Mobile Development": {
    bg: "from-accent-coral/10 to-primary-mint/10",
    text: "text-accent-coral",
    border: "border-accent-coral/20",
  },
  "Cloud & DevOps": {
    bg: "from-primary-mint/10 to-primary-teal/10",
    text: "text-primary-mint",
    border: "border-primary-mint/20",
  },
  "Database": {
    bg: "from-primary-teal/10 to-accent-coral/10",
    text: "text-primary-teal",
    border: "border-primary-teal/20",
  },
  "Security": {
    bg: "from-secondary-blue/10 to-primary-mint/10",
    text: "text-secondary-blue",
    border: "border-secondary-blue/20",
  },
};

interface TechnicalSkill {
  id: string;
  category: string;
  icon_key: string;
  skills: string[];
}

const FloatingParticle = ({ delay = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue opacity-50"
    initial={{ scale: 0, x: 0, y: 0 }}
    animate={{
      scale: [1, 2, 1],
      x: [0, Math.random() * 100 - 50, 0],
      y: [0, Math.random() * 100 - 50, 0],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  />
);

const SkillCardSkeleton = () => (
  <Card className="relative p-6 h-full overflow-hidden border border-primary-teal/20">
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  </Card>
);

export const TechnicalSkills = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const { data: skills, isLoading } = useQuery({
    queryKey: ["technical-skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technical_skills")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as TechnicalSkill[];
    },
  });

  return (
    <section className="py-20 relative overflow-hidden" id="skills">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/10 rounded-full blur-[100px]" />
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      <motion.div style={{ y }} className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary-teal/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-teal via-secondary-blue to-accent-coral bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency across different domains
          </p>
          <motion.div
            className="mt-4 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-primary-teal to-secondary-blue"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="h-[400px]"
              >
                <SkillCardSkeleton />
              </motion.div>
            ))
          ) : (
            skills?.map((skill, index) => {
              const Icon = iconMap[skill.icon_key] || Code;
              const colors = categoryColors[skill.category] || {
                bg: "from-primary-teal/10 to-secondary-blue/10",
                text: "text-primary-teal",
                border: "border-primary-teal/20",
              };

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-[400px]"
                >
                  <Card className={cn(
                    "relative p-6 h-full overflow-hidden group border",
                    colors.border,
                    "hover:shadow-lg hover:shadow-primary-teal/5 transition-all duration-500"
                  )}>
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500",
                      colors.bg,
                      "group-hover:opacity-100"
                    )} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <motion.div
                        className="flex items-center gap-4 mb-6 shrink-0"
                        initial={{ x: -20 }}
                        whileInView={{ x: 0 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className={cn(
                            "p-3 rounded-xl backdrop-blur-sm",
                            colors.bg
                          )}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className={cn("w-6 h-6", colors.text)} />
                        </motion.div>
                        <h3 className={cn(
                          "text-xl font-semibold transition-colors duration-300",
                          "group-hover:" + colors.text
                        )}>
                          {skill.category}
                        </h3>
                      </motion.div>

                      <motion.ul
                        className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-teal/20 scrollbar-track-transparent"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        {skill.skills.map((item, i) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-2 group/item"
                          >
                            <motion.span
                              className={cn(
                                "w-2 h-2 mt-2 rounded-full shrink-0",
                                colors.bg,
                                "group-hover/item:" + colors.text
                              )}
                              whileHover={{ scale: 1.5 }}
                            />
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors break-words">
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </section>
  );
};