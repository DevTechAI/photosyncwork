
import { UseFormRegister, FormState, UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EventFormValues } from "@/hooks/scheduling/useCreateEventModal";

interface ClientDetailsFormProps {
  register: UseFormRegister<EventFormValues>;
  errors: FormState<EventFormValues>['errors'];
  setValue: UseFormSetValue<EventFormValues>;
}

export function ClientDetailsForm({ 
  register, 
  errors 
}: ClientDetailsFormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          {...register("clientName")}
          placeholder="Enter client name"
        />
        {errors.clientName && (
          <p className="text-sm text-destructive">{errors.clientName.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientPhone">Phone</Label>
          <Input
            id="clientPhone"
            {...register("clientPhone")}
            placeholder="Client phone number"
          />
          {errors.clientPhone && (
            <p className="text-sm text-destructive">{errors.clientPhone.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            {...register("clientEmail")}
            placeholder="Client email address"
          />
          {errors.clientEmail && (
            <p className="text-sm text-destructive">{errors.clientEmail.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="guestCount">Estimated Guest Count</Label>
        <Input
          id="guestCount"
          type="number"
          {...register("guestCount", { valueAsNumber: true })}
          placeholder="Approximate number of guests"
        />
        {errors.guestCount && (
          <p className="text-sm text-destructive">{errors.guestCount.message}</p>
        )}
      </div>
    </>
  );
}
