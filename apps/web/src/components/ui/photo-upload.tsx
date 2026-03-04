"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing-client";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
  endpoint: "catchPhoto" | "tripPhoto";
  maxPhotos?: number;
}

export function PhotoUpload({
  photos,
  onPhotosChange,
  endpoint,
  maxPhotos = 5,
}: PhotoUploadProps) {
  const [error, setError] = useState<string | null>(null);

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  }

  return (
    <div className="space-y-3">
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((url, index) => (
            <div key={url} className="group relative aspect-square">
              <Image
                src={url}
                alt={`Photo ${index + 1}`}
                fill
                className="rounded-md border border-border object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove photo ${index + 1}`}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < maxPhotos && (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            if (res) {
              const newUrls = res.map((file) => file.ufsUrl);
              onPhotosChange([...photos, ...newUrls].slice(0, maxPhotos));
            }
            setError(null);
          }}
          onUploadError={(err) => {
            setError(err.message);
          }}
          config={{ mode: "auto" }}
          appearance={{
            container:
              "border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover:border-primary/50 transition-colors",
            label: "text-sm text-muted-foreground",
            allowedContent: "text-xs text-muted-foreground",
            button:
              "bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md hover:bg-primary/90",
          }}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
