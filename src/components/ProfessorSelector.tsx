import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";

interface Professor {
  id: string;
  full_name: string;
  department: string;
  name_normalized?: string;
}

interface ProfessorSelectorProps {
  selectedProfessorId: string;
  onSelect: (professorId: string, professor?: Professor) => void;
  disabled?: boolean;
  error?: string;
}

const NAU_DEPARTMENTS = [
  "Computer Science",
  "Business Administration",
  "Accounting",
  "Finance",
  "Education",
  "Mathematics",
  "English",
  "Humanities",
  "General Education",
  "Communications",
];

// Normalize name for comparison (lowercase, trim, remove punctuation/extra spaces)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ");
}

export function ProfessorSelector({
  selectedProfessorId,
  onSelect,
  disabled = false,
  error,
}: ProfessorSelectorProps) {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProfessorName, setNewProfessorName] = useState("");
  const [newProfessorDepartment, setNewProfessorDepartment] = useState("");
  const [adding, setAdding] = useState(false);
  const [nearDuplicates, setNearDuplicates] = useState<Professor[]>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const { data, error } = await supabase
        .from("professors")
        .select("id, full_name, department, name_normalized")
        .order("full_name");

      if (error) throw error;
      setProfessors(data || []);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  const selectedProfessor = useMemo(
    () => professors.find((p) => p.id === selectedProfessorId),
    [professors, selectedProfessorId]
  );

  // Filter professors based on search
  const filteredProfessors = useMemo(() => {
    if (!searchValue.trim()) return professors;
    const normalized = normalizeName(searchValue);
    return professors.filter(
      (p) =>
        normalizeName(p.full_name).includes(normalized) ||
        normalizeName(p.department).includes(normalized)
    );
  }, [professors, searchValue]);

  // Show "Add new" only when search has text and no exact match
  const showAddNew = useMemo(() => {
    if (!searchValue.trim()) return false;
    const normalized = normalizeName(searchValue);
    // Don't show if there's a close match (starts with or contains the search term closely)
    const hasCloseMatch = professors.some((p) => {
      const pNorm = normalizeName(p.full_name);
      return pNorm === normalized || pNorm.startsWith(normalized);
    });
    return !hasCloseMatch && filteredProfessors.length < 5;
  }, [searchValue, professors, filteredProfessors]);

  const handleOpenAddDialog = () => {
    setNewProfessorName(searchValue.trim());
    setNewProfessorDepartment("");
    setNearDuplicates([]);
    setShowDuplicateWarning(false);
    setAddDialogOpen(true);
    setOpen(false);
  };

  // Check for near-duplicates when name changes
  useEffect(() => {
    if (!newProfessorName.trim()) {
      setNearDuplicates([]);
      return;
    }
    const normalized = normalizeName(newProfessorName);
    const matches = professors.filter((p) => {
      const pNorm = normalizeName(p.full_name);
      // Exact match or very similar (Levenshtein distance would be better, but simple substring for now)
      return (
        pNorm === normalized ||
        pNorm.includes(normalized) ||
        normalized.includes(pNorm)
      );
    });
    setNearDuplicates(matches);
  }, [newProfessorName, professors]);

  const handleAddProfessor = async () => {
    if (!user) {
      showLoginPrompt();
      return;
    }

    const name = newProfessorName.trim();
    const dept = newProfessorDepartment.trim();

    if (!name || !dept) {
      toast.error("Please fill in both name and department");
      return;
    }

    // Check for exact duplicate
    const normalized = normalizeName(name);
    const exactDuplicate = professors.find(
      (p) => normalizeName(p.full_name) === normalized
    );
    if (exactDuplicate) {
      toast.error(
        `"${exactDuplicate.full_name}" already exists. Please select from the list.`
      );
      return;
    }

    // If near-duplicates exist and user hasn't confirmed, show warning
    if (nearDuplicates.length > 0 && !showDuplicateWarning) {
      setShowDuplicateWarning(true);
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from("professors")
        .insert({
          full_name: name,
          department: dept,
          created_by_user_id: user.id,
          source: "user",
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast.error("This professor already exists.");
          return;
        }
        throw error;
      }

      toast.success(`Professor "${name}" added successfully!`);
      await fetchProfessors();
      onSelect(data.id, data);
      setAddDialogOpen(false);
      setNewProfessorName("");
      setNewProfessorDepartment("");
      setShowDuplicateWarning(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add professor");
    } finally {
      setAdding(false);
    }
  };

  const handleSelectExisting = (prof: Professor) => {
    onSelect(prof.id, prof);
    setAddDialogOpen(false);
    setNewProfessorName("");
    setNewProfessorDepartment("");
    setShowDuplicateWarning(false);
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Select Professor *</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled}
            >
              {selectedProfessor
                ? selectedProfessor.full_name
                : "Search for a professor..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0 bg-popover z-50">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Type professor name..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                {filteredProfessors.length === 0 && !showAddNew && (
                  <CommandEmpty>No professor found.</CommandEmpty>
                )}
                <CommandGroup>
                  {filteredProfessors.map((prof) => (
                    <CommandItem
                      key={prof.id}
                      value={prof.id}
                      onSelect={() => {
                        onSelect(prof.id, prof);
                        setOpen(false);
                        setSearchValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProfessorId === prof.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="font-medium">
                        {prof.full_name} – {prof.department}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {showAddNew && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={handleOpenAddDialog}
                        className="text-primary"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Add "{searchValue.trim()}" as new professor</span>
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* Add Professor Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Professor</DialogTitle>
            <DialogDescription>
              Enter the professor's details. They'll be available immediately
              for reviews.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prof-name">Full Name *</Label>
              <Input
                id="prof-name"
                value={newProfessorName}
                onChange={(e) => {
                  setNewProfessorName(e.target.value);
                  setShowDuplicateWarning(false);
                }}
                placeholder="e.g., Dr. John Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prof-dept">Department *</Label>
              <Select
                value={newProfessorDepartment}
                onValueChange={setNewProfessorDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {NAU_DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Near-duplicate warning */}
            {nearDuplicates.length > 0 && (
              <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Similar professor(s) found:
                    </p>
                    <div className="space-y-1">
                      {nearDuplicates.map((p) => (
                        <Button
                          key={p.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => handleSelectExisting(p)}
                        >
                          <span>
                            {p.full_name} – {p.department}
                          </span>
                        </Button>
                      ))}
                    </div>
                    {showDuplicateWarning && (
                      <p className="text-xs text-muted-foreground">
                        Click "Add Anyway" to create a new entry, or select an
                        existing professor above.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={adding}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddProfessor}
              disabled={adding || !newProfessorName.trim() || !newProfessorDepartment}
            >
              {adding
                ? "Adding..."
                : nearDuplicates.length > 0 && showDuplicateWarning
                ? "Add Anyway"
                : "Add Professor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
