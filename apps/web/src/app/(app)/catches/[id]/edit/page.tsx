import { notFound } from "next/navigation";
import { createCaller } from "@/trpc/server";
import { CatchForm } from "@/components/catch/catch-form";

export default async function EditCatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const item = await trpc.catch.getById({ id });
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Edit Catch</h1>
          <p className="text-muted-foreground">Update your {item.species} catch.</p>
        </div>
        <CatchForm initialData={item} />
      </div>
    );
  } catch {
    notFound();
  }
}
