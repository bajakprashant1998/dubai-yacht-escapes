import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
}

export function usePushNotifications(isOnline: boolean) {
  const [state, setState] = useState<PushNotificationState>({
    permission: "default",
    isSupported: false,
  });

  // Check browser support and current permission
  useEffect(() => {
    const isSupported = "Notification" in window;
    setState({
      permission: isSupported ? Notification.permission : "denied",
      isSupported,
    });
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState((prev) => ({ ...prev, permission }));
      localStorage.setItem("push_notification_requested", "true");
      return permission === "granted";
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      return false;
    }
  }, [state.isSupported]);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    try {
      // Use a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Failed to play notification sound:", error);
    }
  }, []);

  // Show browser notification
  const showNotification = useCallback(
    (title: string, body: string, conversationId: string) => {
      if (state.permission !== "granted") return;

      playNotificationSound();

      const notification = new Notification(title, {
        body,
        icon: "/logo.jpeg",
        tag: conversationId,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    },
    [state.permission, playNotificationSound]
  );

  // Subscribe to new waiting_agent conversations
  useEffect(() => {
    if (!isOnline || state.permission !== "granted") return;

    const channel = supabase
      .channel("push_notifications")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_conversations",
          filter: "status=eq.waiting_agent",
        },
        (payload) => {
          const conv = payload.new as {
            id: string;
            visitor_name?: string;
            status: string;
          };

          if (conv.status === "waiting_agent") {
            showNotification(
              "🔔 New Chat Request",
              `${conv.visitor_name || "A visitor"} is waiting for support`,
              conv.id
            );
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_conversations",
          filter: "status=eq.waiting_agent",
        },
        (payload) => {
          const conv = payload.new as {
            id: string;
            visitor_name?: string;
            status: string;
          };

          showNotification(
            "🔔 New Chat Request",
            `${conv.visitor_name || "A visitor"} is waiting for support`,
            conv.id
          );
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isOnline, state.permission, showNotification]);

  return {
    ...state,
    requestPermission,
    showNotification,
    hasRequested: localStorage.getItem("push_notification_requested") === "true",
  };
}
