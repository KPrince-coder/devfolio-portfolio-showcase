import React from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContactForm } from "./contact/ContactForm";
import { ContactInfo } from "./contact/ContactInfo";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { Send, Mail, MapPin, Phone } from "lucide-react";

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
        title: "Message Sent Successfully! ",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Oops! Something went wrong ",
        description: "Please try again or contact me through social media.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-blue/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-32 bg-gradient-to-r from-transparent via-primary-teal/5 to-transparent transform -rotate-45" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">
              Let's Connect
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary-teal to-secondary-blue mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground">
            Have a project in mind? Let's discuss how we can work together to
            bring your ideas to life.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal/10 to-secondary-blue/10 rounded-2xl blur-xl" />
            <ContactInfo socialLinks={socialLinks || []} />
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-blue/10 to-primary-teal/10 rounded-2xl blur-xl" />
            <ContactForm onSubmit={handleSubmit} />
          </motion.div>
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </div>
    </section>
  );
};

export default Contact;
