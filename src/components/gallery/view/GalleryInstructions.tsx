
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GalleryInstructions() {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <p className="text-sm mb-2">
          <Badge variant="outline" className="mr-2">Instructions</Badge>
          Welcome to your photo gallery! Browse the images from your event, mark your favorites,
          and select the ones you'd like us to process for final delivery.
        </p>
        <p className="text-xs text-muted-foreground">
          You can switch between viewing all photos, your selected photos, or your favorites using the tabs below.
        </p>
      </CardContent>
    </Card>
  );
}
