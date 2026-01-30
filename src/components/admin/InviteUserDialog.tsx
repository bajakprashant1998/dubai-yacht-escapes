import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useInvitations } from "@/hooks/useInvitations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type AppRole = Database["public"]["Enums"]["app_role"];

const AVAILABLE_ROLES: { value: AppRole; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full system access" },
  { value: "manager", label: "Manager", description: "Team and resource management" },
  { value: "editor", label: "Editor", description: "Content creation and editing" },
  { value: "moderator", label: "Moderator", description: "Content moderation" },
  { value: "user", label: "User", description: "Basic access" },
];

interface InviteUserDialogProps {
  trigger?: React.ReactNode;
}

const InviteUserDialog = ({ trigger }: InviteUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>(["user"]);
  const { sendInvitation } = useInvitations();

  const handleToggleRole = (role: AppRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || selectedRoles.length === 0) return;

    await sendInvitation.mutateAsync({ email, roles: selectedRoles });
    
    // Reset form
    setEmail("");
    setSelectedRoles(["user"]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an email invitation to a new team member with pre-assigned roles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Assign Roles</Label>
            <div className="space-y-2">
              {AVAILABLE_ROLES.map((role) => (
                <label
                  key={role.value}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={() => handleToggleRole(role.value)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{role.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                sendInvitation.isPending ||
                !email ||
                selectedRoles.length === 0
              }
            >
              {sendInvitation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
