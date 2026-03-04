"use client";

import { useState } from "react";
import { Badge, Card, CardContent, Input, Select, SelectOption } from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import {
  FLY_CATEGORIES,
  FLY_DIFFICULTIES,
  SEASONS,
} from "@fyshe/validators";

const CATEGORY_LABELS: Record<string, string> = {
  DRY_FLY: "Dry Fly",
  NYMPH: "Nymph",
  STREAMER: "Streamer",
  WET_FLY: "Wet Fly",
  EMERGER: "Emerger",
  TERRESTRIAL: "Terrestrial",
  MIDGE: "Midge",
  SALMON_FLY: "Salmon Fly",
  BASS_BUG: "Bass Bug",
  SALTWATER: "Saltwater",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

const SEASON_LABELS: Record<string, string> = {
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
  WINTER: "Winter",
};

const DIFFICULTY_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  BEGINNER: "outline",
  INTERMEDIATE: "secondary",
  ADVANCED: "default",
  EXPERT: "default",
};

interface FlyPatternItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: string | null;
  difficulty: string;
  seasons: string[];
  waterTypes: string[];
  targetSpecies: string[];
  regions: string[];
  createdAt: Date;
}

export function FlyPatternList({ initialItems }: { initialItems: FlyPatternItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [season, setSeason] = useState<string>("");

  const filters = {
    search: search || undefined,
    category: category || undefined,
    difficulty: difficulty || undefined,
    season: season || undefined,
  };

  const { data: items } = trpc.fly.list.useQuery(
    filters as Parameters<typeof trpc.fly.list.useQuery>[0],
  );

  const displayItems = items ?? initialItems;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search patterns..."
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
          {FLY_CATEGORIES.map((cat) => (
            <SelectOption key={cat} value={cat}>
              {CATEGORY_LABELS[cat] ?? cat}
            </SelectOption>
          ))}
        </Select>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-44"
        >
          <SelectOption value="">All Difficulties</SelectOption>
          {FLY_DIFFICULTIES.map((d) => (
            <SelectOption key={d} value={d}>
              {DIFFICULTY_LABELS[d] ?? d}
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
      </div>

      {displayItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No fly patterns found.</p>
            <a href="/flies/new" className="text-primary hover:underline text-sm">
              Create your first pattern
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <Link key={item.id} href={`/flies/${item.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{item.name}</h3>
                    <Badge variant={DIFFICULTY_COLORS[item.difficulty] ?? "outline"}>
                      {DIFFICULTY_LABELS[item.difficulty] ?? item.difficulty}
                    </Badge>
                  </div>
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </Badge>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  {item.targetSpecies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.targetSpecies.map((species) => (
                        <Badge key={species} variant="outline" className="text-xs">
                          {species}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {item.seasons.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.seasons.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {SEASON_LABELS[s] ?? s}
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
