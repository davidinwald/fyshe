import { ExploreFeed } from "@/components/feed/explore-feed";

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-muted-foreground">
          Discover recent catches from the community.
        </p>
      </div>
      <ExploreFeed />
    </div>
  );
}
