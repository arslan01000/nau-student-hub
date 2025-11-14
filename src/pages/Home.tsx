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
        .from("posts")
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
            NAU Student Hub
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Real answers from real students
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Connect with fellow NAU students. Ask questions, share experiences, review professors, 
            and find everything you need for campus life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/discussions">
              <Button size="lg" className="text-lg px-8">
                Start a Discussion
              </Button>
            </Link>
            <Link to="/reviews">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Reviews
              </Button>
            </Link>
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
            <div className="p-6 rounded-lg border border-border bg-card/30">
              <h3 className="text-xl font-bold mb-3">Ask & Answer</h3>
              <p className="text-muted-foreground">
                Get help with academics, campus life, and everything in between from fellow students.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/30">
              <h3 className="text-xl font-bold mb-3">Professor Reviews</h3>
              <p className="text-muted-foreground">
                Share and read honest reviews about professors and courses to make informed decisions.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/30">
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