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

type CourseRow = {
  id: string;
  code: string;
  name: string;
  department: string | null;
};

interface CourseSuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseAdded?: (course: CourseRow) => void;
}

// normalize: trim, uppercase, collapse spaces, add space between prefix+digits if missing (COMP2415 -> COMP 2415)
function normalizeCourseCode(input: string): string {
  let s = input.trim().toUpperCase().replace(/\s+/g, " ");
  s = s.replace(/^([A-Z]{2,6})(\d)/, "$1 $2");
  return s;
}

export function CourseSuggestionModal({
  open,
  onOpenChange,
  onCourseAdded,
}: CourseSuggestionModalProps) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setCode("");
    setName("");
    setDepartment("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const normCode = normalizeCourseCode(code);
    const trimmedName = name.trim();
    const trimmedDept = department.trim();

    if (!normCode || !trimmedName) {
      toast.error("Please fill in Course Code and Course Name");
      return;
    }

    setLoading(true);
    try {
      // 1) If course already exists (system or user), just return it (no update)
      const { data: existing, error: existingErr } = await supabase
        .from("courses")
        .select("id, code, name, department")
        .eq("code", normCode)
        .maybeSingle();

      if (existingErr) throw existingErr;

      if (existing) {
        toast.success("Course already exists — selected it for you.");
        onCourseAdded?.(existing as CourseRow);
        reset();
        onOpenChange(false);
        return;
      }

      // 2) Insert immediately into courses as user-added
      const { data: created, error: insertErr } = await supabase
        .from("courses")
        .insert({
          code: normCode,
          name: trimmedName,
          department: trimmedDept || null,
          source: "user",
          created_by_user_id: user.id,
        })
        .select("id, code, name, department")
        .single();

      if (insertErr) {
        // if race condition: someone inserted same code, fetch it
        if (insertErr.code === "23505") {
          const { data: again } = await supabase
            .from("courses")
            .select("id, code, name, department")
            .eq("code", normCode)
            .maybeSingle();

          if (again) {
            toast.success("Course added (already existed) — selected it for you.");
            onCourseAdded?.(again as CourseRow);
            reset();
            onOpenChange(false);
            return;
          }
        }
        throw insertErr;
      }

      toast.success("Course added! You can review it now.");
      onCourseAdded?.(created as CourseRow);

      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Course</DialogTitle>
          <DialogDescription>
            Can't find your course? Add it now — it will appear immediately.
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
              placeholder="e.g., Systems Programming"
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
