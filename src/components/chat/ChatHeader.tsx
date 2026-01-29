import { X, Minus, Headset, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChatHeaderProps {
  isAgentConnected: boolean;
  isAgentOnline: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

const ChatHeader = ({ isAgentConnected, isAgentOnline, onMinimize, onClose }: ChatHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/95" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }} />
      
      <div className="relative flex items-center justify-between p-4 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          {/* Logo with glow effect */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="absolute inset-0 bg-secondary/50 rounded-full blur-md" />
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg border border-secondary/30">
              <span className="text-primary font-display font-bold text-sm">LD</span>
            </div>
          </motion.div>
          
          <div>
            <h3 className="font-display font-semibold text-sm tracking-wide">Luxury Dhow Escapes</h3>
            <motion.p 
              className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {isAgentConnected ? (
                <>
                  <Headset className="w-3 h-3" />
                  <span className="font-medium">Live Support Connected</span>
                </>
              ) : (
                <>
                  <motion.span 
                    className={`w-2 h-2 rounded-full ${isAgentOnline ? "bg-emerald-400" : "bg-secondary"}`}
                    animate={isAgentOnline ? { 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1] 
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>{isAgentOnline ? "Agents available" : "AI Concierge"}</span>
                  {!isAgentOnline && <Sparkles className="w-3 h-3 text-secondary" />}
                </>
              )}
            </motion.p>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
