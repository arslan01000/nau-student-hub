import { Card } from "./ui/card";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserDisplayName } from "@/utils/userDisplay";

interface ReviewCardProps {
  professorName: string;
  courseCode: string;
  rating: number;
  text: string;
  createdAt: string;
  isAnonymous: boolean;
  displayName?: string | null;
  email?: string | null;
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
}: ReviewCardProps) => {
  const reviewerName = getUserDisplayName(isAnonymous, displayName, email);
  
  return (
    <Card className="p-6 border-border bg-card/50 backdrop-blur">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold">{professorName}</h3>
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
      <p className="text-muted-foreground mb-3">{text}</p>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Review by {reviewerName}</span>
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      </div>
    </Card>
  );
};