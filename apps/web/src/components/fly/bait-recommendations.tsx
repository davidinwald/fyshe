"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectOption,
} from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { SEASONS, WATER_TYPES } from "@fyshe/validators";

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

const BAIT_CATEGORY_LABELS: Record<string, string> = {
  LIVE_BAIT: "Live Bait",
  CUT_BAIT: "Cut Bait",
  ARTIFICIAL_BAIT: "Artificial Bait",
  DOUGH_BAIT: "Dough Bait",
  PREPARED_BAIT: "Prepared Bait",
};

interface RecommendedBait {
  id: string;
  name: string;
  category: string;
  description: string | null;
  score: number;
  reasons?: string[];
}

export function BaitRecommendations() {
  const [season, setSeason] = useState<string>("");
  const [waterType, setWaterType] = useState<string>("");
  const [targetSpecies, setTargetSpecies] = useState("");
  const [region, setRegion] = useState("");
  const [enabled, setEnabled] = useState(false);

  const filters = {
    season: season || undefined,
    waterType: waterType || undefined,
    targetSpecies: targetSpecies || undefined,
    region: region || undefined,
  };

  const { data: recommendations, isLoading, isError, error } = trpc.bait.recommend.useQuery(
    filters as Parameters<typeof trpc.bait.recommend.useQuery>[0],
    { enabled },
  );

  function handleGetRecommendations() {
    setEnabled(true);
  }

  const results = (recommendations ?? []) as unknown as RecommendedBait[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Season</label>
              <Select
                value={season}
                onChange={(e) => {
                  setSeason(e.target.value);
                  setEnabled(false);
                }}
              >
                <SelectOption value="">Any Season</SelectOption>
                {SEASONS.map((s) => (
                  <SelectOption key={s} value={s}>
                    {SEASON_LABELS[s] ?? s}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Water Type</label>
              <Select
                value={waterType}
                onChange={(e) => {
                  setWaterType(e.target.value);
                  setEnabled(false);
                }}
              >
                <SelectOption value="">Any Water Type</SelectOption>
                {WATER_TYPES.map((wt) => (
                  <SelectOption key={wt} value={wt}>
                    {WATER_TYPE_LABELS[wt] ?? wt}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Species</label>
              <Input
                value={targetSpecies}
                onChange={(e) => {
                  setTargetSpecies(e.target.value);
                  setEnabled(false);
                }}
                placeholder="e.g. Largemouth Bass"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Input
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setEnabled(false);
                }}
                placeholder="e.g. Southeast"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleGetRecommendations} disabled={isLoading}>
              {isLoading ? "Loading..." : "Get Recommendations"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isError && (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {enabled && results.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No recommendations found for these conditions. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((rec) => (
            <Link key={rec.id} href={`/flies/bait/${rec.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold leading-tight">{rec.name}</h3>
                    <Badge variant="secondary">
                      {BAIT_CATEGORY_LABELS[rec.category] ?? rec.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, rec.score)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {rec.score}%
                    </span>
                  </div>
                  {rec.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {rec.description}
                    </p>
                  )}
                  {rec.reasons && rec.reasons.length > 0 && (
                    <div className="space-y-1">
                      {rec.reasons.map((reason: string, i: number) => (
                        <p key={i} className="text-xs text-muted-foreground">
                          {reason}
                        </p>
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
