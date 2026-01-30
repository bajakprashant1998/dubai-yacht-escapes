import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisaService } from "@/hooks/useVisaServices";
import { useContactConfig } from "@/hooks/useContactConfig";

interface VisaApplicationFormProps {
  visa: VisaService;
}

const VisaApplicationForm = ({ visa }: VisaApplicationFormProps) => {
  const { whatsapp } = useContactConfig();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    travelDate: "",
    notes: "",
  });

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I would like to apply for:\n\n` +
      `📄 *${visa.title}*\n` +
      `🏷️ Type: ${visa.visa_type}\n` +
      `📅 Duration: ${visa.duration_days} Days\n` +
      `⏱️ Processing: ${visa.processing_time}\n` +
      `💰 Price: AED ${visa.price}\n\n` +
      `👤 Name: ${formData.name || "Not provided"}\n` +
      `🌍 Nationality: ${formData.nationality || "Not provided"}\n` +
      `✈️ Travel Date: ${formData.travelDate || "Not provided"}\n` +
      `📞 Phone: ${formData.phone || "Not provided"}\n` +
      `📧 Email: ${formData.email || "Not provided"}\n` +
      (formData.notes ? `\n📝 Notes: ${formData.notes}` : "")
    );
    
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Apply Now</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name (as per passport)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Smith"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            placeholder="e.g., British, American"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+971..."
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="travelDate">Expected Travel Date</Label>
          <Input
            id="travelDate"
            type="date"
            value={formData.travelDate}
            onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special requirements or questions..."
            rows={3}
          />
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{visa.title}</span>
            <span>AED {visa.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Processing</span>
            <span>{visa.processing_time}</span>
          </div>
        </div>
        
        <Button
          className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Apply via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default VisaApplicationForm;