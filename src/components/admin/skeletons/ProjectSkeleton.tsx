import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectSkeleton = () => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start space-x-4">
        {/* Project Image Skeleton */}
        <Skeleton className="w-24 h-24 rounded-lg" />
        
        <div className="flex-1 space-y-2">
          {/* Title Skeleton */}
          <Skeleton className="h-6 w-3/4" />
          
          {/* Description Skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          
          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </Card>
  );
};

export const ProjectSkeletonList = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <ProjectSkeleton key={index} />
      ))}
    </motion.div>
  );
};
