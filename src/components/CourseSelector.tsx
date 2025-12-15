import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
}

interface CourseSelectorProps {
  selectedCourseCode: string;
  onSelect: (courseCode: string, course?: Course) => void;
  disabled?: boolean;
  error?: string;
}

function normalizeSearch(text: string): string {
  return text.toLowerCase().trim();
}

export function CourseSelector({
  selectedCourseCode,
  onSelect,
  disabled = false,
  error,
}: CourseSelectorProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, code, name, department")
        .order("code");

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const selectedCourse = useMemo(
    () => courses.find((c) => c.code === selectedCourseCode),
    [courses, selectedCourseCode]
  );

  // Filter courses based on search (matches code or name)
  const filteredCourses = useMemo(() => {
    if (!searchValue.trim()) return courses;
    const normalized = normalizeSearch(searchValue);
    return courses.filter(
      (c) =>
        normalizeSearch(c.code).includes(normalized) ||
        normalizeSearch(c.name).includes(normalized)
    );
  }, [courses, searchValue]);

  return (
    <div className="space-y-2">
      <Label>Select Course *</Label>
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
              ? `${selectedCourse.code} – ${selectedCourse.name}`
              : "Search for a course..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 bg-popover z-50">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type course code or name..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {filteredCourses.length === 0 && (
                <CommandEmpty>No course found.</CommandEmpty>
              )}
              <CommandGroup>
                {filteredCourses.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={course.id}
                    onSelect={() => {
                      onSelect(course.code, course);
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCourseCode === course.code
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="font-medium">
                      {course.code} – {course.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
