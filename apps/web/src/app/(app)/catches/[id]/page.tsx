import { notFound } from "next/navigation";
import { createCaller } from "@/trpc/server";
import { CatchDetail } from "@/components/catch/catch-detail";

export default async function CatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const item = await trpc.catch.getById({ id });
    return <CatchDetail item={item} />;
  } catch {
    notFound();
  }
}
