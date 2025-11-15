import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ReviewCard } from "@/components/ReviewCard";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";

const reviewSchema = z.object({
  professor_name: z.string()
    .trim()
    .min(1, "Professor name is required")
    .max(100, "Professor name must be less than 100 characters"),
  course_code: z.string()
    .trim()
    .min(1, "Course code is required")
    .max(20, "Course code must be less than 20 characters"),
  rating: z.number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  text: z.string()
    .trim()
    .min(1, "Review text is required")
    .max(1000, "Review must be less than 1000 characters"),
});

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [professorName, setProfessorName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // First, get all reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Then, get all profiles to map display names
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name");

      if (profilesError) throw profilesError;

      // Create a map of user_id to display_name
      const profilesMap = new Map<string, string | null>();
      profilesData?.forEach(p => {
        profilesMap.set(p.id, p.display_name);
      });

      // Map the data to include display_name
      const mappedData = reviewsData?.map((review: any) => ({
        ...review,
        display_name: profilesMap.get(review.user_id) || null,
        email: null, // Email not directly available from reviews table
      })) || [];

      console.log("allReviews length:", mappedData.length);
      setReviews(mappedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // On error, try simple query without profile data
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        console.log("allReviews length (fallback):", data?.length || 0);
        setReviews(data || []);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    // Validate input
    const result = reviewSchema.safeParse({
      professor_name: professorName,
      course_code: courseCode,
      rating: parseInt(rating),
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
        professor_name: professorName.trim(),
        course_code: courseCode.trim(),
        rating: parseInt(rating),
        text: reviewText.trim(),
        user_id: user.id,
        is_anonymous: isAnonymous,
      });

      if (error) throw error;
      toast.success("Review submitted successfully!");
      setProfessorName("");
      setCourseCode("");
      setRating("");
      setReviewText("");
      setIsAnonymous(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Separate allReviews and filteredReviews
  const allReviews = reviews;
  const searchTerm = searchQuery.trim();
  
  const filteredReviews = searchTerm
    ? allReviews.filter(
        (review) =>
          review.professor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.course_code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allReviews;

  // Debug logs
  console.log("allReviews length:", allReviews.length);
  console.log("filteredReviews length:", filteredReviews.length);
  console.log("searchTerm:", searchTerm);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Professor & Course Reviews</h1>

        {/* Add Review Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Add a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professor">Professor Name</Label>
                <Input
                  id="professor"
                  value={professorName}
                  onChange={(e) => setProfessorName(e.target.value)}
                  placeholder="e.g., Dr. Smith"
                  required
                  disabled={!user}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course Code</Label>
                <Input
                  id="course"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g., CS 101"
                  required
                  disabled={!user}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select value={rating} onValueChange={setRating} required disabled={!user}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="1">1 - Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                required
                rows={4}
                disabled={!user}
                maxLength={1000}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous-review"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                disabled={!user}
              />
              <Label htmlFor="anonymous-review" className="cursor-pointer text-sm text-muted-foreground">
                Post anonymously
                <span className="block text-xs mt-1">When enabled, your name and email are hidden from other users.</span>
              </Label>
            </div>
            <Button type="submit" disabled={!user || submitting}>
              {submitting ? "Submitting..." : user ? "Submit Review" : "Login to Submit"}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground italic">
                Want to post a review? Log in to participate. You can still post anonymously after logging in.
              </p>
            )}
          </form>
        </Card>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
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
                professorName={review.professor_name}
                courseCode={review.course_code}
                rating={review.rating}
                text={review.text}
                createdAt={review.created_at}
                isAnonymous={review.is_anonymous}
                displayName={review.display_name}
                email={review.email}
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

        {!loading && allReviews.length > 0 && filteredReviews.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No reviews match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}