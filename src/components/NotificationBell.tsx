import { useState, useRef, useEffect } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center h-9 w-9 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-secondary hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors",
                      !n.read && "bg-secondary/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        {n.link && (
                          <Link
                            to={n.link}
                            onClick={() => {
                              markAsRead(n.id);
                              setIsOpen(false);
                            }}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
