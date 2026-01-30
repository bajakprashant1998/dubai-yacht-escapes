import { memo } from "react";
import { Calendar, Clock, User, Eye } from "lucide-react";
import { format } from "date-fns";

interface AuthorBadgeProps {
  author?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
  publishedAt?: string | null;
  readingTime?: number;
  viewCount?: number;
}

const AuthorBadge = memo(
  ({ author, publishedAt, readingTime, viewCount }: AuthorBadgeProps) => {
    const authorName = author?.full_name || "Betterview Team";
    const initials = authorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex flex-wrap items-center gap-3">
        {/* Author */}
        <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border">
          {author?.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={authorName}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-[10px] font-bold text-secondary">
                {initials}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-foreground">{authorName}</span>
        </div>

        {/* Date */}
        {publishedAt && (
          <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(publishedAt), "MMM d, yyyy")}</span>
          </div>
        )}

        {/* Reading time */}
        {readingTime && (
          <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTime} min read</span>
          </div>
        )}

        {/* View count */}
        {viewCount !== undefined && viewCount > 0 && (
          <div className="flex items-center gap-1.5 bg-card px-3 py-1.5 rounded-full border border-border text-sm text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span>{viewCount.toLocaleString()} views</span>
          </div>
        )}
      </div>
    );
  }
);

AuthorBadge.displayName = "AuthorBadge";

export default AuthorBadge;
