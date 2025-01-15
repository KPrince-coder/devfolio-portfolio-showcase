import React from 'react';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { useToast } from '@/components/ui/use-toast';

export const Contact = () => {
  const { toast } = useToast();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo />
        <ContactForm onSubmit={(data) => {
          toast({
            title: "Message sent",
            description: "Thank you for your message. We'll get back to you soon!"
          });
        }} />
      </div>
    </div>
  );
};

export default Contact;