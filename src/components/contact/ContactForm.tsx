import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void>;
}

export const ContactForm = ({ onSubmit }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full bg-background border-border focus:border-primary-teal focus:ring-1 focus:ring-primary-teal/20 focus:outline-none pl-10 transition-all duration-200";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="relative z-10 space-y-6 backdrop-blur-sm bg-background/50 p-8 rounded-2xl"
    >
      <div className="space-y-4">
        <div className="relative">
          <div
            className={cn(
              "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
              focusedField === "name"
                ? "text-primary-teal"
                : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
          </div>
          <Input
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            required
            className={inputClasses}
          />
          <AnimatePresence>
            {focusedField === "name" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <div className="h-2 w-2 rounded-full bg-primary-teal" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div
            className={cn(
              "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
              focusedField === "email"
                ? "text-primary-teal"
                : "text-muted-foreground"
            )}
          >
            <Mail className="h-5 w-5" />
          </div>
          <Input
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            required
            className={inputClasses}
          />
          <AnimatePresence>
            {focusedField === "email" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <div className="h-2 w-2 rounded-full bg-primary-teal" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div
            className={cn(
              "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200",
              focusedField === "subject"
                ? "text-primary-teal"
                : "text-muted-foreground"
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </div>
          <Input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => setFocusedField("subject")}
            onBlur={() => setFocusedField(null)}
            required
            className={inputClasses}
          />
          <AnimatePresence>
            {focusedField === "subject" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <div className="h-2 w-2 rounded-full bg-primary-teal" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <Textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            required
            className={cn(inputClasses, "min-h-[150px] resize-y pt-2")}
          />
          <div
            className={cn(
              "absolute left-0 top-2 pl-3 flex items-center pointer-events-none transition-colors duration-200",
              focusedField === "message"
                ? "text-primary-teal"
                : "text-muted-foreground"
            )}
          >
            <MessageSquare className="h-5 w-5" />
          </div>
          <AnimatePresence>
            {focusedField === "message" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-2 top-3"
              >
                <div className="h-2 w-2 rounded-full bg-primary-teal" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={isSubmitting}
        className="bg-gradient-to-r from-primary-teal to-secondary-blue hover:from-secondary-blue hover:to-primary-teal transition-all duration-500 group focus:outline-none focus:ring-0"
      >
        <span className="relative z-10 flex items-center justify-center w-full gap-2">
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </span>
      </Button>
    </motion.form>
  );
};
