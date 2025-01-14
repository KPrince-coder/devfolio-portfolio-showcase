import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

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
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <ChartBar className="h-6 w-6" />
            Technical Proficiency
          </h2>
          <div className="grid gap-6 max-w-2xl">
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
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <Progress value={item.proficiency} className="h-2" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};