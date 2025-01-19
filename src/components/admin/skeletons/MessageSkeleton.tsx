import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const MessageSkeleton = () => {
  return (
    <Card className="p-4 flex items-center justify-between bg-background/60">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4 rounded" />
        <div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48 mt-1" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </Card>
  );
};

export const MessageSkeletonList = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </motion.div>
  );
};
