import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from "lucide-react";

interface VerifyEmailProps {
  email?: string;
}

const VerifyEmail = ({ email }: VerifyEmailProps) => {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please go back to the sign up page and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      setResent(true);
      toast({
        title: "Email Sent",
        description: "Verification email has been resent. Please check your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-secondary" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Check Your Email
          </h1>

          <p className="text-muted-foreground mb-6">
            We've sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-foreground">{email}</span>
            ) : (
              "your email address"
            )}
            . Please click the link to verify your account.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-foreground mb-2">Didn't receive the email?</h3>
            <ul className="text-sm text-muted-foreground text-left space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>

          <div className="space-y-3">
            {resent ? (
              <div className="flex items-center justify-center gap-2 text-green-500 py-2">
                <CheckCircle className="w-5 h-5" />
                <span>Verification email resent!</span>
              </div>
            ) : (
              <Button
                onClick={handleResendEmail}
                disabled={isResending || !email}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            )}

            <Link to="/auth" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Need help?{" "}
          <Link to="/contact" className="text-secondary hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
