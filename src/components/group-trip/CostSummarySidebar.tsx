import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DollarSign, Share2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CostSummarySidebarProps {
  items: Array<{ id: string; title: string; price_per_person: number; quantity: number }>;
  totalCost: number;
  perPersonCost: number;
  membersCount: number;
  paidMembers: number;
  onShare: () => void;
}

const CostSummarySidebar = ({ items, totalCost, perPersonCost, membersCount, paidMembers, onShare }: CostSummarySidebarProps) => {
  const progressPercent = membersCount > 0 ? (paidMembers / membersCount) * 100 : 0;

  return (
    <Card className="sticky top-24 card-elevated rounded-xl bg-card border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 font-display">
          <DollarSign className="w-5 h-5 text-secondary" /> Cost Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length > 0 && (
          <div className="space-y-2.5">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate mr-2">{item.title}</span>
                <span className="font-medium text-foreground shrink-0">
                  AED {(Number(item.price_per_person) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <Separator />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Cost</span>
            <span className="font-bold text-foreground">AED {totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Members</span>
            <span className="font-medium text-foreground">{membersCount}</span>
          </div>
        </div>

        <Separator />

        <div className="bg-navy-gradient rounded-xl p-5 text-center">
          <p className="text-xs text-primary-foreground/60 mb-1">Each person pays</p>
          <p className="text-3xl font-display font-bold text-secondary">
            AED {Math.round(perPersonCost).toLocaleString()}
          </p>
          <p className="text-xs text-primary-foreground/50 mt-1">per person</p>
        </div>

        {membersCount > 0 && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Payment progress</span>
              <span>{paidMembers}/{membersCount} paid</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <Button onClick={onShare} className="w-full gap-2 rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground" size="lg">
            <Share2 className="w-4 h-4" /> Invite More Friends
          </Button>
          <Button asChild variant="outline" className="w-full gap-2 rounded-xl">
            <Link to="/tours"><Plus className="w-4 h-4" /> Add More Activities</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummarySidebar;
