
import { UseFormRegister, FormState, UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EventFormValues } from "@/hooks/scheduling/useCreateEventModal";

interface TeamRequirementsFormProps {
  register: UseFormRegister<EventFormValues>;
  errors: FormState<EventFormValues>['errors'];
  setValue: UseFormSetValue<EventFormValues>;
}

export function TeamRequirementsForm({ 
  register, 
  errors 
}: TeamRequirementsFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="photographersCount">Number of Photographers</Label>
          <Input
            id="photographersCount"
            type="number"
            min="0"
            {...register("photographersCount", { valueAsNumber: true })}
          />
          {errors.photographersCount && (
            <p className="text-sm text-destructive">{errors.photographersCount.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="videographersCount">Number of Videographers</Label>
          <Input
            id="videographersCount"
            type="number"
            min="0"
            {...register("videographersCount", { valueAsNumber: true })}
          />
          {errors.videographersCount && (
            <p className="text-sm text-destructive">{errors.videographersCount.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientRequirements">Client Requirements</Label>
        <Input
          id="clientRequirements"
          {...register("clientRequirements")}
          placeholder="Special requests or requirements"
        />
      </div>
    </>
  );
}
