import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Mail, User, MessageSquare, Github, Linkedin, Send, MapPin } from "lucide-react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();
  const { data: socialLinks } = useSocialLinks();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const renderSocialIcon = (iconKey: string) => {
    const IconComponent = (Icons as any)[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full self-start rounded-lg bg-gray-900/50 p-6 lg:sticky lg:top-4 lg:w-auto lg:min-w-[320px]"
          >
            <div className="lg:max-w-sm">
              <h2 className="mb-4 text-2xl font-semibold text-white">Contact Information</h2>
              <p className="mb-6 text-gray-300">
                Feel free to reach out. I'm always open to discussing new projects, creative ideas, or
                opportunities to collaborate.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span>Location: Your City, Country</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>contact@example.com</span>
                </div>
              </div>

              {/* Social Icons with Tooltips */}
              <div className="mt-6 flex gap-4">
                <TooltipProvider>
                  {socialLinks?.map((link) => (
                    <Tooltip key={link.id} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={link.url}
                          target="_blank"
                          className="rounded-full bg-gray-800 p-3 text-blue-500 transition-colors hover:bg-gray-700"
                        >
                          {renderSocialIcon(link.icon_key)}
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p>Connect on {link.platform}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full rounded-lg bg-gray-900/50 p-6 lg:flex-1"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Email Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px] resize-none"
                  required
                />
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                >
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
