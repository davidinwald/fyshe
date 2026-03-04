"use client";

import { useState } from "react";
import { Badge, Card, CardContent, Select, SelectOption, Input } from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import Link from "next/link";

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

interface GearItem {
  id: string;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  status: string;
  imageUrl: string | null;
  rating: number | null;
}

export function GearList({ initialItems }: { initialItems: GearItem[] }) {
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");

  const filters = {
    category: category || undefined,
    status: status || undefined,
    search: search || undefined,
  };

  const { data: items } = trpc.gear.list.useQuery(filters as Parameters<typeof trpc.gear.list.useQuery>[0]);

  const displayItems = items ?? initialItems;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search gear..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-40">
          <SelectOption value="">All Categories</SelectOption>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <SelectOption key={value} value={value}>
              {label}
            </SelectOption>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
          <SelectOption value="">All Status</SelectOption>
          <SelectOption value="OWNED">Owned</SelectOption>
          <SelectOption value="WISHLIST">Wishlist</SelectOption>
          <SelectOption value="RETIRED">Retired</SelectOption>
          <SelectOption value="LOST">Lost</SelectOption>
        </Select>
      </div>

      {displayItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No gear items yet.</p>
            <a href="/gear/new" className="text-primary hover:underline text-sm">
              Add your first piece of gear
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <Link key={item.id} href={`/gear/${item.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{item.name}</h3>
                    <Badge variant={STATUS_COLORS[item.status] ?? "default"}>
                      {item.status.toLowerCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                    {item.brand && ` · ${item.brand}`}
                    {item.model && ` ${item.model}`}
                  </p>
                  {item.rating && (
                    <p className="text-sm">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
