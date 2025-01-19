import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  GraduationCap,
  Award,
  Calendar,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year_start: string;
  year_end: string | null;
  type: "degree" | "certification";
  description?: string;
  url?: string;
  location?: string;
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
          <div className="grid gap-6 lg:grid-cols-2">
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

  if (!education?.length) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Education & Certifications
          </h2>
          <Card className="p-8 text-center text-muted-foreground">
            No education history added yet.
          </Card>
        </div>
      </section>
    );
  }

  // Group by type
  const degrees = education.filter((item) => item.type === "degree");
  const certifications = education.filter(
    (item) => item.type === "certification"
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
          <GraduationCap className="h-6 w-6 text-primary" />
          Education & Certifications
        </motion.h2>

        <div className="space-y-8">
          {/* Degrees */}
          {degrees.length > 0 && (
            <div className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-xl font-semibold flex items-center gap-2 text-primary-teal"
              >
                <GraduationCap className="h-5 w-5" />
                Academic Degrees
              </motion.h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {degrees.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/5 to-secondary-blue/5 group-hover:from-primary-teal/10 group-hover:to-secondary-blue/10 transition-all duration-500" />
                      <div className="relative p-6">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <motion.div
                              className="w-12 h-12 rounded-lg bg-primary-teal/10 flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <GraduationCap className="w-6 h-6 text-primary-teal" />
                            </motion.div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold group-hover:text-primary-teal transition-colors">
                              {item.degree}
                            </h4>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="w-4 h-4" />
                              <span>{item.institution}</span>
                            </div>
                            {item.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center">
                                  📍
                                </span>
                                {item.location}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {item.year_start} - {item.year_end || "Present"}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                            {item.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 mt-2 group-hover:bg-primary-teal/10 group-hover:text-primary-teal group-hover:border-primary-teal transition-colors"
                                onClick={() => window.open(item.url, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-xl font-semibold flex items-center gap-2 text-primary-teal"
              >
                <Award className="h-5 w-5" />
                Professional Certifications
              </motion.h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {certifications.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-teal/5 to-secondary-blue/5 group-hover:from-primary-teal/10 group-hover:to-secondary-blue/10 transition-all duration-500" />
                      <div className="relative p-6">
                        <div className="flex gap-4">
                          <div className="shrink-0">
                            <motion.div
                              className="w-12 h-12 rounded-lg bg-primary-teal/10 flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Award className="w-6 h-6 text-primary-teal" />
                            </motion.div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold group-hover:text-primary-teal transition-colors">
                              {item.degree}
                            </h4>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="w-4 h-4" />
                              <span>{item.institution}</span>
                            </div>
                            {item.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center">
                                  📍
                                </span>
                                {item.location}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {item.year_start} - {item.year_end || "Present"}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">
                                {item.description}
                              </p>
                            )}
                            {item.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 mt-2 group-hover:bg-primary-teal/10 group-hover:text-primary-teal group-hover:border-primary-teal transition-colors"
                                onClick={() => window.open(item.url, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
