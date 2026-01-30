import { ReactNode } from "react";

interface RequireSessionProps {
  children: ReactNode;
}

/**
 * Development mode: Authentication bypassed.
 * Set BYPASS_AUTH to false for production.
 */
const BYPASS_AUTH = import.meta.env.DEV;

export default function RequireSession({ children }: RequireSessionProps) {
  // Bypass authentication for development
  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  // Production auth logic would go here
  return <>{children}</>;
}
