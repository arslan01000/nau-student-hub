import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { getUserDisplayName } from "@/utils/userDisplay";
import { useLike } from "@/hooks/useLike";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";
import { cn } from "@/lib/utils";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  upvotes: number;
  createdAt: string;
  replyCount?: number;
  displayName?: string | null;
  email?: string | null;
}

const categoryColors: Record<string, string> = {
  professors: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  courses: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  internships: "bg-green-500/20 text-green-400 border-green-500/30",
  opt_cpt: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  campus_life: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  buy_sell: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export const PostCard = ({
  id,
  title,
  content,
  category,
  isAnonymous,
  upvotes,
  createdAt,
  replyCount = 0,
  displayName,
  email,
}: PostCardProps) => {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const { liked, count, loading, toggleLike } = useLike(
    "post", 
    id, 
    upvotes, 
    user?.id || null,
    showLoginPrompt
  );
  const displayedName = getUserDisplayName(isAnonymous, displayName, email);
  const categoryLabel = category.replace("_", " / ").toUpperCase();

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  };

  return (
    <Link to={`/post/${id}`}>
      <Card className="p-6 hover-scale cursor-pointer border-border bg-card/50 backdrop-blur transition-all hover:border-primary/50">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <Badge variant="outline" className={categoryColors[category] || ""}>
            {categoryLabel}
          </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-2 mb-4">{content}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button
            onClick={handleLikeClick}
            disabled={loading}
            className={cn(
              "flex items-center gap-1 transition-colors hover:text-primary",
              liked && "text-primary"
            )}
          >
            <ThumbsUp size={16} className={cn(liked && "fill-primary")} />
            <span>{count}</span>
          </button>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>{replyCount}</span>
          </div>
          <span>Posted by {displayedName}</span>
          <span className="ml-auto">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </Card>
    </Link>
  );
};
