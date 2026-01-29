import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Headset } from "lucide-react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuickReplyButtons from "./QuickReplyButtons";
import TypingIndicator from "./TypingIndicator";
import LeadCaptureForm from "./LeadCaptureForm";
import { useChat } from "@/hooks/useChat";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  onMinimize: () => void;
  onClose: () => void;
}

const ChatWindow = ({ onMinimize, onClose }: ChatWindowProps) => {
  const {
    conversation,
    messages,
    isLoading,
    isBotTyping,
    isAgentOnline,
    initConversation,
    sendMessage,
    updateVisitorDetails,
    requestAgent,
  } = useChat();

  const [showLeadForm, setShowLeadForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation on mount
  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // Show lead form after 3 messages from visitor without details
  useEffect(() => {
    const visitorMessages = messages.filter((m) => m.sender_type === "visitor");
    if (
      visitorMessages.length >= 3 &&
      !conversation?.visitor_email &&
      !showLeadForm
    ) {
      setShowLeadForm(true);
    }
  }, [messages, conversation, showLeadForm]);

  const handleQuickReply = (message: string) => {
    sendMessage(message);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="w-full sm:w-[400px] h-[75vh] sm:h-[550px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border/50 backdrop-blur-sm"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}
    >
      {/* Header */}
      <ChatHeader
        isAgentConnected={conversation?.is_agent_connected || false}
        isAgentOnline={isAgentOnline}
        onMinimize={onMinimize}
        onClose={onClose}
      />

      {/* Messages Area with subtle gradient background */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-background/50 to-background">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
              <div className="space-y-2">
                <div className="h-16 w-48 rounded-2xl bg-primary/10 animate-pulse" />
              </div>
            </div>
            <div className="flex items-end gap-2 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-secondary/20 animate-pulse" />
              <div className="h-10 w-32 rounded-2xl bg-secondary/10 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isBotTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>

      {/* Agent Connected Banner */}
      {conversation?.is_agent_connected && (
        <div className="px-4 py-2 bg-green-600/10 border-t border-green-600/20 flex items-center gap-2">
          <Headset className="w-4 h-4 text-green-600" />
          <span className="text-xs text-green-600 font-medium">
            You are now connected with a live agent
          </span>
        </div>
      )}

      {/* Waiting for Agent Banner */}
      {conversation?.status === "waiting_agent" && !conversation.is_agent_connected && (
        <div className="px-4 py-2 bg-secondary/10 border-t border-secondary/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-secondary font-medium">
            Connecting you to support...
          </span>
        </div>
      )}

      {/* Lead Capture Form */}
      {showLeadForm && !conversation?.visitor_email && (
        <LeadCaptureForm
          onSubmit={updateVisitorDetails}
          onClose={() => setShowLeadForm(false)}
        />
      )}

      {/* Request Agent Button */}
      {!conversation?.is_agent_connected &&
        conversation?.status !== "waiting_agent" &&
        isAgentOnline &&
        messages.length > 2 && (
          <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              onClick={requestAgent}
              className="w-full h-8 text-xs"
            >
              <Headset className="w-3.5 h-3.5 mr-1.5" />
              Talk to a live agent
            </Button>
          </div>
        )}

      {/* Quick Replies */}
      {messages.length <= 2 && !showLeadForm && (
        <QuickReplyButtons onSelect={handleQuickReply} />
      )}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        placeholder={
          conversation?.is_agent_connected
            ? "Chat with our agent..."
            : "Type your message..."
        }
      />
    </motion.div>
  );
};

export default ChatWindow;
