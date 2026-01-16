import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Course = {
  id: string;
  code: string;
  name: string;
  department: string | null;
};

function norm(s: string) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, " ");
}

interface Props {
  value: string; // selectedCourseId
  onSelect: (course: Course) => void;
  disabled?: boolean;
  error?: string;
  onAddNew?: (prefill?: { code?: string; name?: string }) => void;
}

export function CourseSelector({
  value,
  onSelect,
  disabled,
  error,
  onAddNew,
}: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, code, name, department")
        .order("department", { ascending: true })
        .order("code", { ascending: true });

      if (!error) setCourses((data || []) as Course[]);
    })();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === value),
    [courses, value]
  );

  const filtered = useMemo(() => {
    const q = norm(searchValue);
    if (!q) return courses;
    return courses.filter((c) => {
      const hay = `${c.code} ${c.name} ${c.department || ""}`;
      return norm(hay).includes(q);
    });
  }, [courses, searchValue]);

  const showAddNew = useMemo(() => {
    const q = searchValue.trim();
    if (!q) return false;

    const exactCode = courses.some((c) => norm(c.code) === norm(q));
    if (exactCode) return false;

    return filtered.length === 0 || filtered.length < 5;
  }, [searchValue, courses, filtered]);

  return (
    <div className="space-y-2">
      <Label>Course *</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedCourse
              ? `${selectedCourse.code} — ${selectedCourse.name}`
              : "Search for a course..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[520px] p-0 bg-popover z-50">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type course code or name..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {filtered.length === 0 && !showAddNew && (
                <CommandEmpty>No course found.</CommandEmpty>
              )}

              <CommandGroup>
                {filtered.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={c.id}
                    onSelect={() => {
                      onSelect(c);
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === c.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="font-medium">
                      {c.code} — {c.name}
                      {c.department ? `  (${c.department})` : ""}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {showAddNew && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        onAddNew?.({ code: searchValue.trim() });
                        setOpen(false);
                      }}
                      className="text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Add “{searchValue.trim()}” as new course</span>
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
  );
}
