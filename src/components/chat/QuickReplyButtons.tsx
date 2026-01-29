import { Button } from "@/components/ui/button";
import { quickReplies } from "@/lib/chatUtils";
import { Ship, DollarSign, Calendar, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface QuickReplyButtonsProps {
  onSelect: (message: string) => void;
}

const icons = {
  tours: Ship,
  pricing: DollarSign,
  booking: Calendar,
  contact: Phone,
};

const QuickReplyButtons = ({ onSelect }: QuickReplyButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border/30 bg-gradient-to-b from-muted/20 to-muted/40">
      {quickReplies.map((reply, index) => {
        const Icon = icons[reply.id as keyof typeof icons];
        return (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(reply.message)}
              className="h-9 px-3.5 text-xs font-medium bg-card hover:bg-secondary hover:text-primary hover:border-secondary border-border/60 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95"
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              {reply.label}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickReplyButtons;
