"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
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

interface TripFormData {
  id: string;
  title: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  locationName?: string | null;
  latitude: unknown;
  longitude: unknown;
  waterBody?: string | null;
  weather?: string | null;
  waterConditions?: string | null;
  description?: string | null;
  notes?: string | null;
  visibility?: string | null;
  [key: string]: unknown;
}

interface TripFormProps {
  initialData?: TripFormData;
}

function toDateInputValue(date: string | Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0] ?? "";
}

export function TripForm({ initialData }: TripFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [startDate, setStartDate] = useState(
    toDateInputValue(initialData?.startDate),
  );
  const [endDate, setEndDate] = useState(
    toDateInputValue(initialData?.endDate),
  );
  const [locationName, setLocationName] = useState(
    initialData?.locationName ?? "",
  );
  const [latitude, setLatitude] = useState<number | undefined>(
    initialData?.latitude != null ? Number(initialData.latitude) : undefined,
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    initialData?.longitude != null ? Number(initialData.longitude) : undefined,
  );
  const [waterBody, setWaterBody] = useState(initialData?.waterBody ?? "");
  const [weather, setWeather] = useState(initialData?.weather ?? "");
  const [waterConditions, setWaterConditions] = useState(
    initialData?.waterConditions ?? "",
  );
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [visibility, setVisibility] = useState(
    initialData?.visibility ?? "PRIVATE",
  );

  const createMutation = trpc.trip.create.useMutation({
    onSuccess: (data) => {
      router.push(`/trips/${data.id}`);
    },
  });

  const updateMutation = trpc.trip.update.useMutation({
    onSuccess: (data) => {
      router.push(`/trips/${data.id}`);
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title,
      startDate,
      endDate: endDate || undefined,
      locationName: locationName || undefined,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      waterBody: waterBody || undefined,
      weather: weather || undefined,
      waterConditions: waterConditions || undefined,
      description: description || undefined,
      notes: notes || undefined,
      visibility: visibility || undefined,
    };

    if (isEditing && initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: payload as unknown as Parameters<typeof updateMutation.mutate>[0]["data"] });
    } else {
      createMutation.mutate(payload as unknown as Parameters<typeof createMutation.mutate>[0]);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Trip" : "New Trip"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error.message}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Weekend Bass Fishing"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              required
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
                }
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locationName">Location</Label>
              <Input
                id="locationName"
                placeholder="Lake Tahoe, CA"
                value={locationName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setLocationName(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterBody">Water Body</Label>
              <Input
                id="waterBody"
                placeholder="Lake, River, Stream..."
                value={waterBody}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWaterBody(e.target.value)
                }
              />
            </div>
          </div>

          {/* Location Picker Map */}
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleLocationChange}
          />

          {/* Conditions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weather">Weather</Label>
              <Input
                id="weather"
                placeholder="Sunny, 72F"
                value={weather}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWeather(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterConditions">Water Conditions</Label>
              <Input
                id="waterConditions"
                placeholder="Clear, calm"
                value={waterConditions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWaterConditions(e.target.value)
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the trip..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              rows={3}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Personal notes, reminders..."
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              rows={3}
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              id="visibility"
              value={visibility}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setVisibility(e.target.value)
              }
            >
              <SelectOption value="PRIVATE">Private</SelectOption>
              <SelectOption value="FOLLOWERS_ONLY">Followers Only</SelectOption>
              <SelectOption value="PUBLIC">Public</SelectOption>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Trip"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
