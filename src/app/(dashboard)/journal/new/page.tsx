import { JournalEditor } from "@/components/journal/journal-editor";

export default function NewJournalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Journal Entry</h1>
        <p className="text-muted-foreground">
          Write freely or use an AI-generated prompt to get started.
        </p>
      </div>
      <JournalEditor />
    </div>
  );
}
