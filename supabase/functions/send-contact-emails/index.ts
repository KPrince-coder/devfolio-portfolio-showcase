import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

serve(async (req) => {
  try {
    const { name, email, subject, message } = await req.json()

    // Send notification to admin
    await resend.emails.send({
      from: 'no-reply@yourdomain.com',
      to: ADMIN_EMAIL!,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    })

    // Send confirmation to user
    await resend.emails.send({
      from: 'no-reply@yourdomain.com',
      to: email,
      subject: 'We received your message',
      html: `
        <h1>Thank you for contacting us</h1>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>Your Team</p>
      `
    })

    return new Response(
      JSON.stringify({ message: 'Emails sent successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})