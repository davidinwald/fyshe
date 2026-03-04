import { BaitRecommendations } from "@/components/fly/bait-recommendations";

export default function BaitRecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bait Recommendations</h1>
          <p className="text-muted-foreground">
            Get personalized bait recommendations based on conditions.
          </p>
        </div>
        <a
          href="/flies/bait"
          className="text-sm text-primary hover:underline"
        >
          Back to Bait Library
        </a>
      </div>
      <BaitRecommendations />
    </div>
  );
}
