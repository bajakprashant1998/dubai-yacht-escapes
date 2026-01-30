import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InvitationRequest {
  email: string;
  roles: string[];
  inviterName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user has admin role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      throw new Error("Admin access required");
    }

    const { email, roles: invitedRoles, inviterName }: InvitationRequest = await req.json();

    // Validate required fields
    if (!email || !invitedRoles || invitedRoles.length === 0) {
      throw new Error("Email and at least one role are required");
    }

    // Create invitation in database
    const { data: invitation, error: insertError } = await supabase
      .from("user_invitations")
      .insert({
        email,
        roles: invitedRoles,
        invited_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create invitation: ${insertError.message}`);
    }

    // Build invitation URL
    const siteUrl = Deno.env.get("SITE_URL") || "https://betterview.lovable.app";
    const inviteUrl = `${siteUrl}/auth?invite=${invitation.token}`;

    // Send invitation email
    const emailResponse = await resend.emails.send({
      from: "BetterView Tourism <noreply@betterview.ae>",
      to: [email],
      subject: "You've been invited to join BetterView Tourism Admin",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a365d; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #d4a853; color: #1a365d; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .roles { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .role-badge { display: inline-block; background: #e8f4fd; color: #1a365d; padding: 5px 12px; border-radius: 20px; margin: 3px; font-size: 14px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌴 BetterView Tourism</h1>
              <p>Dubai's Premier Tour & Experience Provider</p>
            </div>
            <div class="content">
              <h2>You're Invited!</h2>
              <p>${inviterName ? `${inviterName} has` : "An administrator has"} invited you to join the BetterView Tourism admin team.</p>
              
              <div class="roles">
                <strong>Your assigned roles:</strong><br>
                ${invitedRoles.map((role: string) => `<span class="role-badge">${role}</span>`).join(" ")}
              </div>
              
              <p>Click the button below to accept your invitation and create your account:</p>
              
              <center>
                <a href="${inviteUrl}" class="button">Accept Invitation</a>
              </center>
              
              <p style="font-size: 14px; color: #666;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} BetterView Tourism. All rights reserved.</p>
              <p>Dubai, UAE</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitation: {
          id: invitation.id,
          email: invitation.email,
          expires_at: invitation.expires_at,
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: error.message === "Unauthorized" || error.message === "Admin access required" ? 403 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
