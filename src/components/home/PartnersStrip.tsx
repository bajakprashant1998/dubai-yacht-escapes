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
    <section className="py-14 bg-background border-y border-border/40 overflow-hidden">
      <div className="container mb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-medium">
            Trusted By Industry Leaders
          </p>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex animate-marquee">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 mx-8 sm:mx-12"
            >
              <div className="flex items-center justify-center h-12 px-6 py-2 rounded-lg hover:bg-muted/50 transition-colors group cursor-default">
                <span className="text-muted-foreground/50 font-bold text-lg sm:text-xl whitespace-nowrap group-hover:text-secondary/70 transition-colors duration-300 tracking-wide">
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
