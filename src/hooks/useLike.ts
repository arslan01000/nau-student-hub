import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type LikeType = "post" | "review";

export function useLike(
  type: LikeType,
  itemId: string,
  initialCount: number,
  userId: string | null
) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Check if user has already liked
  useEffect(() => {
    if (!userId || !itemId) return;

    const checkLiked = async () => {
      if (type === "post") {
        const { data } = await supabase
          .from("post_likes")
          .select("id")
          .eq("user_id", userId)
          .eq("post_id", itemId)
          .maybeSingle();
        setLiked(!!data);
      } else {
        const { data } = await supabase
          .from("review_likes")
          .select("id")
          .eq("user_id", userId)
          .eq("review_id", itemId)
          .maybeSingle();
        setLiked(!!data);
      }
    };

    checkLiked();
  }, [userId, itemId, type]);

  // Sync count when initialCount changes
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const toggleLike = async () => {
    if (!userId) {
      toast.error("Please login to like");
      return;
    }

    if (loading) return;

    setLoading(true);
    
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((prev) => (wasLiked ? Math.max(prev - 1, 0) : prev + 1));

    try {
      if (type === "post") {
        const { error } = await supabase.rpc("toggle_post_like", {
          p_post_id: itemId,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.rpc("toggle_review_like", {
          p_review_id: itemId,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      // Revert optimistic update
      setLiked(wasLiked);
      setCount((prev) => (wasLiked ? prev + 1 : Math.max(prev - 1, 0)));
      toast.error(error.message || "Failed to update like");
    } finally {
      setLoading(false);
    }
  };

  return { liked, count, loading, toggleLike };
}
