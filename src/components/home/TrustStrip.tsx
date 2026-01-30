import { memo } from "react";
import { Shield, Clock, BadgeCheck, Headphones, Users } from "lucide-react";

const trustItems = [
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Travelers",
  },
  {
    icon: BadgeCheck,
    value: "4.9★",
    label: "Average Rating",
  },
  {
    icon: Shield,
    value: "Best Price",
    label: "Guaranteed",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Support",
  },
];

const TrustStrip = memo(() => {
  return (
    <section className="bg-primary py-4 border-y border-primary-foreground/10">
      <div className="container">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-primary-foreground/90"
            >
              <item.icon className="w-5 h-5 text-secondary" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm">{item.value}</span>
                <span className="text-xs text-primary-foreground/70">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustStrip.displayName = "TrustStrip";

export default TrustStrip;
