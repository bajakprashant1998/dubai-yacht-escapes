import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export interface LegalSection {
  icon: string;
  title: string;
  content: string[];
}

interface LegalSectionEditorProps {
  sections: LegalSection[];
  onChange: (sections: LegalSection[]) => void;
  iconOptions?: string[];
}

const defaultIconOptions = [
  "FileText",
  "Eye",
  "Lock",
  "Users",
  "Globe",
  "Shield",
  "Scale",
  "FileCheck",
  "AlertTriangle",
  "CreditCard",
  "Clock",
  "Anchor",
  "Calendar",
  "RefreshCw",
  "CloudRain",
  "AlertCircle",
  "CheckCircle",
  "XCircle",
];

const LegalSectionEditor = ({
  sections,
  onChange,
  iconOptions = defaultIconOptions,
}: LegalSectionEditorProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const updateSection = (index: number, field: keyof LegalSection, value: string | string[]) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addSection = () => {
    onChange([
      ...sections,
      { icon: "FileText", title: "New Section", content: ["Add content here"] },
    ]);
    setExpandedIndex(sections.length);
  };

  const removeSection = (index: number) => {
    const updated = sections.filter((_, i) => i !== index);
    onChange(updated);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const addContentItem = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].content = [...updated[sectionIndex].content, ""];
    onChange(updated);
  };

  const updateContentItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].content[itemIndex] = value;
    onChange(updated);
  };

  const removeContentItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].content = updated[sectionIndex].content.filter(
      (_, i) => i !== itemIndex
    );
    onChange(updated);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }
    const updated = [...sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
    setExpandedIndex(newIndex);
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <Card key={index} className="border border-border">
          <CardContent className="p-4">
            {/* Section Header */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-foreground">{section.title}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({section.content.length} items)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(index, "up");
                  }}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(index, "down");
                  }}
                  disabled={index === sections.length - 1}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(index);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedIndex === index && (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                      placeholder="Section title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                      value={section.icon}
                      onChange={(e) => updateSection(index, "icon", e.target.value)}
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Content Items</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addContentItem(index)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2">
                        <Textarea
                          value={item}
                          onChange={(e) =>
                            updateContentItem(index, itemIndex, e.target.value)
                          }
                          placeholder="Content item"
                          className="min-h-[60px]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContentItem(index, itemIndex)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addSection} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
};

export default LegalSectionEditor;
