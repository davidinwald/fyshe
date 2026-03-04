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
import {
  FLY_CATEGORIES,
  FLY_TYPES,
  FLY_DIFFICULTIES,
  SEASONS,
  WATER_TYPES,
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

interface MaterialRow {
  part: string;
  material: string;
  color: string;
  quantity: string;
}

interface StepRow {
  instruction: string;
  tip: string;
}

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

interface FlyPatternFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    type: string | null;
    difficulty: string;
    hookSize: string | null;
    hookType: string | null;
    threadColor: string | null;
    seasons: string[];
    waterTypes: string[];
    targetSpecies: string[];
    regions: string[];
    materials: PatternMaterial[];
    tyingSteps: TyingStep[];
  };
}

export function FlyPatternForm({ initialData }: FlyPatternFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [type, setType] = useState(initialData?.type ?? "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? "INTERMEDIATE");
  const [hookSize, setHookSize] = useState(initialData?.hookSize ?? "");
  const [hookType, setHookType] = useState(initialData?.hookType ?? "");
  const [threadColor, setThreadColor] = useState(initialData?.threadColor ?? "");
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(
    initialData?.seasons ?? [],
  );
  const [selectedWaterTypes, setSelectedWaterTypes] = useState<string[]>(
    initialData?.waterTypes ?? [],
  );
  const [targetSpeciesInput, setTargetSpeciesInput] = useState(
    initialData?.targetSpecies?.join(", ") ?? "",
  );
  const [regionsInput, setRegionsInput] = useState(
    initialData?.regions?.join(", ") ?? "",
  );
  const [materials, setMaterials] = useState<MaterialRow[]>(
    initialData?.materials
      ?.sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => ({
        part: m.part,
        material: m.material,
        color: m.color ?? "",
        quantity: m.quantity ?? "",
      })) ?? [{ part: "", material: "", color: "", quantity: "" }],
  );
  const [steps, setSteps] = useState<StepRow[]>(
    initialData?.tyingSteps
      ?.sort((a, b) => a.stepNumber - b.stepNumber)
      .map((s) => ({
        instruction: s.instruction,
        tip: s.tip ?? "",
      })) ?? [{ instruction: "", tip: "" }],
  );

  const utils = trpc.useUtils();

  const createPattern = trpc.fly.create.useMutation({
    onSuccess: () => {
      utils.fly.list.invalidate();
      router.push("/flies");
    },
  });

  const updatePattern = trpc.fly.update.useMutation({
    onSuccess: () => {
      utils.fly.list.invalidate();
      utils.fly.getById.invalidate({ id: initialData!.id });
      router.push(`/flies/${initialData!.id}`);
    },
  });

  const mutation = isEditing ? updatePattern : createPattern;

  function toggleSeason(season: string) {
    setSelectedSeasons((prev) =>
      prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season],
    );
  }

  function toggleWaterType(wt: string) {
    setSelectedWaterTypes((prev) =>
      prev.includes(wt) ? prev.filter((w) => w !== wt) : [...prev, wt],
    );
  }

  function updateMaterial(index: number, field: keyof MaterialRow, value: string) {
    setMaterials((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function addMaterial() {
    setMaterials((prev) => [...prev, { part: "", material: "", color: "", quantity: "" }]);
  }

  function removeMaterial(index: number) {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, field: keyof StepRow, value: string) {
    setSteps((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function addStep() {
    setSteps((prev) => [...prev, { instruction: "", tip: "" }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function parseCommaSeparated(input: string): string[] {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validMaterials = materials
      .filter((m) => m.part && m.material)
      .map((m, i) => ({
        part: m.part,
        material: m.material,
        color: m.color || undefined,
        quantity: m.quantity || undefined,
        sortOrder: i,
      }));

    const validSteps = steps
      .filter((s) => s.instruction)
      .map((s, i) => ({
        stepNumber: i + 1,
        instruction: s.instruction,
        tip: s.tip || undefined,
      }));

    const data = {
      name,
      description: description || undefined,
      category: category as typeof FLY_CATEGORIES[number],
      type: (type || undefined) as typeof FLY_TYPES[number] | undefined,
      difficulty: difficulty as typeof FLY_DIFFICULTIES[number],
      hookSize: hookSize || undefined,
      hookType: hookType || undefined,
      threadColor: threadColor || undefined,
      seasons: selectedSeasons as (typeof SEASONS[number])[],
      waterTypes: selectedWaterTypes as (typeof WATER_TYPES[number])[],
      targetSpecies: parseCommaSeparated(targetSpeciesInput),
      regions: parseCommaSeparated(regionsInput),
      materials: validMaterials.length > 0 ? validMaterials : undefined,
      tyingSteps: validSteps.length > 0 ? validSteps : undefined,
    };

    if (isEditing) {
      updatePattern.mutate({ id: initialData!.id, data });
    } else {
      createPattern.mutate(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Pattern" : "New Pattern"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adams Dry Fly"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the pattern, its history, and when to use it..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <SelectOption value="">Select category...</SelectOption>
                {FLY_CATEGORIES.map((cat) => (
                  <SelectOption key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <SelectOption value="">Select type...</SelectOption>
                {FLY_TYPES.map((t) => (
                  <SelectOption key={t} value={t}>
                    {TYPE_LABELS[t] ?? t}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {FLY_DIFFICULTIES.map((d) => (
                  <SelectOption key={d} value={d}>
                    {DIFFICULTY_LABELS[d] ?? d}
                  </SelectOption>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hookSize">Hook Size</Label>
              <Input
                id="hookSize"
                value={hookSize}
                onChange={(e) => setHookSize(e.target.value)}
                placeholder="e.g. #14"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hookType">Hook Type</Label>
              <Input
                id="hookType"
                value={hookType}
                onChange={(e) => setHookType(e.target.value)}
                placeholder="e.g. Standard Dry"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threadColor">Thread Color</Label>
              <Input
                id="threadColor"
                value={threadColor}
                onChange={(e) => setThreadColor(e.target.value)}
                placeholder="e.g. Black 6/0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Seasons</Label>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer transition-colors ${
                    selectedSeasons.includes(s)
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSeasons.includes(s)}
                    onChange={() => toggleSeason(s)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm">{SEASON_LABELS[s] ?? s}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Water Types</Label>
            <div className="flex flex-wrap gap-2">
              {WATER_TYPES.map((wt) => (
                <label
                  key={wt}
                  className={`flex items-center gap-2 rounded-md border p-2 cursor-pointer transition-colors ${
                    selectedWaterTypes.includes(wt)
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedWaterTypes.includes(wt)}
                    onChange={() => toggleWaterType(wt)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm">{WATER_TYPE_LABELS[wt] ?? wt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetSpecies">Target Species</Label>
            <Input
              id="targetSpecies"
              value={targetSpeciesInput}
              onChange={(e) => setTargetSpeciesInput(e.target.value)}
              placeholder="e.g. Rainbow Trout, Brown Trout, Brook Trout"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regions">Regions</Label>
            <Input
              id="regions"
              value={regionsInput}
              onChange={(e) => setRegionsInput(e.target.value)}
              placeholder="e.g. Rocky Mountains, Pacific Northwest"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Materials</Label>
              <Button type="button" variant="outline" onClick={addMaterial}>
                Add Material
              </Button>
            </div>
            {materials.map((mat, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-5 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Part</Label>
                  <Input
                    value={mat.part}
                    onChange={(e) => updateMaterial(index, "part", e.target.value)}
                    placeholder="e.g. Tail"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Material</Label>
                  <Input
                    value={mat.material}
                    onChange={(e) => updateMaterial(index, "material", e.target.value)}
                    placeholder="e.g. Hackle fibers"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Color</Label>
                  <Input
                    value={mat.color}
                    onChange={(e) => updateMaterial(index, "color", e.target.value)}
                    placeholder="e.g. Brown"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    value={mat.quantity}
                    onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                    placeholder="e.g. Small bunch"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeMaterial(index)}
                  disabled={materials.length <= 1}
                  className="h-10"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tying Steps</Label>
              <Button type="button" variant="outline" onClick={addStep}>
                Add Step
              </Button>
            </div>
            {steps.map((step, index) => (
              <div key={index} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Step {index + 1}</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Instruction</Label>
                  <Textarea
                    value={step.instruction}
                    onChange={(e) => updateStep(index, "instruction", e.target.value)}
                    placeholder="Describe this tying step..."
                    rows={2}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tip (optional)</Label>
                  <Input
                    value={step.tip}
                    onChange={(e) => updateStep(index, "tip", e.target.value)}
                    placeholder="Any helpful tip for this step..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Pattern"}
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
