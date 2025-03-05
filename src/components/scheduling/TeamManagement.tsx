
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TeamMember, TeamMemberRole } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface TeamManagementProps {
  teamMembers: TeamMember[];
  onAddTeamMember: (member: TeamMember) => void;
  onUpdateTeamMember: (member: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
}

export function TeamManagement({
  teamMembers,
  onAddTeamMember,
  onUpdateTeamMember,
  onDeleteTeamMember,
}: TeamManagementProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: "",
    role: "photographer",
    email: "",
    phone: "",
    whatsapp: "",
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const roles: TeamMemberRole[] = ["photographer", "videographer", "editor", "production"];

  const handleAddMember = () => {
    if (!formData.name || !formData.role || !formData.email || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: formData.name || "",
      role: formData.role as TeamMemberRole || "photographer",
      email: formData.email || "",
      phone: formData.phone || "",
      whatsapp: formData.whatsapp || formData.phone || "",
      availability: {},
    };

    onAddTeamMember(newMember);
    setFormData({
      name: "",
      role: "photographer",
      email: "",
      phone: "",
      whatsapp: "",
    });
    setShowAddDialog(false);
    
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added to your team`,
    });
  };

  const handleEditMember = () => {
    if (!currentMember) return;
    
    const updatedMember: TeamMember = {
      ...currentMember,
      name: formData.name || currentMember.name,
      role: formData.role as TeamMemberRole || currentMember.role,
      email: formData.email || currentMember.email,
      phone: formData.phone || currentMember.phone,
      whatsapp: formData.whatsapp || formData.phone || currentMember.whatsapp,
    };

    onUpdateTeamMember(updatedMember);
    setShowEditDialog(false);
    setCurrentMember(null);
    
    toast({
      title: "Team member updated",
      description: `${updatedMember.name}'s information has been updated`,
    });
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name} from your team?`)) {
      onDeleteTeamMember(id);
      
      toast({
        title: "Team member removed",
        description: `${name} has been removed from your team`,
      });
    }
  };

  const startEditMember = (member: TeamMember) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      email: member.email,
      phone: member.phone,
      whatsapp: member.whatsapp || member.phone,
    });
    setShowEditDialog(true);
  };
  
  // Function to sync team members with the database
  const syncTeamMembersWithDB = async () => {
    try {
      setIsSyncing(true);
      
      // Get existing team members from the database
      const { data: existingDbMembers, error: fetchError } = await supabase
        .from('team_members')
        .select('id, name, email');
        
      if (fetchError) throw fetchError;
      
      // For each local team member, check if they exist in the DB
      for (const member of teamMembers) {
        // Skip if the ID is already a UUID (already synced)
        if (member.id && !member.id.startsWith('tm-')) continue;
        
        // Check if this member already exists in DB by email
        const existingMember = existingDbMembers?.find(m => m.email === member.email);
        
        if (existingMember) {
          // Update local ID to match DB ID
          onUpdateTeamMember({
            ...member,
            id: existingMember.id
          });
        } else {
          // Insert into DB
          const { data: newMember, error: insertError } = await supabase
            .from('team_members')
            .insert({
              name: member.name,
              email: member.email,
              phone: member.phone,
              role: member.role,
              whatsapp: member.whatsapp,
              is_freelancer: member.isFreelancer || false,
              availability: member.availability || {}
            })
            .select('id')
            .single();
            
          if (insertError) throw insertError;
          
          // Update local ID with the new DB ID
          if (newMember) {
            onUpdateTeamMember({
              ...member,
              id: newMember.id
            });
          }
        }
      }
      
      toast({
        title: "Sync completed",
        description: "Team members have been synchronized with the database",
      });
    } catch (error) {
      console.error('Error syncing team members:', error);
      toast({
        title: "Sync failed",
        description: "There was an error synchronizing team members",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Team Members</h3>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isSyncing} onClick={syncTeamMembersWithDB}>
            {isSyncing ? "Syncing..." : "Sync with Database"}
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditMember(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteMember(member.id, member.name)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p>Email: {member.email}</p>
              <p>Phone: {member.phone}</p>
              {member.whatsapp && member.whatsapp !== member.phone && (
                <p>WhatsApp: {member.whatsapp}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team member's name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role as string}
                onValueChange={(value) => setFormData({ ...formData, role: value as TeamMemberRole })}
              >
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
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="Same as phone if left empty"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role as string}
                onValueChange={(value) => setFormData({ ...formData, role: value as TeamMemberRole })}
              >
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
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-whatsapp">WhatsApp Number</Label>
              <Input
                id="edit-whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="Same as phone if left empty"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
