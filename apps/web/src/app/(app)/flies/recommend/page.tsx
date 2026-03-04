import { FlyRecommendations } from "@/components/fly/fly-recommendations";

export default function FlyRecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fly Recommendations</h1>
        <p className="text-muted-foreground">
          Get personalized fly pattern recommendations based on conditions.
        </p>
      </div>
      <FlyRecommendations />
    </div>
  );
}
