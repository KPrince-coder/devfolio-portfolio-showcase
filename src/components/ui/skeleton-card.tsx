import { Card } from "./card";
import { Skeleton } from "./skeleton";

export const SkeletonCard = () => (
  <Card className="p-4">
    <Skeleton className="h-4 w-3/4 mb-4" />
    <Skeleton className="h-3 w-1/2 mb-2" />
    <Skeleton className="h-3 w-2/3" />
  </Card>
);