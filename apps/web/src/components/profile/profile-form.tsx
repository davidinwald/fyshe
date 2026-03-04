"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from "@fyshe/ui";
import { trpc } from "@/trpc/client";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    bio: string | null;
    location: string | null;
    image: string | null;
    isPublic: boolean;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [image, setImage] = useState(user.image);
  const [isPublic, setIsPublic] = useState(user.isPublic);

  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
    },
  });

  function handleAvatarChange(url: string) {
    setImage(url);
    updateProfile.mutate({ image: url });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate({ name, bio, location, image, isPublic });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Avatar</Label>
            <AvatarUpload
              currentImage={image}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email ?? ""} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your fishing..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where do you fish?"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <Label htmlFor="isPublic">Make my profile public</Label>
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>

          {updateProfile.isSuccess && (
            <p className="text-sm text-green-600">Profile updated.</p>
          )}
          {updateProfile.isError && (
            <p className="text-sm text-destructive">
              {updateProfile.error.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
