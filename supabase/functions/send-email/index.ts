import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

const resendClient = new Resend(Deno.env.get("RESEND_API_KEY"));
const SITE_NAME = Deno.env.get("SITE_NAME") || "Your Website";
const SITE_URL = Deno.env.get("SITE_URL") || "http://localhost:3000";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resendClient) {
      throw new Error("Resend client not initialized");
    }

    const { type, to, subject, replyMessage, originalMessage } =
      await req.json();

    if (!type || !to) {
      throw new Error("Missing required fields");
    }

    let emailResult;

    switch (type) {
      case "reply":
        emailResult = await resendClient.emails.send({
          from: `${SITE_NAME} <onboarding@resend.dev>`,
          to: [to],
          subject: subject || "Re: Your Message",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Response to Your Message</h2>
              <p style="margin: 16px 0; line-height: 1.5;">${replyMessage}</p>
              ${
                originalMessage
                  ? `
                <hr style="margin: 24px 0; border: 0; border-top: 1px solid #eee;">
                <div style="color: #666;">
                  <p><strong>Original Message:</strong></p>
                  <p>${originalMessage.message}</p>
                </div>
              `
                  : ""
              }
              <p style="margin-top: 24px;">Best regards,<br>${SITE_NAME} Team</p>
            </div>
          `,
        });
        break;

      default:
        throw new Error("Invalid email type");
    }

    return new Response(JSON.stringify({ success: true, data: emailResult }), {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error in send-email function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send email",
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
