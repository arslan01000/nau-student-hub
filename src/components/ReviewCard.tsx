import { Card } from "./ui/card";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  professorName: string;
  courseCode: string;
  rating: number;
  text: string;
  createdAt: string;
}

export const ReviewCard = ({
  professorName,
  courseCode,
  rating,
  text,
  createdAt,
}: ReviewCardProps) => {
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
      <p className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </p>
    </Card>
  );
};