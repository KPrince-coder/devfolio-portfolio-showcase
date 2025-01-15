import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Music, Camera, Book, Gamepad, Code, Palette, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton-card";

interface Hobby {
  id: string;
  name: string;
  category: string;
  icon_key: string;
}

const ICON_MAP = {
  heart: Heart,
  music: Music,
  camera: Camera,
  book: Book,
  gamepad: Gamepad,
  code: Code,
  palette: Palette,
  dumbbell: Dumbbell
};

export const Hobbies = () => {
  const { data: hobbies, isLoading } = useQuery({
    queryKey: ["hobbies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hobbies")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      return data as Hobby[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Heart className="h-6 w-6" />
            Interests & Hobbies
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

  if (!hobbies?.length) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Heart className="h-6 w-6" />
            Interests & Hobbies
          </h2>
          <Card className="p-8 text-center text-muted-foreground">
            No hobbies or interests added yet.
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
          <Heart className="h-6 w-6" />
          Interests & Hobbies
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hobbies?.map((hobby, index) => {
            const IconComponent = ICON_MAP[hobby.icon_key as keyof typeof ICON_MAP] || Heart;
            
            return (
              <motion.div
                key={hobby.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{hobby.name}</h3>
                      <p className="text-sm text-muted-foreground">{hobby.category}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};