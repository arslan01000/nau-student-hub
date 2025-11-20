import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Star, MessageSquare } from "lucide-react";

interface Professor {
  id: string;
  title: string;
  full_name: string;
  department: string;
  avgRating: number;
  totalReviews: number;
}

export default function Professors() {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProfessors();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProfessors(professors);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProfessors(
        professors.filter(
          (prof) =>
            prof.full_name.toLowerCase().includes(query) ||
            prof.department.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, professors]);

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      // Fetch all professors
      const { data: professorsData, error: profError } = await supabase
        .from("professors")
        .select("*")
        .order("full_name");

      if (profError) throw profError;

      // Fetch all reviews to calculate stats
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("professor_id, overall_rating");

      if (reviewsError) throw reviewsError;

      // Group reviews by professor
      const reviewsByProfessor = new Map<string, number[]>();
      reviewsData?.forEach((review) => {
        if (review.professor_id) {
          const ratings = reviewsByProfessor.get(review.professor_id) || [];
          ratings.push(review.overall_rating || 0);
          reviewsByProfessor.set(review.professor_id, ratings);
        }
      });

      // Map professors with their stats
      const professorsWithStats = professorsData?.map((prof) => {
        const ratings = reviewsByProfessor.get(prof.id) || [];
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;
        return {
          id: prof.id,
          title: prof.title || "",
          full_name: prof.full_name,
          department: prof.department,
          avgRating,
          totalReviews: ratings.length,
        };
      }) || [];

      setProfessors(professorsWithStats);
      setFilteredProfessors(professorsWithStats);
    } catch (error) {
      console.error("Error fetching professors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Professors</h1>
          <p className="text-muted-foreground">
            Browse professor profiles and ratings from NAU students
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search professors by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessors.map((professor) => (
              <Card
                key={professor.id}
                className="p-6 border-border bg-card/50 backdrop-blur cursor-pointer hover:bg-card/70 transition-all"
                onClick={() => navigate(`/professors/${professor.id}`)}
              >
                <h3 className="text-xl font-bold mb-2">{professor.full_name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {professor.department}
                </p>

                <div className="flex items-center justify-between">
                  {professor.totalReviews > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-semibold">
                          {professor.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{professor.totalReviews} review{professor.totalReviews !== 1 ? 's' : ''}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No reviews yet</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProfessors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery.trim()
                ? "No professors match your search."
                : "No professors found yet."}
            </p>
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
