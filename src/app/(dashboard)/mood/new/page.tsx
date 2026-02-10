import { MoodForm } from "@/components/mood/mood-form";

export default function NewMoodPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Log Mood</h1>
        <p className="text-muted-foreground">
          How are you feeling right now? Rate each area on a scale.
        </p>
      </div>
      <MoodForm />
    </div>
  );
}
