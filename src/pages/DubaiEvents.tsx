import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Ticket,
  Star, Filter, Search, ArrowRight, Sparkles, Tag
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDubaiEvents, DubaiEvent } from "@/hooks/useDubaiEvents";

const eventCategories = [
  { value: "", label: "All Events", icon: Sparkles },
  { value: "festival", label: "Festivals", icon: Star },
  { value: "shopping", label: "Shopping", icon: Tag },
  { value: "sports", label: "Sports", icon: Ticket },
  { value: "entertainment", label: "Entertainment", icon: Calendar },
  { value: "cultural", label: "Cultural", icon: MapPin },
  { value: "food", label: "Food & Dining", icon: Filter },
];

const categoryColors: Record<string, string> = {
  festival: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  shopping: "bg-pink-500/10 text-pink-700 border-pink-500/30",
  sports: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  entertainment: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  cultural: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  food: "bg-orange-500/10 text-orange-700 border-orange-500/30",
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const EventCard = ({ event }: { event: DubaiEvent }) => {
  const eventDate = new Date(event.event_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isPast = eventDate < new Date() && (!endDate || endDate < new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={isPast ? "opacity-60" : ""}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all group border-border/50 hover:border-secondary/40">
        {event.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {event.is_featured && (
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                <Star className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
            {event.is_free && (
              <Badge className="absolute top-3 right-3 bg-emerald-500 text-white">Free</Badge>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className={categoryColors[event.category] || "bg-muted text-muted-foreground"}>
              {event.category}
            </Badge>
            {isPast && <Badge variant="outline" className="text-muted-foreground">Past</Badge>}
          </div>
          <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span>
                {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {endDate && ` – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                {!endDate && `, ${eventDate.getFullYear()}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>{event.venue ? `${event.venue}, ${event.location}` : event.location}</span>
              </div>
            )}
            {event.start_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span>{event.start_time}{event.end_time && ` – ${event.end_time}`}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            {!event.is_free && event.price_from > 0 ? (
              <span className="font-semibold text-foreground">From AED {event.price_from}</span>
            ) : (
              <span className="font-semibold text-emerald-600">Free Entry</span>
            )}
            {event.ticket_url && (
              <a
                href={event.ticket_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Get Tickets <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DubaiEvents = () => {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events = [], isLoading } = useDubaiEvents({
    month: currentMonth,
    year: currentYear,
    category: selectedCategory || undefined,
  });

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  const navigateMonth = (dir: number) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  return (
    <Layout>
      <SEOHead
        title="Dubai Events Calendar 2026 | Festivals, Shopping & More"
        description="Discover the best events happening in Dubai — festivals, shopping events, sports, concerts, and cultural celebrations. Plan your visit around Dubai's exciting events."
        canonical="/events"
        keywords={["Dubai events", "Dubai festival", "Dubai shopping festival", "what's on Dubai", "Dubai calendar 2026"]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-secondary/20 text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 mb-4">
              <Calendar className="w-3 h-3 mr-1" /> Events Calendar
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Dubai Events <span className="text-secondary">Calendar</span>
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Stay updated with the hottest festivals, shopping events, sports tournaments, and cultural celebrations happening across Dubai.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Month Navigation */}
      <section className="container mx-auto px-4 py-8">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {monthNames[currentMonth - 1]} {currentYear}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className={selectedCategory === cat.value ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : ""}
              >
                <cat.icon className="w-3.5 h-3.5 mr-1.5" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}><CardContent className="p-5 space-y-3">
                <Skeleton className="h-48 w-full rounded" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent></Card>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-6">
              No events scheduled for {monthNames[currentMonth - 1]} {currentYear}
              {selectedCategory && ` in "${selectedCategory}" category`}.
            </p>
            <Button variant="outline" onClick={() => { setSelectedCategory(""); setSearchQuery(""); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Plan Your Visit Around These Events</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Use our AI trip planner to build the perfect itinerary that includes these events.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
              <Link to="/plan-trip">Plan My Trip <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dubai-guide">Travel Guide <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DubaiEvents;
