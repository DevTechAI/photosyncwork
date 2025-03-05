
import { useToast } from "@/components/ui/use-toast";
import { getApprovedEstimates } from "@/components/scheduling/utils/approvedEstimatesLoader";

export function useEstimatesLoader(
  setApprovedEstimates: (estimates: any[]) => void,
  initialEstimateId: string | undefined,
  setSelectedEstimateId: (id: string) => void
) {
  const { toast } = useToast();
  
  const loadEstimates = async () => {
    try {
      const estimates = await getApprovedEstimates();
      setApprovedEstimates(estimates);
      
      if (initialEstimateId) {
        setSelectedEstimateId(initialEstimateId);
      }
    } catch (error) {
      console.error("Error loading estimates:", error);
      toast({
        title: "Error",
        description: "Failed to load approved estimates.",
        variant: "destructive",
      });
    }
  };
  
  return { loadEstimates };
}
