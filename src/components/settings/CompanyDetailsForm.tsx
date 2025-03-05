
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCompanyDetails } from "@/hooks/useCompanyDetails";
import { Company } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyDetailsForm() {
  const { company, loading, saveCompanyDetails } = useCompanyDetails();
  const [formData, setFormData] = useState<Company>({
    name: "",
    gst_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanyDetails(formData);
  };

  if (loading && !company) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">Company Details</h2>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Company Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Company Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst_number">GST Number</Label>
          <Input
            id="gst_number"
            name="gst_number"
            value={formData.gst_number || ""}
            onChange={handleChange}
            className="uppercase"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              value={formData.pincode || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country || "India"}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? "Saving..." : "Save Company Details"}
        </Button>
      </form>
    </Card>
  );
}
