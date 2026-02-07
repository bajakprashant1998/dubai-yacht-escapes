import { motion } from "framer-motion";

const partners = [
  { name: "TripAdvisor", display: "TripAdvisor" },
  { name: "Viator", display: "Viator" },
  { name: "GetYourGuide", display: "GetYourGuide" },
  { name: "Dubai Tourism", display: "Dubai Tourism" },
  { name: "Emirates", display: "Emirates" },
  { name: "Booking.com", display: "Booking.com" },
  { name: "Expedia", display: "Expedia" },
  { name: "Klook", display: "Klook" },
];

const PartnersStrip = () => {
  return (
    <section className="py-16 bg-muted/30 border-t border-border/50 overflow-hidden">
      <div className="container mb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium mb-3">
            Our Partners
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Trusted By Industry Leaders
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex animate-marquee">
          {/* First set */}
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-1`}
              className="flex-shrink-0 mx-8 sm:mx-12"
            >
              <div className="flex items-center justify-center h-12 px-6 py-2 bg-background/50 rounded-lg border border-border/50 hover:border-secondary/30 transition-colors group cursor-default">
                <span className="text-muted-foreground/60 font-semibold text-base sm:text-lg whitespace-nowrap group-hover:text-secondary transition-colors">
                  {partner.display}
                </span>
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-2`}
              className="flex-shrink-0 mx-8 sm:mx-12"
            >
              <div className="flex items-center justify-center h-12 px-6 py-2 bg-background/50 rounded-lg border border-border/50 hover:border-secondary/30 transition-colors group cursor-default">
                <span className="text-muted-foreground/60 font-semibold text-base sm:text-lg whitespace-nowrap group-hover:text-secondary transition-colors">
                  {partner.display}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersStrip;
