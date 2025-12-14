import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare, Star, FileText, Users, BookOpen, ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface HomeProps {
  onLoginClick: () => void;
}

interface FeedItem {
  id: string;
  type: 'discussion' | 'review';
  title: string;
  content: string;
  category: string;
  upvotes: number;
  replyCount: number;
  createdAt: string;
  displayName: string | null;
  isAnonymous: boolean;
  // For reviews
  professorId?: string;
}

const categoryColors: { [key: string]: string } = {
  professors: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  courses: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  internships: "bg-green-500/20 text-green-400 border-green-500/30",
  opt_cpt: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  campus_life: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  buy_sell: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  review: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function Home({ onLoginClick }: HomeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedItems();
  }, []);

  const fetchFeedItems = async () => {
    try {
      // Fetch posts and reviews in parallel
      const [postsResult, reviewsResult] = await Promise.all([
        supabase
          .from("posts_view")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("reviews_view")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6)
      ]);

      const posts = (postsResult.data || []).map((post): FeedItem => ({
        id: post.id!,
        type: 'discussion',
        title: post.title || '',
        content: post.content || '',
        category: post.category || 'campus_life',
        upvotes: post.upvotes || 0,
        replyCount: post.reply_count || 0,
        createdAt: post.created_at || '',
        displayName: post.display_name,
        isAnonymous: post.is_anonymous || false,
      }));

      const reviews = (reviewsResult.data || []).map((review): FeedItem => ({
        id: review.id!,
        type: 'review',
        title: review.professor_name 
          ? `Review: ${review.professor_name}` 
          : `Review: ${review.course_code}`,
        content: review.text || '',
        category: 'review',
        upvotes: 0,
        replyCount: 0,
        createdAt: review.created_at || '',
        displayName: null,
        isAnonymous: review.is_anonymous || true,
        professorId: review.professor_id || undefined,
      }));

      // Merge and sort by created_at DESC
      const merged = [...posts, ...reviews]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

      setFeedItems(merged);
    } catch (error) {
      console.error("Error fetching feed items:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCategory = (category: string) => {
    if (category === 'review') return 'REVIEW';
    return category.replace("_", " / ").toUpperCase();
  };

  const getDisplayName = (item: FeedItem) => {
    if (item.isAnonymous) return "Anonymous";
    if (item.displayName) return item.displayName;
    return "Unknown User";
  };

  const handleItemClick = (item: FeedItem) => {
    if (item.type === 'discussion') {
      navigate(`/discussions/${item.id}`);
    } else if (item.type === 'review' && item.professorId) {
      navigate(`/professors/${item.professorId}`);
    } else {
      navigate('/reviews');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Minimalistic */}
      <section className="relative py-32 md:py-40 px-4 overflow-hidden grid-pattern">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/30 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/50 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/70"></span>
              </span>
              Unofficial Student Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight tracking-tight">
              NAU Threads.
              <br />
              <span className="text-muted-foreground">Built by students, for students.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover professors, ask questions, explore real student experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
              <Link to="/reviews">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 h-12">
                  Explore Professor Reviews
                </Button>
              </Link>
              <Link to={user ? "/create" : "/discussions"}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 h-12">
                  Ask a Question
                </Button>
              </Link>
            </div>

            <Button 
              variant="ghost" 
              size="lg" 
              className="text-muted-foreground hover:text-foreground mt-4"
              onClick={() => {
                if (user) {
                  navigate("/discussions");
                } else {
                  onLoginClick();
                }
              }}
            >
              Join the Community →
            </Button>
          </div>
        </div>

        {/* Bottom Ticker with Student Post */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden">
          <div className="ticker-animation whitespace-nowrap">
            <div className="inline-flex items-center gap-8 px-4">
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Best CS professors for next semester? • 12 replies</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Prof. Johnson makes complex topics easy • 5.0 rating</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">When does spring registration open? • 3 answers</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Is 5 classes too much in one semester? • 9 replies</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Any easy Core classes to balance a heavy schedule? • 7 replies</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">How hard is CPT approval at NAU? • 5 answers</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Looking for roommates near campus next fall • 6 replies</span>
              </div>
              <div className="inline-flex items-center gap-3 px-4 py-3 bg-card/50 backdrop-blur border border-border rounded-lg">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Anonymous review: CS 2415 Systems Programming • 4.8 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-b border-border bg-card/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-serif font-bold text-foreground">48%</div>
              <p className="text-sm text-muted-foreground">of NAU students reached</p>
            </div>
            <div className="text-center space-y-2 md:border-x border-border">
              <div className="text-5xl md:text-6xl font-serif font-bold text-foreground">320+</div>
              <p className="text-sm text-muted-foreground">real stories, reviews, and discussions</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-serif font-bold text-foreground">12</div>
              <p className="text-sm text-muted-foreground">academic departments represented</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Discussions & Reviews */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-serif mb-2">Latest Discussions & Reviews</h2>
              <p className="text-sm text-muted-foreground">See what the community is talking about</p>
            </div>
            <Link to="/discussions">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                View All →
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {feedItems.map((item) => (
                <Card 
                  key={`${item.type}-${item.id}`}
                  className="group cursor-pointer hover:border-muted-foreground/50 transition-colors bg-card/50"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-serif text-lg text-foreground group-hover:text-foreground/80 line-clamp-1">
                        {item.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`shrink-0 text-xs ${categoryColors[item.category] || categoryColors.campus_life}`}
                      >
                        {formatCategory(item.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          {item.upvotes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {item.replyCount}
                        </span>
                        <span>Posted by {getDisplayName(item)}</span>
                      </div>
                      <span>
                        {item.createdAt && formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!loading && feedItems.length === 0 && (
            <div className="text-center py-20 bg-card/50 rounded-2xl border border-border/50">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No discussions or reviews yet. Be the first to start one!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card/20 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-border bg-card/30">
              <div className="p-2 bg-muted rounded-lg w-fit mb-4">
                <MessageSquare className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-serif mb-3">Ask & Answer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get help with academics, campus life, and everything in between from fellow students.
              </p>
            </div>
            <div className="p-8 rounded-lg border border-border bg-card/30">
              <div className="p-2 bg-muted rounded-lg w-fit mb-4">
                <Star className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-serif mb-3">Professor Reviews</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Share and read honest reviews about professors and courses to make informed decisions.
              </p>
            </div>
            <div className="p-8 rounded-lg border border-border bg-card/30">
              <div className="p-2 bg-muted rounded-lg w-fit mb-4">
                <BookOpen className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-serif mb-3">Buy & Sell</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find great deals on textbooks and items from other NAU students.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
