import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContactForm } from "./contact/ContactForm";
import { ContactInfo } from "./contact/ContactInfo";
import { useSocialLinks } from "@/hooks/useSocialLinks";

export const Contact = () => {
  const { toast } = useToast();
  const { data: socialLinks } = useSocialLinks();

  const handleSubmit = async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    try {
      console.log("Submitting contact form:", data);

      const { error } = await supabase.from("contact_submissions").insert([
        {
          full_name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: "new",
          is_read: false,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo socialLinks={socialLinks || []} />
        <ContactForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Contact;
