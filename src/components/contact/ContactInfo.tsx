import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, Globe, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactInfoProps {
  socialLinks: {
    id: string;
    platform: string;
    url: string;
    icon_key: string;
  }[];
}

const contactItems = [
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
    color: "from-rose-500 to-pink-500",
  },
  {
    icon: Globe,
    label: "Website",
    value: "www.example.com",
    color: "from-teal-500 to-emerald-500",
  },
];

export const ContactInfo: React.FC<ContactInfoProps> = ({ socialLinks }) => {
  const renderSocialIcon = (iconKey: string) => {
    const IconComponent = (Icons as any)[
      iconKey.charAt(0).toUpperCase() + iconKey.slice(1)
    ];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-xl bg-card p-6 shadow-lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-teal to-secondary-blue bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="mt-2 text-muted-foreground">
            I'm always interested in hearing about new projects and
            opportunities.
          </p>
        </motion.div>

        {/* Contact Items */}
        <motion.div className="space-y-4">
          {contactItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <div className="flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-accent">
                <div
                  className={cn(
                    "shrink-0 p-2 rounded-lg bg-gradient-to-r",
                    item.color
                  )}
                >
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="font-medium group-hover:text-primary-teal transition-colors">
                    {item.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-lg font-semibold mb-4"
          >
            Connect with me
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <TooltipProvider>
              {socialLinks?.map((link, index) => (
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center gap-2 rounded-full bg-accent p-3 text-muted-foreground transition-all hover:bg-accent/80 hover:text-foreground"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.9 + index * 0.1,
                        type: "spring",
                        stiffness: 300,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">
                        {renderSocialIcon(link.icon_key)}
                      </span>
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        whileHover={{
                          width: "auto",
                          opacity: 1,
                          transition: { duration: 0.2 },
                        }}
                        className="absolute left-10 overflow-hidden whitespace-nowrap text-sm font-medium"
                      >
                        {link.platform}
                        <ExternalLink className="ml-1 inline h-3 w-3" />
                      </motion.span>
                    </motion.a>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={5}
                    className="bg-card"
                  >
                    <p>Connect on {link.platform}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-6 rounded-lg bg-accent/50 p-4 text-sm text-muted-foreground"
        >
          <p>
            Available for freelance opportunities and exciting projects. Let's
            create something amazing together! 🚀
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
