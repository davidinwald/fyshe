"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing-client";
import { cn } from "@fyshe/ui";

interface AvatarUploadProps {
  currentImage: string | null;
  onAvatarChange: (url: string) => void;
}

export function AvatarUpload({
  currentImage,
  onAvatarChange,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("avatarPhoto", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        const url = res[0].ufsUrl;
        setPreview(url);
        onAvatarChange(url);
        setError(null);
      }
    },
    onUploadError: (err) => {
      setError(err.message);
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    setError(null);

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    startUpload([file]);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={cn(
            "h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-muted",
            isUploading && "opacity-50"
          )}
        >
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      <label
        className={cn(
          "cursor-pointer text-sm font-medium text-primary hover:text-primary/80 transition-colors",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        {isUploading ? "Uploading..." : "Change avatar"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          disabled={isUploading}
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
