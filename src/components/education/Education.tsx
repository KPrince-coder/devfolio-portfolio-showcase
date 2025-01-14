import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton-card";

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
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Education & Certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!education?.length) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Education & Certifications
          </h2>
          <Card className="p-8 text-center text-muted-foreground">
            No education or certifications added yet.
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
          <GraduationCap className="h-6 w-6" />
          Education & Certifications
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {education?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    {item.type === 'degree' ? (
                      <GraduationCap className="w-6 h-6 text-primary" />
                    ) : (
                      <Award className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{item.degree}</h3>
                    <p className="text-muted-foreground truncate">{item.institution}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <p className="text-sm text-muted-foreground">
                    {item.year_start} - {item.year_end || 'Present'}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};