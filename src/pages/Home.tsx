import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare, Star, FileText, TrendingUp, Users, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HomeProps {
  onLoginClick: () => void;
}

export default function Home({ onLoginClick }: HomeProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts_view")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
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
              <Link to="/create">
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
                <span className="text-sm text-foreground">Is 4 classes too much in one semester? • 9 replies</span>
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

      {/* Latest Discussions */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-serif mb-2">Latest Discussions</h2>
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
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  content={post.content}
                  category={post.category}
                  isAnonymous={post.is_anonymous}
                  upvotes={post.upvotes}
                  createdAt={post.created_at}
                  displayName={post.displayName}
                  email={post.email}
                />
              ))}
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20 bg-card/50 rounded-2xl border border-border/50">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No discussions yet. Be the first to start one!
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
