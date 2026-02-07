import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Headphones,
  Shield,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { useContactConfig } from "@/hooks/useContactConfig";
import SEOHead from "@/components/SEOHead";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const { phone, phoneFormatted, email, whatsappLinkWithGreeting, whatsappLink } = useContactConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form submitted:", data);
    setIsSubmitted(true);

    toast({
      title: "Message Sent! ✉️",
      description: "We'll get back to you within 24 hours.",
    });

    form.reset();
    setIsSubmitting(false);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactCards = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      value: phoneFormatted,
      action: `tel:${phone}`,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Get a response within 24hrs",
      value: email,
      action: `mailto:${email}`,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Quick chat support",
      value: "Send Message",
      action: whatsappLinkWithGreeting(),
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our Dubai office",
      value: "Dubai, UAE",
      action: "https://maps.google.com/?q=Dubai+Marina",
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  const trustIndicators = [
    { icon: Shield, text: "100% Secure" },
    { icon: Headphones, text: "24/7 Support" },
    { icon: Star, text: "5-Star Service" },
  ];

  const faqs = [
    {
      question: "What are your operating hours?",
      answer:
        "Our customer service team is available 24/7. Office hours are Sunday to Thursday, 9 AM to 6 PM (UAE time). Feel free to reach out anytime via WhatsApp or email.",
    },
    {
      question: "How quickly will I receive a response?",
      answer:
        "We aim to respond to all inquiries within 2 hours during business hours. For urgent matters, please call us directly or use WhatsApp for the fastest response.",
    },
    {
      question: "Can I modify or cancel my booking?",
      answer:
        "Yes! Free cancellation is available up to 24 hours before your experience. Modifications can be made subject to availability. Contact us as soon as possible for any changes.",
    },
    {
      question: "Do you offer group bookings?",
      answer:
        "Absolutely! We specialize in group tours and corporate events. Contact us for special group rates and customized packages tailored to your needs.",
    },
    {
      question: "Is hotel pickup included?",
      answer:
        "Hotel pickup is included with most of our tours. Check the specific tour details or contact us to confirm pickup arrangements from your hotel.",
    },
  ];

  const subjects = [
    { value: "general", label: "General Inquiry" },
    { value: "booking", label: "Booking Assistance" },
    { value: "support", label: "Customer Support" },
    { value: "partnership", label: "Business Partnership" },
    { value: "feedback", label: "Feedback & Suggestions" },
  ];

  return (
    <Layout>
      <SEOHead
        title="Contact Us"
        description="Get in touch with Betterview Tourism for Dubai tour bookings, inquiries, and support. We're here to help plan your perfect Dubai adventure."
        canonical="/contact"
        keywords={["contact Betterview", "Dubai tour booking", "Dubai tourism support"]}
      />
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-16 right-[10%] w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[5%] w-56 h-56 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">We'd Love to Hear From You</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Get in <span className="text-secondary">Touch</span>
            </h1>

            <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed">
              Have a question about our tours? Need help planning your Dubai adventure? 
              Our friendly team is here to help!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {contactCards.map((card, index) => (
              <motion.a
                key={index}
                href={card.action}
                target={card.action.startsWith("http") ? "_blank" : undefined}
                rel={card.action.startsWith("http") ? "noopener noreferrer" : undefined}
                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all group"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{card.description}</p>
                <p className="text-sm font-medium text-secondary">{card.value}</p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-card rounded-2xl p-8 shadow-xl border border-border"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you shortly.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+971 50 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.value} value={subject.value}>
                                  {subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us how we can help you..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12"
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Message Sent!
                      </>
                    ) : isSubmitting ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-border">
                {trustIndicators.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <item.icon className="w-4 h-4 text-secondary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Office Hours & Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Office Hours */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Office Hours
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Sunday - Thursday</span>
                    <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Friday</span>
                    <span className="font-medium text-foreground">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium text-foreground">Closed</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                  * Customer support available 24/7 via WhatsApp
                </p>
              </div>

              {/* Quick Contact */}
              <div className="bg-secondary/10 rounded-2xl p-8 border border-secondary/20">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="text-muted-foreground mb-6">
                  For urgent booking inquiries or last-minute changes, reach us directly:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`tel:${phone}`} className="flex-1">
                    <Button variant="outline" className="w-full h-12">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                  <a
                    href={whatsappLinkWithGreeting()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-primary-foreground">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
              <MapPin className="w-3 h-3" />
              Our Location
            </div>
          </div>
          <motion.div
            className="rounded-2xl overflow-hidden shadow-xl border border-border"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115498.92749955038!2d55.1152847!3d25.0761839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20Marina!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Betterview Tourism Location"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
              Common Questions
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find quick answers to the most common questions about our services
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-xl border border-border px-6 shadow-sm hover:border-secondary/30 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-secondary py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
