import { Card } from "./ui/card";
import { Star, TrendingUp, Award, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserDisplayName } from "@/utils/userDisplay";
import { useNavigate } from "react-router-dom";
import { useLike } from "@/hooks/useLike";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  id?: string;
  professorName: string;
  courseCode: string;
  rating: number;
  text: string;
  createdAt: string;
  isAnonymous: boolean;
  displayName?: string | null;
  email?: string | null;
  professorId?: string;
  difficultyRating?: number;
  gradeReceived?: string | null;
  wouldTakeAgain?: boolean | null;
  likesCount?: number;
}

export const ReviewCard = ({
  id,
  professorName,
  courseCode,
  rating,
  text,
  createdAt,
  isAnonymous,
  displayName,
  email,
  professorId,
  difficultyRating,
  gradeReceived,
  wouldTakeAgain,
  likesCount = 0,
}: ReviewCardProps) => {
  const { user } = useAuth();
  const { showLoginPrompt } = useLoginPrompt();
  const reviewerName = getUserDisplayName(isAnonymous, displayName, email);
  const navigate = useNavigate();
  
  const { liked, count, loading, toggleLike } = useLike(
    "review", 
    id || "", 
    likesCount, 
    user?.id || null,
    showLoginPrompt
  );
  
  const handleProfessorClick = () => {
    if (professorId) {
      navigate(`/professors/${professorId}`);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      toggleLike();
    }
  };

  return (
    <Card className="p-6 border-border bg-card/50 backdrop-blur">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 
            className={`text-lg font-bold ${professorId ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
            onClick={handleProfessorClick}
          >
            {professorName}
          </h3>
          <p className="text-sm text-primary">{courseCode}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "fill-primary text-primary" : "text-muted"}
            />
          ))}
        </div>
      </div>

      {/* Additional rating metrics */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
        {difficultyRating && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Difficulty: {difficultyRating}/5</span>
          </div>
        )}
        {gradeReceived && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>Grade: {gradeReceived}</span>
          </div>
        )}
        {wouldTakeAgain !== null && wouldTakeAgain !== undefined && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>Would take again: {wouldTakeAgain ? 'Yes' : 'No'}</span>
          </div>
        )}
      </div>

      <p className="text-muted-foreground mb-3">{text}</p>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Review by {reviewerName}</span>

          {id && (
            <button
              onClick={handleLikeClick}
              disabled={loading}
              className={cn(
                "flex items-center gap-1 transition-colors hover:text-primary",
                liked && "text-primary"
              )}
            >
              <ThumbsUp size={14} className={cn(liked && "fill-primary")} />
              <span>{count}</span>
            </button>
          )}
        </div>
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      </div>
    </Card>
  );
};
