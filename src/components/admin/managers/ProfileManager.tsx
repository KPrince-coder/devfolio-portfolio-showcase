import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tab } from "@/types/dashboard";
import { cn } from "@/lib/utils";

// Import all profile-related components
import { ProfileForm } from "../forms/ProfileForm";
import { HobbiesManager } from "./HobbiesManager";
import { EducationManager } from "./EducationManager";
import { SocialLinksManager } from "./SocialLinksManager";

interface ProfileManagerProps {
  activeSubTab: string;
  subTabs: Tab[];
  onSubTabChange: (subTab: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  activeSubTab,
  subTabs,
  onSubTabChange,
}) => {
  // Content map for each subtab
  const contentMap: { [key: string]: React.ReactNode } = {
    "profile-main": <ProfileForm />,
    hobbies: <HobbiesManager />,
    education: <EducationManager />,
    "social-links": <SocialLinksManager />,
  };

  // Animation variants for tab content
  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <Card className="p-6 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            Profile Management
          </motion.h2>
        </div>

        <Tabs
          value={activeSubTab}
          onValueChange={onSubTabChange}
          className="space-y-6"
        >
          <div className="relative">
            <TabsList className="inline-flex h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-lg">
              <div className="grid grid-cols-2 gap-1 p-1 md:grid-cols-4">
                {subTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={cn(
                      "relative h-9 rounded-md px-3",
                      "data-[state=active]:bg-background",
                      "data-[state=active]:text-foreground",
                      "data-[state=active]:shadow-sm",
                      "transition-all duration-200"
                    )}
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <tab.icon className={cn("h-4 w-4", tab.color)} />
                      <span className="hidden md:inline-block">
                        {tab.label}
                      </span>
                    </motion.div>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </div>

          <AnimatePresence mode="sync">
            <motion.div
              key={activeSubTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
              transition={{ duration: 0.3 }}
            >
              {contentMap[activeSubTab]}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </Card>
  );
};
