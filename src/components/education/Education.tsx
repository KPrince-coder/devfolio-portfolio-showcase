import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year_start: string;
  year_end: string | null;
  type: 'degree' | 'certification';
}

export const Education = () => {
  const { data: education, isLoading } = useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("year_start", { ascending: false });

      if (error) throw error;
      return data as Education[];
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
          Education & Certifications
        </motion.h2>

        <div className="space-y-6">
          {education?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 mt-1">
                    {item.type === 'degree' ? (
                      <GraduationCap className="w-6 h-6 text-primary" />
                    ) : (
                      <Award className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.degree}</h3>
                    <p className="text-muted-foreground">{item.institution}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.year_start} - {item.year_end || 'Present'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};