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
import { LocationPicker } from "@/components/ui/location-picker";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { trpc } from "@/trpc/client";

const METHODS = [
  { value: "FLY", label: "Fly" },
  { value: "SPIN", label: "Spin" },
  { value: "BAIT", label: "Bait" },
  { value: "TROLLING", label: "Trolling" },
  { value: "ICE", label: "Ice" },
  { value: "SURF", label: "Surf" },
  { value: "OTHER", label: "Other" },
] as const;

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE", label: "Private" },
  { value: "FOLLOWERS_ONLY", label: "Followers Only" },
  { value: "PUBLIC", label: "Public" },
] as const;

interface CatchFormProps {
  initialData?: {
    id: string;
    species: string;
    length: unknown;
    weight: unknown;
    method: string | null;
    locationName: string | null;
    latitude: unknown;
    longitude: unknown;
    caughtAt: Date;
    released: boolean;
    notes: string | null;
    visibility: string;
    gear: { gear: { id: string; name: string; category: string } }[];
  };
}

function formatDateForInput(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function CatchForm({ initialData }: CatchFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [species, setSpecies] = useState(initialData?.species ?? "");
  const [length, setLength] = useState<string>(
    initialData?.length != null ? String(initialData.length) : "",
  );
  const [weight, setWeight] = useState<string>(
    initialData?.weight != null ? String(initialData.weight) : "",
  );
  const [method, setMethod] = useState(initialData?.method ?? "");
  const [locationName, setLocationName] = useState(initialData?.locationName ?? "");
  const [latitude, setLatitude] = useState<number | undefined>(
    initialData?.latitude != null ? Number(initialData.latitude) : undefined,
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    initialData?.longitude != null ? Number(initialData.longitude) : undefined,
  );
  const [caughtAt, setCaughtAt] = useState(
    initialData?.caughtAt ? formatDateForInput(initialData.caughtAt) : "",
  );
  const [released, setReleased] = useState(initialData?.released ?? true);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [visibility, setVisibility] = useState(initialData?.visibility ?? "PRIVATE");
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>(
    initialData?.gear?.map((g) => g.gear.id) ?? [],
  );
  const [photos, setPhotos] = useState<string[]>([]);

  const { data: gearItems } = trpc.gear.list.useQuery({});
  const utils = trpc.useUtils();

  const createCatch = trpc.catch.create.useMutation({
    onSuccess: () => {
      utils.catch.list.invalidate();
      utils.catch.stats.invalidate();
      router.push("/catches");
    },
  });

  const updateCatch = trpc.catch.update.useMutation({
    onSuccess: () => {
      utils.catch.list.invalidate();
      utils.catch.stats.invalidate();
      utils.catch.getById.invalidate({ id: initialData!.id });
      router.push(`/catches/${initialData!.id}`);
    },
  });

  const mutation = isEditing ? updateCatch : createCatch;

  function toggleGear(gearId: string) {
    setSelectedGearIds((prev) =>
      prev.includes(gearId) ? prev.filter((id) => id !== gearId) : [...prev, gearId],
    );
  }

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      species,
      length: length ? parseFloat(length) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      method: (method || undefined) as
        | "FLY"
        | "SPIN"
        | "BAIT"
        | "TROLLING"
        | "ICE"
        | "SURF"
        | "OTHER"
        | undefined,
      locationName: locationName || undefined,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      caughtAt: caughtAt ? new Date(caughtAt) : undefined,
      released,
      notes: notes || undefined,
      visibility: visibility as "PUBLIC" | "PRIVATE" | "FOLLOWERS_ONLY",
      gearIds: selectedGearIds.length > 0 ? selectedGearIds : undefined,
      photoUrls: photos.length > 0 ? photos : undefined,
    };

    if (isEditing) {
      updateCatch.mutate({ id: initialData!.id, data });
    } else {
      createCatch.mutate(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Catch" : "New Catch"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="species">Species *</Label>
            <Input
              id="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="e.g. Rainbow Trout"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="length">Length (inches)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                min="0"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g. 18.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <SelectOption value="">Select method...</SelectOption>
                {METHODS.map((m) => (
                  <SelectOption key={m.value} value={m.value}>
                    {m.label}
                  </SelectOption>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <SelectOption key={v.value} value={v.value}>
                    {v.label}
                  </SelectOption>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationName">Location</Label>
            <Input
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Blue River, CO"
            />
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleLocationChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="caughtAt">Date & Time</Label>
            <Input
              id="caughtAt"
              type="datetime-local"
              value={caughtAt}
              onChange={(e) => setCaughtAt(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="released"
              type="checkbox"
              checked={released}
              onChange={(e) => setReleased(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="released">Catch and release</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details about the catch..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Photos</Label>
            <PhotoUpload
              photos={photos}
              onPhotosChange={setPhotos}
              endpoint="catchPhoto"
              maxPhotos={5}
            />
          </div>

          {gearItems && gearItems.length > 0 && (
            <div className="space-y-2">
              <Label>Gear Used</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {gearItems.map((gear: { id: string; name: string; category: string; brand: string | null }) => (
                  <label
                    key={gear.id}
                    className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-colors ${
                      selectedGearIds.includes(gear.id)
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGearIds.includes(gear.id)}
                      onChange={() => toggleGear(gear.id)}
                      className="h-4 w-4 rounded border-input"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">
                        {gear.name}
                      </p>
                      {gear.brand && (
                        <p className="text-xs text-muted-foreground truncate">
                          {gear.brand}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Log Catch"}
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
