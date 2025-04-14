import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ActivitiesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activities</h1>
        <Link href="/activities/create">
          <Button>Create Activity</Button>
        </Link>
      </div>
      <div className="mt-8">
        {/* TODO: Add activity list */}
        <p className="text-muted-foreground">No activities found.</p>
      </div>
    </div>
  );
}
