import { notFound } from "next/navigation";
import { createCaller } from "@/trpc/server";
import { GearForm } from "@/components/gear/gear-form";

export default async function EditGearPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const item = await trpc.gear.getById({ id });
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold">Edit Gear</h1>
          <p className="text-muted-foreground">Update {item.name}.</p>
        </div>
        <GearForm initialData={item} />
      </div>
    );
  } catch {
    notFound();
  }
}
