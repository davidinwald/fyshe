import { Card, CardContent } from "@fyshe/ui";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center space-y-4">
          <div className="text-6xl">🎣</div>
          <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
          <p className="text-muted-foreground">
            Looks like you&apos;ve lost your connection. Check your internet and try again.
          </p>
          <p className="text-sm text-muted-foreground">
            Previously visited pages may still be available from cache.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
