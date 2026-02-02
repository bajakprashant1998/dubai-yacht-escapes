import { motion } from "framer-motion";
import { FileText, Plane, Globe, Shield, Check, Star } from "lucide-react";

const VisaHeroIllustration = () => {
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      {/* Central Document */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative w-48 h-64 md:w-56 md:h-72 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl shadow-secondary/20 border border-white/50 overflow-hidden">
          {/* Document Header */}
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-white" />
              <span className="text-white font-semibold text-sm">UAE VISA</span>
            </div>
          </div>
          
          {/* Document Content */}
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6" />
            
            <div className="pt-2">
              <div className="h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <div className="flex-1 h-8 bg-green-500/10 rounded-lg border border-green-200 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 h-8 bg-secondary/10 rounded-lg border border-secondary/20" />
            </div>
          </div>
          
          {/* Approved Stamp */}
          <motion.div
            className="absolute bottom-4 right-4 w-16 h-16"
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: -15, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          >
            <div className="w-full h-full rounded-full border-4 border-green-500 flex items-center justify-center bg-green-500/10">
              <span className="text-green-600 font-bold text-xs text-center">
                APPROVED
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      
      {/* Plane */}
      <motion.div
        className="absolute top-8 md:top-12 right-8 md:right-20"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-orange-500/30 flex items-center justify-center"
        >
          <Plane className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </motion.div>
      </motion.div>

      {/* Globe */}
      <motion.div
        className="absolute bottom-16 md:bottom-20 left-4 md:left-16"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [5, -5, 5], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-teal-500/30 flex items-center justify-center"
        >
          <Globe className="w-7 h-7 md:w-8 md:h-8 text-white" />
        </motion.div>
      </motion.div>

      {/* Star decorations */}
      <motion.div
        className="absolute top-20 left-8 md:left-24"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-12 md:right-32"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        >
          <Star className="w-5 h-5 text-secondary fill-secondary" />
        </motion.div>
      </motion.div>

      {/* Orbit rings */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[350px] md:h-[350px] border border-secondary/10 rounded-full"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] md:w-[450px] md:h-[450px] border border-secondary/5 rounded-full"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
      />

      {/* Small floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-secondary/30"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default VisaHeroIllustration;
