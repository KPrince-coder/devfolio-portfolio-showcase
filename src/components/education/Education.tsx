import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Award, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
      <section className="py-10 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Education & Certifications
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 w-full">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-8 flex items-center gap-2"
        >
          <GraduationCap className="h-8 w-8" />
          Education & Certifications
        </motion.h2>

        <div className="space-y-6">
          {education?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                    {item.type === 'degree' ? (
                      <GraduationCap className="w-6 h-6 text-primary" />
                    ) : (
                      <Award className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.degree}</h3>
                    <p className="text-muted-foreground text-lg mb-2">{item.institution}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{item.year_start} - {item.year_end || 'Present'}</span>
                    </div>
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