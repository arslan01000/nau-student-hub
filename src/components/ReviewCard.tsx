import { Card } from "./ui/card";
import { Star, TrendingUp, Award, ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserDisplayName } from "@/utils/userDisplay";
import { useNavigate } from "react-router-dom";

interface ReviewCardProps {
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
}

export const ReviewCard = ({
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
}: ReviewCardProps) => {
  const reviewerName = getUserDisplayName(isAnonymous, displayName, email);
  const navigate = useNavigate();
  
  const handleProfessorClick = () => {
    if (professorId) {
      navigate(`/professors/${professorId}`);
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
        <span>Review by {reviewerName}</span>
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      </div>
    </Card>
  );
};