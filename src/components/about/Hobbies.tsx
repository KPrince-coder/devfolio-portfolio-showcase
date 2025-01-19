import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Heart,
  Music,
  Gamepad2,
  Code,
  Palette,
  Dumbbell,
  Coffee,
  Plane,
  Mic,
  Bike,
  ChefHat,
  Sprout,
  Film,
  Puzzle,
  Camera,
  Book,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Hobby {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon_key: string;
}

const ICON_MAP = {
  music: Music,
  gamepad: Gamepad2,
  code: Code,
  palette: Palette,
  dumbbell: Dumbbell,
  coffee: Coffee,
  plane: Plane,
  mic: Mic,
  bike: Bike,
  chef: ChefHat,
  sprout: Sprout,
  film: Film,
  puzzle: Puzzle,
  camera: Camera,
  book: Book,
} as const;

const CATEGORY_COLORS = {
  "Arts & Creativity": {
    gradient: "from-primary-teal/5 to-secondary-blue/5",
    hover: "group-hover:from-primary-teal/10 group-hover:to-secondary-blue/10",
    text: "text-primary-teal",
  },
  "Sports & Fitness": {
    gradient: "from-secondary-blue/5 to-primary-teal/5",
    hover: "group-hover:from-secondary-blue/10 group-hover:to-primary-teal/10",
    text: "text-secondary-blue",
  },
  Technology: {
    gradient: "from-primary-teal/5 to-accent-coral/5",
    hover: "group-hover:from-primary-teal/10 group-hover:to-accent-coral/10",
    text: "text-primary-teal",
  },
  Entertainment: {
    gradient: "from-accent-coral/5 to-primary-mint/5",
    hover: "group-hover:from-accent-coral/10 group-hover:to-primary-mint/10",
    text: "text-accent-coral",
  },
  Lifestyle: {
    gradient: "from-primary-mint/5 to-secondary-blue/5",
    hover: "group-hover:from-primary-mint/10 group-hover:to-secondary-blue/10",
    text: "text-primary-mint",
  },
  Learning: {
    gradient: "from-secondary-blue/5 to-primary-teal/5",
    hover: "group-hover:from-secondary-blue/10 group-hover:to-primary-teal/10",
    text: "text-secondary-blue",
  },
} as const;

export const Hobbies = () => {
  const { data: hobbies, isLoading } = useQuery({
    queryKey: ["hobbies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hobbies")
        .select("*")
        .order("category");

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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              </Card>
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

  // Group hobbies by category
  const hobbiesByCategory = hobbies.reduce(
    (acc, hobby) => {
      if (!acc[hobby.category]) {
        acc[hobby.category] = [];
      }
      acc[hobby.category].push(hobby);
      return acc;
    },
    {} as Record<string, Hobby[]>
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
          <Heart className="h-6 w-6 text-primary-teal" />
          Interests & Hobbies
        </motion.h2>

        <div className="space-y-12">
          {Object.entries(hobbiesByCategory).map(
            ([category, items], categoryIndex) => (
              <div key={category} className="space-y-6">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className={cn(
                    "text-xl font-semibold",
                    CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]?.text || "text-primary-teal"
                  )}
                >
                  {category}
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((hobby, index) => {
                    const IconComponent =
                      ICON_MAP[hobby.icon_key as keyof typeof ICON_MAP] ||
                      Heart;
                    const colors =
                      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];

                    return (
                      <motion.div
                        key={hobby.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={cn(
                            "group relative overflow-hidden hover:shadow-lg transition-all duration-300",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute inset-0 bg-gradient-to-br transition-all duration-500",
                              colors?.gradient,
                              colors?.hover
                            )}
                          />
                          <div className="relative p-6">
                            <motion.div
                              className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4"
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <IconComponent className={cn(
                                "w-6 h-6",
                                colors?.text || "text-primary-teal"
                              )} />
                            </motion.div>
                            <h4 className={cn(
                              "text-lg font-semibold mb-2 transition-colors",
                              "group-hover:" + (colors?.text || "text-primary-teal")
                            )}>
                              {hobby.name}
                            </h4>
                            {hobby.description && (
                              <p className="text-sm text-muted-foreground">
                                {hobby.description}
                              </p>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
