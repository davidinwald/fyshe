import { CatchForm } from "@/components/catch/catch-form";

export default function NewCatchPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Log Catch</h1>
        <p className="text-muted-foreground">Record the details of your catch.</p>
      </div>
      <CatchForm />
    </div>
  );
}
