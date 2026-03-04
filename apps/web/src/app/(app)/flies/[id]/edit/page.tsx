import { notFound } from "next/navigation";
import { createCaller } from "@/trpc/server";
import { FlyPatternForm } from "@/components/fly/fly-pattern-form";

export default async function EditFlyPatternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const pattern = await trpc.fly.getById({ id });
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Edit Pattern</h1>
          <p className="text-muted-foreground">Update {pattern.name}.</p>
        </div>
        <FlyPatternForm initialData={pattern} />
      </div>
    );
  } catch {
    notFound();
  }
}
