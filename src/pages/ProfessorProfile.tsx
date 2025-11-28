import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReviewCard } from "@/components/ReviewCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Star, TrendingUp, RefreshCw, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Professor {
  id: string;
  title?: string;
  full_name: string;
  department: string;
  school: string;
}

interface Review {
  id: string;
  overall_rating: number;
  difficulty_rating: number;
  grade_received: string | null;
  would_take_again: boolean | null;
  text: string;
  course_code: string;
  created_at: string;
  is_anonymous: boolean;
}

interface AggregatedStats {
  avgOverallRating: number;
  avgDifficulty: number;
  wouldTakeAgainPercent: number;
  totalRatings: number;
}

export default function ProfessorProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProfessorData();
    }
  }, [id]);

  const fetchProfessorData = async () => {
    setLoading(true);
    try {
      // Fetch professor details
      const { data: profData, error: profError } = await supabase
        .from("professors")
        .select("*")
        .eq("id", id)
        .single();

      if (profError) throw profError;
      setProfessor(profData);

      // 🔒 SECURITY: Don't fetch user_id - prevents user tracking
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, overall_rating, difficulty_rating, grade_received, would_take_again, text, course_code, created_at, is_anonymous")
        .eq("professor_id", id)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      setReviews(reviewsData || []);

      // Calculate aggregated stats
      if (reviewsData && reviewsData.length > 0) {
        const avgOverall = reviewsData.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviewsData.length;
        const avgDiff = reviewsData.reduce((sum, r) => sum + (r.difficulty_rating || 0), 0) / reviewsData.length;
        const wouldTakeAgainCount = reviewsData.filter(r => r.would_take_again === true).length;
        const wouldTakeAgainPercent = (wouldTakeAgainCount / reviewsData.length) * 100;

        setStats({
          avgOverallRating: avgOverall,
          avgDifficulty: avgDiff,
          wouldTakeAgainPercent,
          totalRatings: reviewsData.length,
        });
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error("Error fetching professor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRating = () => {
    if (!user) {
      // Could show login modal here
      return;
    }
    // Navigate to reviews page with professor pre-selected
    navigate(`/reviews?professorId=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Professor not found</h2>
          <Button onClick={() => navigate("/reviews")}>Back to Reviews</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <Card className="p-8 mb-8 border-border bg-card/50 backdrop-blur">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">
              {professor.title ? `${professor.title} ` : ""}{professor.full_name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Professor in the <span className="text-foreground font-medium">{professor.department}</span> department at {professor.school}
            </p>
            <p className="text-sm text-muted-foreground mt-1">NAU Threads community reviews</p>
          </div>

          {/* Stats Section */}
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.avgOverallRating.toFixed(1)} / 5.0</div>
                  <div className="text-sm text-muted-foreground">Overall Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.avgDifficulty.toFixed(1)} / 5.0</div>
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{Math.round(stats.wouldTakeAgainPercent)}%</div>
                  <div className="text-sm text-muted-foreground">Would take again</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 text-center py-8 border border-border rounded-lg">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No ratings yet. Be the first to rate this professor.</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {stats ? `Based on ${stats.totalRatings} rating${stats.totalRatings !== 1 ? 's' : ''}` : 'No ratings yet'}
            </p>
            <Button onClick={handleAddRating}>
              {stats ? 'Add a rating' : 'Be the first to add a rating'}
            </Button>
          </div>
        </Card>

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  professorName={professor.full_name}
                  courseCode={review.course_code}
                  rating={review.overall_rating || 0}
                  text={review.text}
                  createdAt={review.created_at}
                  isAnonymous={review.is_anonymous}
                  difficultyRating={review.difficulty_rating}
                  gradeReceived={review.grade_received}
                  wouldTakeAgain={review.would_take_again}
                />
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 text-center text-xs text-muted-foreground border-t border-border pt-6">
          NAU Threads is a student-run platform and is not officially affiliated with North American University. 
          All reviews are user-generated opinions.
        </div>
      </div>
    </div>
  );
}
