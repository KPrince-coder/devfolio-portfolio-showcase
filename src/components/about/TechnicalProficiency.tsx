import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ChartBar, Code2, Cpu, Database, Layout, Server } from "lucide-react";

interface TechnicalProficiency {
  id: string;
  skill: string;
  proficiency: number;
  created_at: string;
  updated_at: string;
}

const CATEGORY_ICONS = {
  frontend: Layout,
  backend: Server,
  database: Database,
  devops: Cpu,
  other: Code2,
} as const;

export const TechnicalProficiency = () => {
  const { data: proficiencies, isLoading } = useQuery({
    queryKey: ["technical-proficiency"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technical_proficiency")
        .select("*")
        .order("proficiency", { ascending: false });

      if (error) throw error;
      return data as TechnicalProficiency[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <ChartBar className="h-6 w-6" />
            Technical Proficiency
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
                <div className="h-2 w-full bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!proficiencies?.length) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <ChartBar className="h-6 w-6" />
            Technical Proficiency
          </h2>
          <Card className="p-8 text-center text-muted-foreground">
            No technical proficiencies added yet.
          </Card>
        </div>
      </section>
    );
  }

  // Group proficiencies by category
  const proficienciesByCategory = proficiencies.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, TechnicalProficiency[]>
  );

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8 flex items-center gap-2"
        >
          <ChartBar className="h-6 w-6" />
          Technical Proficiency
        </motion.h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {Object.entries(proficienciesByCategory).map(
            ([category, items], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all bg-gradient-to-br from-background to-accent/5">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {(() => {
                          const IconComponent =
                            CATEGORY_ICONS[
                              category as keyof typeof CATEGORY_ICONS
                            ] || Code2;
                          return (
                            <IconComponent className="h-5 w-5 text-primary" />
                          );
                        })()}
                      </div>
                      <h3 className="text-lg font-semibold capitalize">
                        {category}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {item.skill}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item.proficiency}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-primary/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-teal to-secondary-blue rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
