import { createCaller } from "@/trpc/server";

export default async function DashboardPage() {
  const trpc = await createCaller();
  const health = await trpc.health.check();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s your fishing overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Catches" value="--" description="Total catches logged" />
        <DashboardCard title="Trips" value="--" description="Fishing trips" />
        <DashboardCard title="Gear" value="--" description="Items in your collection" />
        <DashboardCard title="Flies" value="--" description="Patterns saved" />
      </div>

      <div className="rounded-lg border border-border p-4">
        <p className="text-sm text-muted-foreground">
          API Status: <span className="font-mono text-foreground">{health.status}</span>
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border p-6 space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
