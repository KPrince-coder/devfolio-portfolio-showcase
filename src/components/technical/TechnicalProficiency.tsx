import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface TechnicalProficiency {
  id: string;
  skill: string;
  proficiency: number;
}

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
    return <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          Technical Proficiency
        </motion.h2>

        <div className="grid gap-6 max-w-2xl">
          {proficiencies?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.skill}</span>
                <span className="text-sm text-muted-foreground">{item.proficiency}%</span>
              </div>
              <Progress value={item.proficiency} className="h-2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};