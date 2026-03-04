import { notFound } from "next/navigation";
import { createCaller } from "@/trpc/server";
import { GearDetail } from "@/components/gear/gear-detail";

export default async function GearDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const item = await trpc.gear.getById({ id });
    return <GearDetail item={item} />;
  } catch {
    notFound();
  }
}
