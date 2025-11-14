import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text & CTAs */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Real NAU answers. <br />
                <span className="text-primary">From real NAU students.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Ask about classes, professors, internships, OPT, housing, or campus life — 
                post with your name or stay fully anonymous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/discussions">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                    Browse Questions
                  </Button>
                </Link>
                <Link to="/discussions">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    Start a Discussion
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Unofficial, student-run, designed to make NAU life easier.
              </p>
            </div>

            {/* Right side - Mock card preview */}
            <div className="hidden md:block space-y-4">
              <div className="p-6 bg-card border border-border rounded-lg hover-scale">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">Best CS professors?</h3>
                    <p className="text-sm text-muted-foreground">Looking for recommendations...</p>
                  </div>
                  <span className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded">
                    Professors & Courses
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Posted by Anonymous • 2h ago</p>
              </div>
              
              <div className="p-6 bg-card border border-border rounded-lg hover-scale opacity-80">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">OPT application timeline?</h3>
                    <p className="text-sm text-muted-foreground">When should I start applying...</p>
                  </div>
                  <span className="text-xs text-accent font-medium px-2 py-1 bg-accent/10 rounded">
                    OPT / CPT
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Posted by sara***@nau.edu • 5h ago</p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg hover-scale opacity-60">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">Good study spots on campus?</h3>
                    <p className="text-sm text-muted-foreground">Need quiet places to focus...</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium px-2 py-1 bg-muted rounded">
                    Campus Life
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Posted by Anonymous • 1d ago</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Discussions */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Latest Discussions</h2>
            <Link to="/discussions">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
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
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No discussions yet. Be the first to start one!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-bold mb-3">Ask & Answer</h3>
              <p className="text-muted-foreground">
                Get help with academics, campus life, and everything in between from fellow students.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-bold mb-3">Professor Reviews</h3>
              <p className="text-muted-foreground">
                Share and read honest reviews about professors and courses to make informed decisions.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-bold mb-3">Buy & Sell</h3>
              <p className="text-muted-foreground">
                Find great deals on textbooks and items from other NAU students.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}