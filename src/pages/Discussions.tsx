import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "professors", label: "Professors & Courses" },
  { value: "courses", label: "Courses" },
  { value: "internships", label: "Internships" },
  { value: "opt_cpt", label: "OPT / CPT" },
  { value: "campus_life", label: "Campus Life" },
  { value: "buy_sell", label: "Buy / Sell" },
];

export default function Discussions() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("posts_view")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate("/create");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Discussions</h1>
          {user ? (
            <Button onClick={handleCreatePost}>Create Post</Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Please log in to create a post
            </div>
          )}
        </div>

        <div className="mb-8">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
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
                replyCount={post.reply_count || 0}
                displayName={post.display_name}
                email={post.email}
              />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No discussions found in this category.
            </p>
            <Button onClick={handleCreatePost}>Be the first to post!</Button>
          </div>
        )}
      </div>
    </div>
  );
}