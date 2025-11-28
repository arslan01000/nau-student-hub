import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Reset Your Password</h1>
        <Input
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button onClick={handleUpdatePassword} disabled={loading}>
          {loading ? "Updating..." : "Save New Password"}
        </Button>
      </div>
    </div>
  );
}
