import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

export const ProjectCardSkeleton = () => {
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-background via-background to-background/50 border border-primary-teal/10">
      {/* Image Skeleton */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-muted/20" />
        </div>
        {/* Animated loading overlay */}
        <div className="absolute inset-0">
          <motion.div
            className="w-full h-full bg-gradient-to-r from-transparent via-muted/10 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        {/* Category Badge Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="h-5 w-24 bg-muted/30 rounded-full" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative p-6 space-y-4">
        {/* Title and Description Skeletons */}
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="h-7 w-3/4 bg-muted/30 rounded-lg" />
            <div className="h-4 w-1/2 bg-muted/30 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/30 rounded" />
            <div className="h-4 w-5/6 bg-muted/30 rounded" />
          </div>
        </div>

        {/* Technology Badges Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-5 w-16 bg-muted/30 rounded-full" />
          ))}
        </div>

        {/* Action Links Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-primary-teal/10">
          <div className="flex gap-3">
            {[1, 2].map((index) => (
              <div key={index} className="h-5 w-5 bg-muted/30 rounded-full" />
            ))}
          </div>
          <div className="h-5 w-24 bg-muted/30 rounded" />
        </div>

        {/* Animated loading overlay for the entire card */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="w-full h-full bg-gradient-to-r from-transparent via-muted/5 to-transparent"
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>
    </Card>
  );
};

// export const ProjectsGridSkeleton = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//       {Array.from({ length: 6 }).map((_, index) => (
//         <motion.div
//           key={`skeleton-${index}`}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: index * 0.1 }}
//         >
//           <ProjectCardSkeleton />
//         </motion.div>
//       ))}
//     </div>
//   );
// };
