import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsFormProps {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
}

export function ProfileSettingsForm({
  open,
  onClose,
  currentEmail,
}: ProfileSettingsFormProps) {
  const [email, setEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);

      const trimmedCurrentEmail = currentEmail.trim();
      const trimmedNewEmail = email.trim();

      console.log("Debug - Current Email:", trimmedCurrentEmail);
      console.log("Debug - New Email:", trimmedNewEmail);

      // Check if any changes were made
      const isEmailChanged = trimmedNewEmail !== trimmedCurrentEmail;
      const isPasswordChanged = newPassword && newPassword.length > 0;

      console.log("Debug - Is Email Changed:", isEmailChanged);

      if (!isEmailChanged && !isPasswordChanged) {
        toast({
          title: "No Changes",
          description: "No changes were made to update",
          variant: "default",
        });
        onClose();
        return;
      }

      // Verify current password first
      if (!currentPassword) {
        toast({
          title: "Error",
          description: "Current password is required to make changes",
          variant: "destructive",
        });
        return;
      }

      // Re-authenticate with Supabase using CURRENT email
      console.log("Debug - Authenticating with:", trimmedCurrentEmail);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedCurrentEmail,
        password: currentPassword,
      });

      if (authError || !authData.session) {
        console.error("Debug - Auth Error:", authError);
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      // Validate email if changed
      if (isEmailChanged) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(trimmedNewEmail)) {
          toast({
            title: "Error",
            description: "Please enter a valid email address",
            variant: "destructive",
          });
          return;
        }

        console.log("Debug - Updating email to:", trimmedNewEmail);
        
        // Update email
        const { data: userData, error: emailError } = await supabase.auth.updateUser({
          email: trimmedNewEmail
        });

        if (emailError) {
          console.error("Debug - Email Update Error:", emailError);
          
          // Handle rate limit error specifically
          if (emailError.message?.toLowerCase().includes('rate limit')) {
            toast({
              title: "Too Many Attempts",
              description: "Please wait a few minutes before trying to update your email again",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Email Update Failed",
            description: emailError.message,
            variant: "destructive",
          });
          return;
        }

        console.log("Debug - Email Update Response:", userData);

        if (userData) {
          toast({
            title: "Success",
            description: "Email update confirmation has been sent to your new email address. Please check your inbox and follow the confirmation link.",
          });
          // Close the form after successful email update
          onClose();
          return;
        }
      }

      // Validate password if changed
      if (isPasswordChanged) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "Error",
            description: "New passwords do not match",
            variant: "destructive",
          });
          return;
        }

        // Update password
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (passwordError) {
          console.error("Debug - Password Update Error:", passwordError);
          
          // Handle rate limit error for password changes too
          if (passwordError.message?.toLowerCase().includes('rate limit')) {
            toast({
              title: "Too Many Attempts",
              description: "Please wait a few minutes before trying to update your password again",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Password Update Failed",
            description: passwordError.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Password updated successfully",
        });
      }

      // If we got here, all updates were successful
      onClose();
      // Clear sensitive fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Debug - Unexpected Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal>
      <DialogContent
        className="sm:max-w-[400px] max-h-[90vh] flex flex-col gap-0 p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update your email address and/or password
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="grid gap-4 py-4">
            {/* Email Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Email Settings</h3>
              <div className="grid gap-2">
                <Label htmlFor="email">New Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter new email"
                  defaultValue={currentEmail}
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Password Settings</h3>
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProfile}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
