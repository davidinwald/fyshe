"use client";

import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@fyshe/ui";
import { trpc } from "@/trpc/client";

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

const TYPE_LABELS: Record<string, string> = {
  ATTRACTOR: "Attractor",
  IMITATOR: "Imitator",
  SEARCHING: "Searching",
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

const WATER_TYPE_LABELS: Record<string, string> = {
  RIVER: "River",
  STREAM: "Stream",
  LAKE: "Lake",
  POND: "Pond",
  RESERVOIR: "Reservoir",
  SALTWATER: "Saltwater",
  BRACKISH: "Brackish",
};

interface PatternMaterial {
  id: string;
  part: string;
  material: string;
  color: string | null;
  quantity: string | null;
  sortOrder: number;
}

interface TyingStep {
  id: string;
  stepNumber: number;
  instruction: string;
  tip: string | null;
  imageUrl: string | null;
}

interface FlyPatternDetailProps {
  pattern: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    type: string | null;
    difficulty: string;
    hookSize: string | null;
    hookType: string | null;
    threadColor: string | null;
    imageUrl: string | null;
    seasons: string[];
    waterTypes: string[];
    targetSpecies: string[];
    regions: string[];
    materials: PatternMaterial[];
    tyingSteps: TyingStep[];
    createdAt: Date;
    createdById: string | null;
  };
}

export function FlyPatternDetail({ pattern }: FlyPatternDetailProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const deletePattern = trpc.fly.delete.useMutation({
    onSuccess: () => {
      utils.fly.list.invalidate();
      router.push("/flies");
    },
  });

  const sortedMaterials = [...pattern.materials].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const sortedSteps = [...pattern.tyingSteps].sort(
    (a, b) => a.stepNumber - b.stepNumber,
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pattern.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge>{CATEGORY_LABELS[pattern.category] ?? pattern.category}</Badge>
            {pattern.type && (
              <Badge variant="secondary">
                {TYPE_LABELS[pattern.type] ?? pattern.type}
              </Badge>
            )}
            <Badge variant="outline">
              {DIFFICULTY_LABELS[pattern.difficulty] ?? pattern.difficulty}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/flies/${pattern.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Delete this pattern?")) {
                deletePattern.mutate({ id: pattern.id });
              }
            }}
            disabled={deletePattern.isPending}
          >
            Delete
          </Button>
        </div>
      </div>

      {pattern.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{pattern.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Hook Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {pattern.hookSize && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hook Size</p>
                <p>{pattern.hookSize}</p>
              </div>
            )}
            {pattern.hookType && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hook Type</p>
                <p>{pattern.hookType}</p>
              </div>
            )}
            {pattern.threadColor && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Thread Color</p>
                <p>{pattern.threadColor}</p>
              </div>
            )}
          </div>
          {!pattern.hookSize && !pattern.hookType && !pattern.threadColor && (
            <p className="text-sm text-muted-foreground">No hook details specified.</p>
          )}
        </CardContent>
      </Card>

      {sortedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Part</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Material</th>
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Color</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMaterials.map((mat) => (
                    <tr key={mat.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{mat.part}</td>
                      <td className="py-2 pr-4">{mat.material}</td>
                      <td className="py-2 pr-4">{mat.color ?? "-"}</td>
                      <td className="py-2">{mat.quantity ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tying Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedSteps.map((step) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {step.stepNumber}
                </div>
                <div className="flex-1 space-y-1">
                  <p>{step.instruction}</p>
                  {step.tip && (
                    <p className="text-sm text-muted-foreground italic">
                      Tip: {step.tip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pattern.targetSpecies.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Target Species</p>
              <div className="flex flex-wrap gap-2">
                {pattern.targetSpecies.map((species) => (
                  <Badge key={species} variant="secondary">
                    {species}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {pattern.seasons.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Seasons</p>
              <div className="flex flex-wrap gap-2">
                {pattern.seasons.map((s) => (
                  <Badge key={s} variant="outline">
                    {SEASON_LABELS[s] ?? s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {pattern.waterTypes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Water Types</p>
              <div className="flex flex-wrap gap-2">
                {pattern.waterTypes.map((wt) => (
                  <Badge key={wt} variant="outline">
                    {WATER_TYPE_LABELS[wt] ?? wt}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {pattern.regions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Regions</p>
              <div className="flex flex-wrap gap-2">
                {pattern.regions.map((r) => (
                  <Badge key={r} variant="outline">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="text-xs text-muted-foreground">
            Created {new Date(pattern.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => router.push("/flies")}>
        &larr; Back to Patterns
      </Button>
    </div>
  );
}
