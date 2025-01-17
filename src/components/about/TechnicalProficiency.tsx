import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Code, Database, Globe, Layout, Server, Wrench } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  category: string;
  icon_key: string;
}

const ICON_MAP = {
  code: Code,
  database: Database,
  globe: Globe,
  layout: Layout,
  server: Server,
  wrench: Wrench,
} as const;

export const TechnicalProficiency = () => {
  const { data: skills, isLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category");

      if (error) throw error;
      return data as Skill[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Code className="h-6 w-6" />
            Technical Proficiency
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!skills?.length) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Code className="h-6 w-6" />
            Technical Proficiency
          </h2>
          <Card className="p-8 text-center text-muted-foreground">
            No skills added yet.
          </Card>
        </div>
      </section>
    );
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 flex items-center gap-2"
        >
          <Code className="h-6 w-6 text-primary" />
          Technical Proficiency
        </motion.h2>

        <div className="space-y-12">
          {Object.entries(skillsByCategory).map(([category, items], categoryIndex) => (
            <div key={category} className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="text-xl font-semibold text-primary/80"
              >
                {category}
              </motion.h3>

              <div className="grid gap-6 lg:grid-cols-2">
                {items.map((skill, index) => {
                  const IconComponent = ICON_MAP[skill.icon_key as keyof typeof ICON_MAP] || Code;

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-all bg-gradient-to-br from-background to-accent/5 group">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className="p-3 rounded-xl bg-primary/10 shrink-0"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <IconComponent className="w-6 h-6 text-primary" />
                          </motion.div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {skill.name}
                              </h4>
                              <span className="text-sm text-muted-foreground">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2, duration: 0.5 }}
                            >
                              <Progress
                                value={skill.proficiency}
                                className="h-2 bg-primary/10"
                                indicatorClassName="bg-primary"
                              />
                            </motion.div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
