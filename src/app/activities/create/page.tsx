import { ActivityForm } from "@/components/activities/activity-form";

export default function CreateActivityPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Activity</h1>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <ActivityForm />
        </div>
      </div>
    </div>
  );
}
