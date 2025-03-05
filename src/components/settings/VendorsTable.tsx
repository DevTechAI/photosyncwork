
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { useVendors } from "@/hooks/useVendors";
import { Vendor } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export function VendorsTable() {
  const { vendors, loading, addVendor, updateVendor, deleteVendor } = useVendors();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Vendor>({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    gst_number: "",
    address: "",
    service_type: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = () => {
    addVendor(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSubmit = () => {
    updateVendor(formData);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleEdit = (vendor: Vendor) => {
    setFormData(vendor);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      deleteVendor(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      gst_number: "",
      address: "",
      service_type: "",
      notes: "",
    });
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  if (loading && vendors.length === 0) {
    return (
      <Card className="p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Vendors</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Vendors</h2>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead className="hidden md:table-cell">Service Type</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">GST Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No vendors found. Add your first vendor.
                </TableCell>
              </TableRow>
            ) : (
              vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contact_person}</TableCell>
                  <TableCell className="hidden md:table-cell">{vendor.service_type}</TableCell>
                  <TableCell className="hidden md:table-cell">{vendor.phone}</TableCell>
                  <TableCell className="hidden md:table-cell uppercase">{vendor.gst_number}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(vendor)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(vendor.id!)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Vendor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person || ""}
                onChange={handleChange}
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
              <Label htmlFor="gst_number">GST Number</Label>
              <Input
                id="gst_number"
                name="gst_number"
                value={formData.gst_number || ""}
                onChange={handleChange}
                className="uppercase"
              />
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

            <div className="space-y-2">
              <Label htmlFor="service_type">Service Type</Label>
              <Input
                id="service_type"
                name="service_type"
                value={formData.service_type || ""}
                onChange={handleChange}
                placeholder="E.g., Printing, Equipment Rental, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit}>Add Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Vendor Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact_person">Contact Person</Label>
              <Input
                id="edit-contact_person"
                name="contact_person"
                value={formData.contact_person || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gst_number">GST Number</Label>
              <Input
                id="edit-gst_number"
                name="gst_number"
                value={formData.gst_number || ""}
                onChange={handleChange}
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-service_type">Service Type</Label>
              <Input
                id="edit-service_type"
                name="service_type"
                value={formData.service_type || ""}
                onChange={handleChange}
                placeholder="E.g., Printing, Equipment Rental, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
