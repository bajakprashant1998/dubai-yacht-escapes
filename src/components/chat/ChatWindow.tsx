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

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

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
      className="w-full sm:w-[400px] h-[75vh] sm:h-[550px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border"
    >
      {/* Header */}
      <ChatHeader
        isAgentConnected={conversation?.is_agent_connected || false}
        isAgentOnline={isAgentOnline}
        onMinimize={onMinimize}
        onClose={onClose}
      />

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-background">
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
        <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border-t border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            Connected with a live agent
          </span>
        </div>
      )}

      {/* Waiting for Agent Banner */}
      {conversation?.status === "waiting_agent" && !conversation.is_agent_connected && (
        <div className="px-4 py-2.5 bg-secondary/5 border-t border-secondary/20 flex items-center gap-2">
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
          <div className="px-4 py-2 border-t border-border bg-muted/50">
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
