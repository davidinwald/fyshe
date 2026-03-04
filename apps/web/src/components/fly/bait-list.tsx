"use client";

import { useState } from "react";
import { Badge, Card, CardContent, Input, Select, SelectOption } from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { BAIT_CATEGORIES, SEASONS, WATER_TYPES } from "@fyshe/validators";

const BAIT_CATEGORY_LABELS: Record<string, string> = {
  LIVE_BAIT: "Live Bait",
  CUT_BAIT: "Cut Bait",
  ARTIFICIAL_BAIT: "Artificial Bait",
  DOUGH_BAIT: "Dough Bait",
  PREPARED_BAIT: "Prepared Bait",
};

const SEASON_LABELS: Record<string, string> = {
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
  WINTER: "Winter",
};

const WATER_TYPE_LABELS: Record<string, string> = {
  RIVER: "River",
  STREAM: "Stream",
  LAKE: "Lake",
  POND: "Pond",
  RESERVOIR: "Reservoir",
  SALTWATER: "Saltwater",
  BRACKISH: "Brackish",
};

interface BaitItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  seasons: string[];
  waterTypes: string[];
  targetSpecies: string[];
}

export function BaitList({ initialItems }: { initialItems: BaitItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [waterType, setWaterType] = useState<string>("");

  const filters = {
    search: search || undefined,
    category: category || undefined,
    season: season || undefined,
    waterType: waterType || undefined,
  };

  const { data: items } = trpc.bait.list.useQuery(
    filters as Parameters<typeof trpc.bait.list.useQuery>[0],
  );

  const displayItems = items ?? initialItems;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search baits..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-44"
        >
          <SelectOption value="">All Categories</SelectOption>
          {BAIT_CATEGORIES.map((cat) => (
            <SelectOption key={cat} value={cat}>
              {BAIT_CATEGORY_LABELS[cat] ?? cat}
            </SelectOption>
          ))}
        </Select>
        <Select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="w-40"
        >
          <SelectOption value="">All Seasons</SelectOption>
          {SEASONS.map((s) => (
            <SelectOption key={s} value={s}>
              {SEASON_LABELS[s] ?? s}
            </SelectOption>
          ))}
        </Select>
        <Select
          value={waterType}
          onChange={(e) => setWaterType(e.target.value)}
          className="w-40"
        >
          <SelectOption value="">All Water Types</SelectOption>
          {WATER_TYPES.map((wt) => (
            <SelectOption key={wt} value={wt}>
              {WATER_TYPE_LABELS[wt] ?? wt}
            </SelectOption>
          ))}
        </Select>
      </div>

      {displayItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No bait types found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item: BaitItem) => (
            <Link key={item.id} href={`/flies/bait/${item.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{item.name}</h3>
                    <Badge variant="secondary">
                      {BAIT_CATEGORY_LABELS[item.category] ?? item.category}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.seasons.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.seasons.map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {SEASON_LABELS[s] ?? s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.targetSpecies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.targetSpecies.map((species: string) => (
                        <Badge key={species} variant="outline" className="text-xs">
                          {species}
                        </Badge>
                      ))}
                    </div>
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
