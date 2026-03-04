import Link from "next/link";
import { Button, Card, CardContent } from "@fyshe/ui";

export default function FlyPatternNotFound() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="py-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Fly pattern not found</h2>
        <p className="text-sm text-muted-foreground">
          This pattern doesn&apos;t exist or is not publicly available.
        </p>
        <Button asChild variant="outline">
          <Link href="/flies">Back to Fly Library</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
