import { Button } from "@fyshe/ui";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Track your fishing.
          <br />
          <span className="text-primary">Catch more.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          Log your catches, manage your gear, discover fly patterns, and plan your next outing.
          Built for anglers who want to improve their game.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/login">Get Started</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/explore">Explore</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
