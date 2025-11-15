import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare, Star, FileText, TrendingUp, Users, BookOpen } from "lucide-react";

export default function Home() {
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
      {/* Hero Section - Modern Dark with Floating Cards */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        
        {/* Gradient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Text & CTAs */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Unofficial Student Platform
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                The Unofficial NAU <br />
                Student Platform
                <span className="block mt-2 text-gradient">powered by the student community.</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Real insights and real experiences from students at North American University. 
                Ask questions, share knowledge, and explore discussions created by the NAU community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/discussions">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 shadow-glow">
                    Browse Discussions
                  </Button>
                </Link>
                <Link to="/discussions">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-border/50 hover:border-primary/50">
                    Ask a Question
                  </Button>
                </Link>
              </div>

              <Link to="/discussions">
                <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
                  Join the Community →
                </Button>
              </Link>
            </div>

            {/* Right side - Floating Cards */}
            <div className="hidden lg:block relative h-[600px]">
              {/* Question Thread Card */}
              <div className="absolute top-0 right-0 w-80 p-5 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-float float-animation">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Best CS professors?</h3>
                    <p className="text-sm text-muted-foreground">Looking for recommendations for next semester...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/30">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 24 upvotes
                  </span>
                  <span>12 replies</span>
                  <span>2h ago</span>
                </div>
              </div>

              {/* Review Card */}
              <div className="absolute top-32 right-24 w-72 p-5 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-float float-delayed">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Star className="w-5 h-5 text-accent fill-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">Prof. Johnson</span>
                      <span className="text-xs text-muted-foreground">CS 101</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Great professor! Makes complex topics easy to understand.</p>
                  </div>
                </div>
              </div>

              {/* Discussion Snippet */}
              <div className="absolute top-80 right-12 w-64 p-4 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-float float-animation">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "Does anyone know when spring registration opens?"
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-primary font-medium">3 answers</span> • Just now
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Question Bubble */}
              <div className="absolute bottom-20 right-32 w-56 p-4 bg-primary/5 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-float float-delayed">
                <p className="text-sm text-foreground/90 font-medium">
                  "What class should I take next semester?"
                </p>
                <div className="mt-2 text-xs text-muted-foreground">Anonymous • 5m ago</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-t border-b border-border/50 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-gradient">48%</div>
              <p className="text-muted-foreground">of NAU students reached</p>
            </div>
            <div className="text-center space-y-2 md:border-x border-border/50">
              <div className="text-5xl md:text-6xl font-bold text-gradient">320+</div>
              <p className="text-muted-foreground">real stories, reviews, and discussions</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-gradient">12</div>
              <p className="text-muted-foreground">academic departments represented</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Discussions */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Latest Discussions</h2>
              <p className="text-muted-foreground">See what the community is talking about</p>
            </div>
            <Link to="/discussions">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
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
      <section className="py-20 px-4 bg-card/30 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Ask & Answer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get help with academics, campus life, and everything in between from fellow students.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
              <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Professor Reviews</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share and read honest reviews about professors and courses to make informed decisions.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Buy & Sell</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find great deals on textbooks and items from other NAU students.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
