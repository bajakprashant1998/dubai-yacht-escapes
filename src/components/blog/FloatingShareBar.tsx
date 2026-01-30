import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FloatingShareBarProps {
  url: string;
  title: string;
}

const FloatingShareBar = memo(({ url, title }: FloatingShareBarProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const socialButtons = [
    { platform: "twitter", icon: Twitter, label: "Share on X" },
    { platform: "facebook", icon: Facebook, label: "Share on Facebook" },
    { platform: "linkedin", icon: Linkedin, label: "Share on LinkedIn" },
  ];

  return (
    <motion.div
      className="hidden lg:flex flex-col gap-3 sticky top-32"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Share
      </span>

      {socialButtons.map(({ platform, icon: Icon, label }) => (
        <Button
          key={platform}
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full border-border hover:border-secondary hover:bg-secondary/10 hover:text-secondary transition-all"
          onClick={() => handleShare(platform)}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}

      <div className="w-full h-px bg-border my-2" />

      <Button
        variant="outline"
        size="icon"
        className={`w-10 h-10 rounded-full border-border transition-all ${
          copied
            ? "border-green-500 bg-green-500/10 text-green-500"
            : "hover:border-secondary hover:bg-secondary/10 hover:text-secondary"
        }`}
        onClick={copyToClipboard}
        title="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
});

FloatingShareBar.displayName = "FloatingShareBar";

export default FloatingShareBar;
