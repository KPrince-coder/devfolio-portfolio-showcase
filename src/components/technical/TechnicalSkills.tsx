import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Code, Server, Smartphone, Cloud, Database, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const iconMap: Record<string, React.ComponentType<any>> = {
  code: Code,
  server: Server,
  smartphone: Smartphone,
  cloud: Cloud,
  database: Database,
  shield: Shield,
};

interface TechnicalSkill {
  id: string;
  category: string;
  icon_key: string;
  skills: string[];
}

export const TechnicalSkills = () => {
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

  if (isLoading) {
    return <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="py-20" id="skills">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Technical Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills?.map((skill, index) => {
            const Icon = iconMap[skill.icon_key] || Code;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{skill.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {skill.skills.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/60" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};