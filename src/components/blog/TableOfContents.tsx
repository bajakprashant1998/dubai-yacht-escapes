import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = memo(({ content }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h2, h3");

    const items: TOCItem[] = [];
    elements.forEach((el, index) => {
      const id = el.id || `heading-${index}`;
      items.push({
        id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    // Set up intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <motion.div
      className="hidden xl:block sticky top-32"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
          <List className="w-4 h-4 text-secondary" />
          <span className="text-sm font-semibold text-foreground">
            Table of Contents
          </span>
        </div>

        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`
                w-full text-left py-2 px-3 rounded-lg text-sm transition-all
                ${heading.level === 3 ? "pl-6" : ""}
                ${
                  activeId === heading.id
                    ? "bg-secondary/10 text-secondary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
});

TableOfContents.displayName = "TableOfContents";

export default TableOfContents;
