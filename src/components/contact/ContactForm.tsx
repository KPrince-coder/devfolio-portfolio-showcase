import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { submitContactForm } from "@/services/contact-service";

interface ContactFormProps {
  toast: any;
}

export const ContactForm: React.FC<ContactFormProps> = ({ toast }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    full_name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod validation schema
  const contactFormSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters")
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = contactFormSchema.parse(formData);

      // Submit form
      const result = await submitContactForm(validatedData);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: "Thanks for reaching out. We'll get back to you soon.",
          variant: "default"
        });

        // Reset form
        setFormData({
          full_name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: any = {};
        error.errors.forEach(err => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputWithError = (
    name: keyof typeof formData, 
    icon: React.ElementType, 
    type: string = "text",
    placeholder: string
  ) => (
    <div className="relative">
      <icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Input
        type={type}
        placeholder={placeholder}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className={`pl-10 ${errors[name] ? 'border-red-500' : ''}`}
        required
      />
      {errors[name] && (
        <div className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" />
          {errors[name]}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderInputWithError("full_name", User, "text", "Full Name")}
      {renderInputWithError("email", Mail, "email", "Email Address")}
      {renderInputWithError("subject", MessageSquare, "text", "Email Subject")}
      
      <div>
        <Textarea
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`min-h-[150px] resize-none ${errors.message ? 'border-red-500' : ''}`}
          required
        />
        {errors.message && (
          <div className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="mr-2 h-4 w-4" />
            {errors.message}
          </div>
        )}
      </div>
      
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
          >
            <Send className="mr-2 h-4 w-4" /> 
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </motion.div>
      </form>
    );
  };