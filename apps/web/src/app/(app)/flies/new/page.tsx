import { FlyPatternForm } from "@/components/fly/fly-pattern-form";

export default function NewFlyPatternPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Create Fly Pattern</h1>
        <p className="text-muted-foreground">Add a new fly tying pattern to the library.</p>
      </div>
      <FlyPatternForm />
    </div>
  );
}
