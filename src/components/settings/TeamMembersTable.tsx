
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TeamMember } from "./types";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const roles = ["photographer", "videographer", "editor", "production"];

export function TeamMembersTable() {
  const { teamMembers, loading, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TeamMember>({
    name: "",
    role: "photographer",
    email: "",
    phone: "",
    whatsapp: "",
    is_freelancer: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_freelancer: checked }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleAddSubmit = () => {
    addTeamMember(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditSubmit = () => {
    updateTeamMember(formData);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleEdit = (member: TeamMember) => {
    setFormData(member);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      deleteTeamMember(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "photographer",
      email: "",
      phone: "",
      whatsapp: "",
      is_freelancer: false,
    });
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  if (loading && teamMembers.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Team Members</h2>
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
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Team Members</h2>
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No team members found. Add your first team member.
                </TableCell>
              </TableRow>
            ) : (
              teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                  <TableCell>
                    {member.is_freelancer ? (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Freelancer
                      </span>
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        In-house
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(member.id!)}
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

      {/* Add Team Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp || ""}
                onChange={handleChange}
                placeholder="Same as phone if left empty"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="is_freelancer" 
                checked={formData.is_freelancer || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_freelancer">Freelancer</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
              <Input
                id="edit-whatsapp"
                name="whatsapp"
                value={formData.whatsapp || ""}
                onChange={handleChange}
                placeholder="Same as phone if left empty"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="edit-is_freelancer" 
                checked={formData.is_freelancer || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-is_freelancer">Freelancer</Label>
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
