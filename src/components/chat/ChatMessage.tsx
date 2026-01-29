import { ChatMessage as ChatMessageType, formatChatTime } from "@/lib/chatUtils";
import { cn } from "@/lib/utils";
import { User, Bot, Headset, Check, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isVisitor = message.sender_type === "visitor";
  const isBot = message.sender_type === "bot";
  const isAgent = message.sender_type === "agent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex items-end gap-2 mb-4",
        isVisitor ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar with enhanced styling */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
          isVisitor
            ? "bg-gradient-to-br from-secondary to-secondary/80"
            : isAgent
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
            : "bg-gradient-to-br from-primary to-primary/80"
        )}
      >
        {isVisitor ? (
          <User className="w-4 h-4 text-primary" />
        ) : isAgent ? (
          <Headset className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-secondary" />
        )}
      </motion.div>

      {/* Message bubble with enhanced styling */}
      <div className="max-w-[78%] flex flex-col gap-1">
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm",
            isVisitor
              ? "bg-gradient-to-br from-secondary to-secondary/90 text-primary rounded-br-md"
              : isAgent
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-bl-md"
              : "bg-gradient-to-br from-primary/95 to-primary/85 text-white rounded-bl-md"
          )}
        >
          {/* Subtle shine effect on bot/agent messages */}
          {!isVisitor && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rotate-12" />
            </div>
          )}
          
          <p className="relative text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        
        {/* Timestamp with read indicator */}
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] text-muted-foreground px-2",
            isVisitor ? "justify-end" : "justify-start"
          )}
        >
          <span>{formatChatTime(message.created_at)}</span>
          {isVisitor && (
            <CheckCheck className="w-3 h-3 text-secondary" />
          )}
          {isAgent && <span className="text-emerald-600">• Support Agent</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
