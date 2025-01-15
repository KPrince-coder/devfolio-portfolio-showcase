import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import * as Icons from "lucide-react";

interface ContactInfoProps {
  socialLinks: { id: string; platform: string; url: string; icon_key: string }[];
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ socialLinks }) => {
  const renderSocialIcon = (iconKey: string) => {
    const IconComponent = (Icons as any)[iconKey.charAt(0).toUpperCase() + iconKey.slice(1)];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
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
  );
};