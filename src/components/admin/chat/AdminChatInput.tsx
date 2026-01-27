import { useState, FormEvent, KeyboardEvent, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CannedResponsePicker from "./CannedResponsePicker";
import { useCannedResponses } from "@/hooks/useCannedResponses";

interface AdminChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  visitorName?: string;
  agentName?: string;
}

const AdminChatInput = ({
  onSend,
  disabled,
  visitorName,
  agentName,
}: AdminChatInputProps) => {
  const [message, setMessage] = useState("");
  const { getByShortcut } = useCannedResponses();

  // Check for shortcut when message starts with /
  useEffect(() => {
    if (message.startsWith("/") && message.includes(" ") === false) {
      const response = getByShortcut(message);
      if (response) {
        let content = response.content;
        content = content.replace(/\{visitor_name\}/g, visitorName || "there");
        content = content.replace(/\{agent_name\}/g, agentName || "Agent");
        content = content.replace(/\{date\}/g, new Date().toLocaleDateString());
        setMessage(content);
      }
    }
  }, [message, getByShortcut, visitorName, agentName]);

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

  const handleCannedSelect = (content: string) => {
    setMessage(content);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t border-border">
      <div className="flex items-end gap-2">
        <CannedResponsePicker
          onSelect={handleCannedSelect}
          visitorName={visitorName}
          agentName={agentName}
        />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply or use /shortcut..."
          disabled={disabled}
          className="min-h-[44px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-11 w-11 bg-primary hover:bg-primary/90 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default AdminChatInput;
