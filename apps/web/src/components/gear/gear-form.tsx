"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectOption,
} from "@fyshe/ui";
import { trpc } from "@/trpc/client";

const CATEGORIES = [
  { value: "ROD", label: "Rod" },
  { value: "REEL", label: "Reel" },
  { value: "LINE", label: "Line" },
  { value: "LURE", label: "Lure" },
  { value: "FLY", label: "Fly" },
  { value: "TACKLE", label: "Tackle" },
  { value: "CLOTHING", label: "Clothing" },
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "ACCESSORY", label: "Accessory" },
  { value: "OTHER", label: "Other" },
] as const;

interface GearFormProps {
  initialData?: {
    id: string;
    name: string;
    category: string;
    brand: string | null;
    model: string | null;
    description: string | null;
    status: string;
    rating: number | null;
    notes: string | null;
  };
}

export function GearForm({ initialData }: GearFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "ROD");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "OWNED");
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [notes, setNotes] = useState(initialData?.notes ?? "");

  const utils = trpc.useUtils();

  const createGear = trpc.gear.create.useMutation({
    onSuccess: () => {
      utils.gear.list.invalidate();
      router.push("/gear");
    },
  });

  const updateGear = trpc.gear.update.useMutation({
    onSuccess: () => {
      utils.gear.list.invalidate();
      utils.gear.getById.invalidate({ id: initialData!.id });
      router.push(`/gear/${initialData!.id}`);
    },
  });

  const mutation = isEditing ? updateGear : createGear;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name,
      category: category as (typeof CATEGORIES)[number]["value"],
      brand: brand || undefined,
      model: model || undefined,
      description: description || undefined,
      status: status as "OWNED" | "WISHLIST" | "RETIRED" | "LOST",
      rating: rating || undefined,
      notes: notes || undefined,
    };

    if (isEditing) {
      updateGear.mutate({ id: initialData!.id, data });
    } else {
      createGear.mutate(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Gear" : "New Gear Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Orvis Helios 3F"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <SelectOption key={c.value} value={c.value}>
                    {c.label}
                  </SelectOption>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <SelectOption value="OWNED">Owned</SelectOption>
                <SelectOption value="WISHLIST">Wishlist</SelectOption>
                <SelectOption value="RETIRED">Retired</SelectOption>
                <SelectOption value="LOST">Lost</SelectOption>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Orvis"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Helios 3F 9' 5wt"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this piece of gear..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="text-2xl transition-colors hover:text-primary"
                >
                  {star <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Gear"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-sm text-destructive">{mutation.error.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
