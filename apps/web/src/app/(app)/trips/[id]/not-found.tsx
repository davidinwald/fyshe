import Link from "next/link";
import { Button, Card, CardContent } from "@fyshe/ui";

export default function TripNotFound() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="py-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Trip not found</h2>
        <p className="text-sm text-muted-foreground">
          This trip doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Button asChild variant="outline">
          <Link href="/trips">Back to Trips</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
