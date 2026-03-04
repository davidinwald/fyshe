"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectOption,
} from "@fyshe/ui";
import { trpc } from "@/trpc/client";

const FISHING_METHODS = ["FLY", "SPIN", "BAIT", "TROLLING", "ICE", "SURF", "OTHER"] as const;

const METHOD_LABELS: Record<string, string> = {
  FLY: "Fly Fishing",
  SPIN: "Spin Fishing",
  BAIT: "Bait Fishing",
  TROLLING: "Trolling",
  ICE: "Ice Fishing",
  SURF: "Surf Fishing",
  OTHER: "Other",
};

interface PreferencesFormProps {
  preferences: {
    preferredSpecies: string[];
    preferredMethods: string[];
    unitSystem: string;
    defaultVisibility: string;
  } | null;
}

export function PreferencesForm({ preferences }: PreferencesFormProps) {
  const [unitSystem, setUnitSystem] = useState(preferences?.unitSystem ?? "IMPERIAL");
  const [defaultVisibility, setDefaultVisibility] = useState(
    preferences?.defaultVisibility ?? "PRIVATE",
  );
  const [methods, setMethods] = useState<string[]>(preferences?.preferredMethods ?? []);
  const [species, setSpecies] = useState(preferences?.preferredSpecies?.join(", ") ?? "");

  const utils = trpc.useUtils();
  const updatePreferences = trpc.user.updatePreferences.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
    },
  });

  function toggleMethod(method: string) {
    setMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updatePreferences.mutate({
      unitSystem: unitSystem as "IMPERIAL" | "METRIC",
      defaultVisibility: defaultVisibility as "PUBLIC" | "PRIVATE" | "FOLLOWERS_ONLY",
      preferredMethods: methods as typeof FISHING_METHODS[number][],
      preferredSpecies: species
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Preferred Fishing Methods</Label>
            <div className="flex flex-wrap gap-2">
              {FISHING_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => toggleMethod(method)}
                  className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                    methods.includes(method)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-accent"
                  }`}
                >
                  {METHOD_LABELS[method]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Preferred Species</Label>
            <input
              id="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="Trout, Bass, Salmon..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Comma-separated list</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="unitSystem">Unit System</Label>
              <Select
                id="unitSystem"
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
              >
                <SelectOption value="IMPERIAL">Imperial (lb, in)</SelectOption>
                <SelectOption value="METRIC">Metric (kg, cm)</SelectOption>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Default Visibility</Label>
              <Select
                id="visibility"
                value={defaultVisibility}
                onChange={(e) => setDefaultVisibility(e.target.value)}
              >
                <SelectOption value="PRIVATE">Private</SelectOption>
                <SelectOption value="PUBLIC">Public</SelectOption>
                <SelectOption value="FOLLOWERS_ONLY">Followers Only</SelectOption>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={updatePreferences.isPending}>
            {updatePreferences.isPending ? "Saving..." : "Save Preferences"}
          </Button>

          {updatePreferences.isSuccess && (
            <p className="text-sm text-green-600">Preferences updated.</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
