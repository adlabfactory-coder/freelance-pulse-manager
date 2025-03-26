
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfileLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-4 mt-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

export default UserProfileLoading;
