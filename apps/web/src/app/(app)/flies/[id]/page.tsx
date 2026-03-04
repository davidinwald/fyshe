import { notFound } from "next/navigation";
import { createCaller } from "@/trpc/server";
import { FlyPatternDetail } from "@/components/fly/fly-pattern-detail";

export default async function FlyPatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const pattern = await trpc.fly.getById({ id });
    return <FlyPatternDetail pattern={pattern} />;
  } catch {
    notFound();
  }
}
