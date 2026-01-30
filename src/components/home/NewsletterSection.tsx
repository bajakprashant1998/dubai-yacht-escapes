import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle, Gift, Bell, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  { icon: Gift, text: "Exclusive deals & discounts" },
  { icon: Bell, text: "New tour announcements" },
  { icon: Star, text: "VIP early access" },
];

const NewsletterSection = memo(() => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    toast({
      title: "Welcome aboard! 🎉",
      description: "You've successfully subscribed to our newsletter.",
    });
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/10 via-background to-secondary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-semibold">Stay Updated</span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Join Our Travel Community
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Subscribe for exclusive deals, travel tips, and be the first to know about new experiences
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-sm"
              >
                <benefit.icon className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">{benefit.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 pr-4 text-base rounded-xl border-2 border-border focus:border-secondary"
                disabled={isSubmitting || isSubscribed}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-14 px-8 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold shadow-lg shadow-secondary/20"
              disabled={isSubmitting || isSubscribed || !email}
            >
              {isSubscribed ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Subscribed!
                </>
              ) : isSubmitting ? (
                <span className="animate-pulse">Subscribing...</span>
              ) : (
                <>
                  Subscribe
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Trust text */}
          <motion.p
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            🔒 No spam, ever. Unsubscribe anytime. Join 10,000+ happy travelers.
          </motion.p>
        </div>
      </div>
    </section>
  );
});

NewsletterSection.displayName = "NewsletterSection";

export default NewsletterSection;
