"use client";

import dynamic from "next/dynamic";
import { Button } from "@fyshe/ui";
import { useState } from "react";

const LocationPickerMap = dynamic(
  () =>
    import("./location-picker-map").then((m) => m.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full rounded-md border bg-muted animate-pulse" />
    ),
  },
);

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const [locating, setLocating] = useState(false);

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true },
    );
  }

  return (
    <div className="space-y-2">
      <LocationPickerMap
        latitude={latitude}
        longitude={longitude}
        onLocationChange={onLocationChange}
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGeolocate}
          disabled={locating}
        >
          {locating ? "Locating..." : "Use my location"}
        </Button>
        {latitude != null && longitude != null && (
          <span className="text-xs text-muted-foreground">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        )}
      </div>
    </div>
  );
}
