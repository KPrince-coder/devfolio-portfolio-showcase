import { supabase } from '@/integrations/supabase/client';
import { sendAdminNotificationEmail } from '@/lib/email-service';

interface ContactFormData {
  full_name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    // Insert submission to database
    const { data, error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        full_name: formData.full_name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Send admin notification email
    await sendAdminNotificationEmail({
      submissionId: data.id,
      ...formData
    });

    return { success: true, data };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false, error };
  }
};