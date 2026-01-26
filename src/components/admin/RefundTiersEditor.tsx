import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface RefundTier {
  timeframe: string;
  refund: string;
  description: string;
  color: string;
}

interface RefundTiersEditorProps {
  tiers: RefundTier[];
  onChange: (tiers: RefundTier[]) => void;
}

const colorOptions = [
  { value: "bg-green-500", label: "Green" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-purple-500", label: "Purple" },
];

const RefundTiersEditor = ({ tiers, onChange }: RefundTiersEditorProps) => {
  const updateTier = (index: number, field: keyof RefundTier, value: string) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addTier = () => {
    onChange([
      ...tiers,
      { timeframe: "New timeframe", refund: "0%", description: "Description", color: "bg-gray-500" },
    ]);
  };

  const removeTier = (index: number) => {
    onChange(tiers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Refund Schedule</Label>
      
      {tiers.map((tier, index) => (
        <Card key={index} className="border border-border">
          <CardContent className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-sm">Timeframe</Label>
                <Input
                  value={tier.timeframe}
                  onChange={(e) => updateTier(index, "timeframe", e.target.value)}
                  placeholder="e.g., 48+ hours before"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Refund %</Label>
                <Input
                  value={tier.refund}
                  onChange={(e) => updateTier(index, "refund", e.target.value)}
                  placeholder="e.g., 100%"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Description</Label>
                <Input
                  value={tier.description}
                  onChange={(e) => updateTier(index, "description", e.target.value)}
                  placeholder="e.g., Full refund"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Color</Label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    value={tier.color}
                    onChange={(e) => updateTier(index, "color", e.target.value)}
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addTier} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Refund Tier
      </Button>
    </div>
  );
};

export default RefundTiersEditor;
