import { useState, useMemo } from "react";
import { useCannedResponses, CannedResponse } from "@/hooks/useCannedResponses";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CannedResponsePickerProps {
  onSelect: (content: string) => void;
  visitorName?: string;
  agentName?: string;
}

const CannedResponsePicker = ({
  onSelect,
  visitorName = "there",
  agentName = "Agent",
}: CannedResponsePickerProps) => {
  const { responses, isLoading, getCategories } = useCannedResponses();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const categories = getCategories();

  const filteredResponses = useMemo(() => {
    if (!search) return responses;
    const lower = search.toLowerCase();
    return responses.filter(
      (r) =>
        r.title.toLowerCase().includes(lower) ||
        r.content.toLowerCase().includes(lower) ||
        r.shortcut?.toLowerCase().includes(lower)
    );
  }, [responses, search]);

  const groupedResponses = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = filteredResponses.filter((r) => r.category === category);
      return acc;
    }, {} as Record<string, CannedResponse[]>);
  }, [categories, filteredResponses]);

  const replaceVariables = (content: string) => {
    return content
      .replace(/\{visitor_name\}/g, visitorName)
      .replace(/\{agent_name\}/g, agentName)
      .replace(/\{date\}/g, new Date().toLocaleDateString());
  };

  const handleSelect = (response: CannedResponse) => {
    const processed = replaceVariables(response.content);
    onSelect(processed);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 flex-shrink-0"
          title="Quick Replies"
        >
          <Zap className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="top">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search responses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No responses found
            </div>
          ) : (
            <div className="p-2">
              {categories.map((category) => {
                const categoryResponses = groupedResponses[category];
                if (!categoryResponses || categoryResponses.length === 0) return null;

                return (
                  <div key={category} className="mb-3">
                    <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                      {category}
                    </p>
                    {categoryResponses.map((response) => (
                      <button
                        key={response.id}
                        onClick={() => handleSelect(response)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors",
                          "flex items-start justify-between gap-2"
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {response.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {response.content.slice(0, 60)}...
                          </p>
                        </div>
                        {response.shortcut && (
                          <span className="text-xs bg-secondary px-1.5 py-0.5 rounded font-mono">
                            {response.shortcut}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CannedResponsePicker;
