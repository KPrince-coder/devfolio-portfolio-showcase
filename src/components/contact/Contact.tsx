import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { useSocialLinks } from "@/hooks/useSocialLinks";

export const Contact = () => {
  const { toast } = useToast();
  const { data: socialLinks } = useSocialLinks();

  return (
    <div className="relative min-h-screen w-full py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <h1 className="mb-12 text-center text-4xl font-bold text-white">Get In Touch</h1>
        
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 lg:flex-row lg:items-start">
          {/* Contact Information */}
          <ContactInfo socialLinks={socialLinks} />

          {/* Contact Form */}
          <ContactForm toast={toast} />
        </div>
      </motion.div>
    </div>
  );
};