import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NotificationPermissionBannerProps {
  permission: NotificationPermission;
  isSupported: boolean;
  onRequestPermission: () => void;
}

const NotificationPermissionBanner = ({
  permission,
  isSupported,
  onRequestPermission,
}: NotificationPermissionBannerProps) => {
  if (!isSupported) {
    return (
      <Alert variant="destructive" className="mb-4">
        <BellOff className="w-4 h-4" />
        <AlertDescription>
          Browser notifications are not supported. You'll only receive email alerts.
        </AlertDescription>
      </Alert>
    );
  }

  if (permission === "granted") {
    return null;
  }

  if (permission === "denied") {
    return (
      <Alert variant="destructive" className="mb-4">
        <BellOff className="w-4 h-4" />
        <AlertDescription>
          Notifications are blocked. Enable them in your browser settings to receive alerts.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-secondary bg-secondary/10">
      <Bell className="w-4 h-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Enable browser notifications to get instant alerts for new chat requests.</span>
        <Button size="sm" variant="secondary" onClick={onRequestPermission}>
          Enable Notifications
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default NotificationPermissionBanner;
