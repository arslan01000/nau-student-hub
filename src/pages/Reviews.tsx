import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [professorName, setProfessorName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    fetchReviews();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        professor_name: professorName,
        course_code: courseCode,
        rating: parseInt(rating),
        text: reviewText,
        user_id: user.id,
      });

      if (error) throw error;
      toast.success("Review submitted successfully!");
      setProfessorName("");
      setCourseCode("");
      setRating("");
      setReviewText("");
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.professor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Button type="submit" disabled={!user || submitting}>
              {submitting ? "Submitting..." : user ? "Submit Review" : "Login to Submit"}
            </Button>
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
              />
            ))}
          </div>
        )}

        {!loading && filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No reviews found matching your search." : "No reviews yet. Be the first to add one!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}