import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface CourseSuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseSuggestionModal({ open, onOpenChange }: CourseSuggestionModalProps) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!code.trim() || !name.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("course_suggestions").insert({
        code: code.trim(),
        name: name.trim(),
        department: department.trim() || null,
        submitted_by_user_id: user.id,
      });

      if (error) throw error;

      toast.success("Thanks! We'll review and add it shortly.");
      setCode("");
      setName("");
      setDepartment("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest a Course</DialogTitle>
          <DialogDescription>
            Can't find your course? Let us know and we'll add it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="suggestion-code">Course Code *</Label>
            <Input
              id="suggestion-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g., COMP 2415"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suggestion-name">Course Name *</Label>
            <Input
              id="suggestion-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Data Structures"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="suggestion-department">Department (optional)</Label>
            <Input
              id="suggestion-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Computer Science"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
