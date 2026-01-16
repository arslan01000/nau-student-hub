import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReviewCard } from "@/components/ReviewCard";
import { Card } from "@/components/ui/card";
import { CourseSelector } from "@/components/CourseSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfessorSelector } from "@/components/ProfessorSelector";
import { CourseSuggestionModal } from "@/components/CourseSuggestionModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const reviewSchema = z.object({
  professor_id: z.string().min(1, "Please select a professor"),
  course_id: z.string().min(1, "Please select a course"),
  overall_rating: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  difficulty_rating: z
    .number()
    .int()
    .min(1, "Please select a difficulty rating")
    .max(5, "Difficulty must be between 1 and 5"),
  text: z
    .string()
    .trim()
    .min(1, "Review text is required")
    .max(1000, "Review must be less than 1000 characters"),
});

interface Professor {
  id: string;
  full_name: string;
  department: string;
}

export default function Reviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const professorIdFromUrl = searchParams.get("professorId");

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [selectedProfessorId, setSelectedProfessorId] = useState("");

  // keep for search/display
  const [courseCode, setCourseCode] = useState("");
  // actual FK
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  const [overallRating, setOverallRating] = useState("");
  const [difficultyRating, setDifficultyRating] = useState("");
  const [gradeReceived, setGradeReceived] = useState("");
  const [wouldTakeAgain, setWouldTakeAgain] = useState<string>("");
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCourseSuggestion, setShowCourseSuggestion] = useState(false);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("id, code, name, department")
      .order("department", { ascending: true })
      .order("code", { ascending: true });

    if (error) {
      console.error("Error fetching courses:", error);
      return;
    }
    setCourses(data || []);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(
          `
          *,
          professors (
            id,
            full_name
          )
        `
        )
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // 👉 ВАЖНО: только id и display_name, БЕЗ email
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name");
      const dbg = await supabase
  .from("profiles")
  .select("id, username, display_name")
  .eq("id", "180868e1-de2b-4257-be36-1143d08fa2a7")
  .single();

console.log("DBG profile data:", dbg.data);
console.log("DBG profile error:", dbg.error);



      if (profilesError) throw profilesError;

      const profilesMap = new Map<string, string | null>();
      profilesData?.forEach((p: any) => {
        profilesMap.set(p.id, p.display_name);
      });

      const mappedData =
        reviewsData?.map((review: any) => ({
          ...review,
          display_name: profilesMap.get(review.user_id) || null,
          email: null, // пока просто null
          professor_name:
            review.professors?.full_name ||
            review.professor_name ||
            "Unknown Professor",
          professor_id: review.professors?.id || null,
        })) ?? [];

      setReviews(mappedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (professorIdFromUrl) {
      setSelectedProfessorId(professorIdFromUrl);
    }
  }, [professorIdFromUrl]);

  const handleProfessorSelect = (professorId: string, professor?: Professor) => {
    setSelectedProfessorId(professorId);
    if (professor) {
      setSelectedProfessor(professor);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    const result = reviewSchema.safeParse({
      professor_id: selectedProfessorId,
      course_id: selectedCourseId,
      overall_rating: parseInt(overallRating),
      difficulty_rating: parseInt(difficultyRating),
      text: reviewText,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        professor_id: selectedProfessorId,
        course_id: selectedCourseId,
        course_code: courseCode.trim(), // keep for search/display
        overall_rating: parseInt(overallRating),
        difficulty_rating: parseInt(difficultyRating),
        grade_received: gradeReceived || null,
        would_take_again: wouldTakeAgain ? wouldTakeAgain === "yes" : null,
        text: reviewText.trim(),
        user_id: user.id,
        is_anonymous: isAnonymous,
        rating: parseInt(overallRating),
      });

      if (error) {
        if (
          error.code === "23505" &&
          error.message.includes("reviews_one_per_user_per_course")
        ) {
          toast.error(
            "You've already reviewed this course. You can only submit one review per course."
          );
          return;
        }
        throw error;
      }

      toast.success("Review submitted successfully!");
      setSelectedProfessorId("");
      setSelectedProfessor(null);
      setSelectedCourseId("");
      setCourseCode("");
      setOverallRating("");
      setDifficultyRating("");
      setGradeReceived("");
      setWouldTakeAgain("");
      setReviewText("");
      setIsAnonymous(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const allReviews = reviews;
  const searchTerm = searchQuery.trim();

  const filteredReviews = searchTerm
    ? allReviews.filter(
        (review) =>
          review.professor_name
            ?.toLowerCase?.()
            .includes(searchTerm.toLowerCase()) ||
          review.course_code?.toLowerCase?.().includes(searchTerm.toLowerCase())
      )
    : allReviews;

  return (
    <div className="min-h-screen py-8 px-4 grid-pattern">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">
          Professor &amp; Course Reviews
        </h1>

        {/* Browse Professors Card */}
        <Card
          className="mb-8 p-6 border-border bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 transition-all"
          onClick={() => navigate("/professors")}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Browse Professors</h2>
              <p className="text-sm text-muted-foreground">
                View all professors with ratings and reviews from NAU students
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-sm font-medium">View All</span>
              <Search className="h-4 w-4" />
            </div>
          </div>
        </Card>

        {/* Add Review Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <ProfessorSelector
                selectedProfessorId={selectedProfessorId}
                onSelect={handleProfessorSelect}
                disabled={!user}
                error={errors.professor_id}
              />
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={selectedProfessor?.department || ""}
                  placeholder="Select a professor first"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Course dropdown */}
            <CourseSelector
  value={selectedCourseId}
  disabled={!user}
  error={errors.course_id}
  onSelect={(course) => {
    setSelectedCourseId(course.id);
    setCourseCode(course.code);
  }}
  onAddNew={() => setShowCourseSuggestion(true)}
/>


            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overall-rating">Overall Rating *</Label>
                <Select
                  value={overallRating}
                  onValueChange={setOverallRating}
                  required
                  disabled={!user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select overall rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ - Excellent</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ - Good</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ - Average</SelectItem>
                    <SelectItem value="2">⭐⭐ - Below Average</SelectItem>
                    <SelectItem value="1">⭐ - Poor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.overall_rating && (
                  <p className="text-sm text-destructive">
                    {errors.overall_rating}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty-rating">Difficulty Rating *</Label>
                <Select
                  value={difficultyRating}
                  onValueChange={setDifficultyRating}
                  required
                  disabled={!user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 - Very Hard</SelectItem>
                    <SelectItem value="4">4 - Hard</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="2">2 - Easy</SelectItem>
                    <SelectItem value="1">1 - Very Easy</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty_rating && (
                  <p className="text-sm text-destructive">
                    {errors.difficulty_rating}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Received (Optional)</Label>
                <Select
                  value={gradeReceived}
                  onValueChange={setGradeReceived}
                  disabled={!user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="C+">C+</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="C-">C-</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                    <SelectItem value="P">P (Pass)</SelectItem>
                    <SelectItem value="W">W (Withdraw)</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Would Take Again? (Optional)</Label>
                <RadioGroup
                  value={wouldTakeAgain}
                  onValueChange={setWouldTakeAgain}
                  disabled={!user}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review *</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this professor and course..."
                required
                rows={5}
                disabled={!user}
                maxLength={1000}
              />
              {errors.text && (
                <p className="text-sm text-destructive">{errors.text}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous-review"
                checked={isAnonymous}
                onCheckedChange={(checked) =>
                  setIsAnonymous(checked as boolean)
                }
                disabled={!user}
              />
              <Label
                htmlFor="anonymous-review"
                className="cursor-pointer text-sm text-muted-foreground"
              >
                Post anonymously
                <span className="block text-xs mt-1">
                  When enabled, your name and email are hidden from other users.
                </span>
              </Label>
            </div>

            <Button type="submit" disabled={!user || submitting}>
              {submitting
                ? "Submitting..."
                : user
                ? "Submit Review"
                : "Login to Submit"}
            </Button>

            {!user && (
              <p className="text-sm text-muted-foreground italic">
                Want to post a review? Log in to participate. You can still post
                anonymously after logging in.
              </p>
            )}
          </form>
        </Card>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by professor or course code..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                professorName={review.professor_name}
                professorId={review.professor_id}
                courseCode={review.course_code}
                rating={review.overall_rating || review.rating || 0}
                difficultyRating={review.difficulty_rating}
                gradeReceived={review.grade_received}
                wouldTakeAgain={review.would_take_again}
                text={review.text}
                createdAt={review.created_at}
                isAnonymous={review.is_anonymous}
                displayName={review.display_name}
                email={review.email}
                likesCount={review.likes_count || 0}
              />
            ))}
          </div>
        )}

        {!loading && allReviews.length === 0 && !searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No reviews yet. Be the first to add one!
            </p>
          </div>
        )}

        {!loading &&
          allReviews.length > 0 &&
          filteredReviews.length === 0 &&
          searchTerm && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No reviews match your search.
              </p>
            </div>
          )}

        <div className="mt-12 text-center text-xs text-muted-foreground border-t border-border pt-6">
          NAU Threads is a student-run platform and is not officially affiliated
          with North American University. All reviews are user-generated
          opinions.
        </div>
      </div>

      <CourseSuggestionModal
  open={showCourseSuggestion}
  onOpenChange={setShowCourseSuggestion}
  onCourseAdded={(course) => {
    // добавить в локальный список (чтобы сразу появился)
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === course.id);
      if (exists) return prev;
      return [course, ...prev];
    });

    // сразу выбрать
    setSelectedCourseId(course.id);
    setCourseCode(course.code);
  }}
/>

    </div>
  );
}
