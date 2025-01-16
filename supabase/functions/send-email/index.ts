import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { render } from "@react-email/render";
import AdminNotification from "../../../src/emails/AdminNotification.tsx";
import UserConfirmation from "../../../src/emails/UserConfirmation.tsx";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "admin_notification" | "user_confirmation";
  submission: {
    full_name: string;
    email: string;
    subject: string;
    message: string;
  };
  dashboardUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    let html: string;
    let to: string[];
    let subject: string;

    if (emailRequest.type === "admin_notification") {
      html = render(
        AdminNotification({
          submission: emailRequest.submission,
          dashboardUrl: emailRequest.dashboardUrl || "https://your-dashboard-url.com",
        })
      );
      to = [ADMIN_EMAIL];
      subject = `New Contact Form Submission: ${emailRequest.submission.subject}`;
    } else {
      html = render(
        UserConfirmation({
          name: emailRequest.submission.full_name,
        })
      );
      to = [emailRequest.submission.email];
      subject = "Thank you for contacting us";
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Your Website <onboarding@resend.dev>",
        to,
        subject,
        html,
        reply_to: emailRequest.type === "admin_notification" ? emailRequest.submission.email : undefined,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);