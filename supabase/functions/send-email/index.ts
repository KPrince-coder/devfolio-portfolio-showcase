import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { render } from "npm:@react-email/render";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Your Website <onboarding@resend.dev>",
        to: emailRequest.type === "admin_notification" ? 
          [Deno.env.get("ADMIN_EMAIL") || ""] : 
          [emailRequest.submission.email],
        subject: emailRequest.type === "admin_notification" ? 
          `New Contact Form Submission: ${emailRequest.submission.subject}` :
          "Thank you for contacting us",
        html: emailRequest.type === "admin_notification" ?
          `<h1>New Contact Form Submission</h1>
           <p><strong>Name:</strong> ${emailRequest.submission.full_name}</p>
           <p><strong>Email:</strong> ${emailRequest.submission.email}</p>
           <p><strong>Subject:</strong> ${emailRequest.submission.subject}</p>
           <p><strong>Message:</strong> ${emailRequest.submission.message}</p>` :
          `<h1>Thank you for contacting us</h1>
           <p>Dear ${emailRequest.submission.full_name},</p>
           <p>We have received your message and will get back to you soon.</p>`,
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