
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const GalleryPlaceholder = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Client Gallery</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The gallery module is currently under development. It will allow you to organize and share media with your clients.
      </p>
      <Button onClick={() => navigate('/')}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default GalleryPlaceholder;
