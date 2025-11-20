import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
export default function PostDetail() {
  const {
    id
  } = useParams();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    checkUser();
    fetchPost();
    fetchReplies();
  }, [id]);
  const checkUser = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };
  const fetchPost = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("posts_view").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Post not found");
    } finally {
      setLoading(false);
    }
  };
  const fetchReplies = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("replies").select("*").eq("post_id", id).order("created_at", {
        ascending: true
      });
      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };
  const handleReply = async () => {
    if (!user) {
      toast.error("Please login to reply");
      return;
    }
    if (!newReply.trim()) return;
    try {
      const {
        error
      } = await supabase.from("replies").insert({
        post_id: id,
        content: newReply,
        user_id: user.id
      });
      if (error) throw error;
      setNewReply("");
      fetchReplies();
      toast.success("Reply posted!");
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply");
    }
  };
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>;
  }
  if (!post) {
    return <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground">Post not found</p>
        </div>
      </div>;
  }
  const categoryLabel = post.category.replace("_", " / ").toUpperCase();
  return <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <Badge variant="outline" className="mb-2">
              {categoryLabel}
            </Badge>
            {post.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
          </div>
          <h1 className="mb-4 text-3xl font-medium">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-6 whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <ThumbsUp size={20} />
              <span>{post.upvotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span>{replies.length}</span>
            </div>
            <span className="ml-auto">
              {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true
            })}
            </span>
          </div>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl mb-4 font-serif font-medium">Replies ({replies.length})</h2>
          <Card className="p-6">
            <Textarea value={newReply} onChange={e => setNewReply(e.target.value)} placeholder={user ? "Write a reply..." : "Please login to reply"} rows={4} disabled={!user} className="mb-4" />
            <Button onClick={handleReply} disabled={!user || !newReply.trim()}>
              Post Reply
            </Button>
          </Card>
        </div>

        <div className="space-y-4">
          {replies.map(reply => <Card key={reply.id} className="p-6">
              <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
                {reply.content}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(reply.created_at), {
              addSuffix: true
            })}
              </p>
            </Card>)}
        </div>
      </div>
    </div>;
}