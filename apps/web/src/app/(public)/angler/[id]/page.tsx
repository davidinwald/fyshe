import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { createCaller } from "@/trpc/server";
import { Card, CardContent } from "@fyshe/ui";
import { FollowButton } from "@/components/social/follow-button";

interface AnglerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AnglerPageProps): Promise<Metadata> {
  const { id } = await params;
  const trpc = await createCaller();

  try {
    const profile = await trpc.user.getPublicProfile({ id });
    if (!profile) return { title: "Angler Not Found" };
    return {
      title: `${profile.name ?? "Angler"} | Fyshe`,
      description: `View ${profile.name ?? "this angler"}'s profile and catches on Fyshe.`,
      openGraph: {
        title: `${profile.name ?? "Angler"} | Fyshe`,
        description: `View ${profile.name ?? "this angler"}'s profile and catches on Fyshe.`,
        images: profile.image ? [profile.image] : undefined,
      },
    };
  } catch {
    return { title: "Angler Not Found" };
  }
}

interface PublicProfile {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  _count?: {
    followers: number;
    following: number;
    catches: number;
  };
  catches?: {
    id: string;
    species: string;
    locationName: string | null;
    caughtAt: Date;
    photos: { url: string }[];
  }[];
}

export default async function AnglerPage({ params }: AnglerPageProps) {
  const { id } = await params;
  const trpc = await createCaller();

  let profile: PublicProfile | null = null;
  try {
    profile = await trpc.user.getPublicProfile({ id }) as PublicProfile;
  } catch {
    notFound();
  }
  if (!profile) notFound();

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }

  function formatCatchDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div className="flex items-start gap-6">
        {profile.image ? (
          <img
            src={profile.image}
            alt={profile.name ?? "Angler"}
            className="h-20 w-20 rounded-full"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-2xl font-bold">
            {(profile.name ?? "?").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {profile.name ?? "Anonymous Angler"}
            </h1>
            <FollowButton userId={profile.id} />
          </div>

          {profile.bio && (
            <p className="text-muted-foreground">{profile.bio}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {profile._count && (
              <>
                <span>
                  <strong className="text-foreground">
                    {profile._count.catches}
                  </strong>{" "}
                  catches
                </span>
                <span>
                  <strong className="text-foreground">
                    {profile._count.followers}
                  </strong>{" "}
                  followers
                </span>
                <span>
                  <strong className="text-foreground">
                    {profile._count.following}
                  </strong>{" "}
                  following
                </span>
              </>
            )}
            <span>Joined {formatDate(profile.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Catches</h2>

        {!profile.catches || profile.catches.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No public catches yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.catches.map((c) => (
              <a key={c.id} href={`/catches/${c.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full overflow-hidden">
                  {c.photos.length > 0 && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={c.photos[0]!.url}
                        alt={c.species}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-1">
                    <h3 className="font-semibold">{c.species}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCatchDate(c.caughtAt)}
                      {c.locationName && ` · ${c.locationName}`}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
