import { ActivityForm } from "@/components/activities/activity-form";

export default function CreateActivityModal() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-semibold">Create New Activity</h2>
          <ActivityForm />
        </div>
      </div>
    </div>
  );
}
