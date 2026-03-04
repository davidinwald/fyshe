"use client";

import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Separator } from "@fyshe/ui";
import { trpc } from "@/trpc/client";

const CATEGORY_LABELS: Record<string, string> = {
  ROD: "Rod",
  REEL: "Reel",
  LINE: "Line",
  LURE: "Lure",
  FLY: "Fly",
  TACKLE: "Tackle",
  CLOTHING: "Clothing",
  ELECTRONICS: "Electronics",
  ACCESSORY: "Accessory",
  OTHER: "Other",
};

const STATUS_COLORS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  OWNED: "default",
  WISHLIST: "secondary",
  RETIRED: "outline",
  LOST: "destructive",
};

interface GearDetailProps {
  item: {
    id: string;
    name: string;
    category: string;
    brand: string | null;
    model: string | null;
    description: string | null;
    status: string;
    rating: number | null;
    notes: string | null;
    imageUrl: string | null;
    purchaseDate: Date | null;
    purchasePrice: unknown;
    createdAt: Date;
  };
}

export function GearDetail({ item }: GearDetailProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const deleteGear = trpc.gear.delete.useMutation({
    onSuccess: () => {
      utils.gear.list.invalidate();
      router.push("/gear");
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-muted-foreground">
              {CATEGORY_LABELS[item.category] ?? item.category}
            </span>
            <Badge variant={STATUS_COLORS[item.status] ?? "default"}>
              {item.status.toLowerCase()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/gear/${item.id}/edit`)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this gear item?")) {
                deleteGear.mutate({ id: item.id });
              }
            }}
            disabled={deleteGear.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(item.brand || item.model) && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Brand / Model</p>
              <p>
                {item.brand}
                {item.brand && item.model && " "}
                {item.model}
              </p>
            </div>
          )}

          {item.description && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          {item.rating && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rating</p>
              <p className="text-lg">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </p>
            </div>
          )}

          <Separator />

          {item.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Added {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => router.push("/gear")}>
        &larr; Back to Gear
      </Button>
    </div>
  );
}
