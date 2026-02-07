import { useState, FormEvent, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({ onSend, disabled, placeholder = "Type your message..." }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const hasText = message.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[48px] max-h-[120px] resize-none bg-background/80 border-border/50 rounded-2xl pr-4 focus-visible:ring-secondary/50 focus-visible:border-secondary/50 transition-all duration-200 placeholder:text-muted-foreground/60"
            rows={1}
          />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={hasText ? "active" : "inactive"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              type="submit"
              size="icon"
              disabled={!hasText || disabled}
              className={`h-12 w-12 rounded-full flex-shrink-0 shadow-md transition-all duration-200 ${
                hasText 
                  ? "bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-primary" 
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Send className={`w-5 h-5 transition-transform duration-200 ${hasText ? "-rotate-45" : ""}`} />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </form>
  );
};

export default ChatInput;
