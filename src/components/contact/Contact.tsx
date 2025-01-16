import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            full_name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            status: 'new',
            is_read: false
          }
        ]);

      if (error) throw error;

      // Send emails via edge function
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: "admin_notification",
          submission: {
            full_name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
          }
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Success",
        description: "Your message has been sent successfully!"
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo socialLinks={[]} />
        <ContactForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Contact;