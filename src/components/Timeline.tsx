// import { motion } from "framer-motion";

// const experiences = [
//   {
//     year: "2023",
//     title: "Senior Developer",
//     company: "Tech Corp",
//     description: "Led development of multiple full-stack applications",
//     technologies: ["React", "Node.js", "AWS", "TypeScript"]
//   },
//   {
//     year: "2021",
//     title: "Full Stack Developer",
//     company: "Startup Inc",
//     description: "Built and maintained various web applications",
//     technologies: ["Vue.js", "Python", "Docker", "PostgreSQL"]
//   },
//   {
//     year: "2019",
//     title: "Frontend Developer",
//     company: "Web Agency",
//     description: "Developed responsive websites for clients",
//     technologies: ["React", "JavaScript", "CSS", "HTML"]
//   },
// ];

// export const Timeline = () => {
//   return (
//     <section className="py-20 relative">
//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
      
//       <h2 className="mb-12 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
//         Experience
//       </h2>
      
//       <div className="mx-auto max-w-2xl relative">
//         {/* Vertical line */}
//         <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary to-primary/50" />
        
//         {experiences.map((experience, index) => (
//           <motion.div
//             key={experience.year}
//             className="timeline-item"
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//             viewport={{ once: true }}
//           >
//             <motion.div 
//               className="timeline-dot"
//               initial={{ scale: 0 }}
//               whileInView={{ scale: 1 }}
//               transition={{ 
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 15,
//                 delay: index * 0.1 
//               }}
//             />
//             <div className="space-y-2 bg-accent/5 p-6 rounded-lg backdrop-blur-sm border border-accent/10 hover:border-accent/20 transition-colors">
//               <span className="text-sm text-primary font-medium">{experience.year}</span>
//               <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
//                 {experience.title} · {experience.company}
//               </h3>
//               <p className="text-muted-foreground">{experience.description}</p>
//               <div className="flex flex-wrap gap-2 pt-2">
//                 {experience.technologies.map((tech) => (
//                   <span
//                     key={tech}
//                     className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent-foreground"
//                   >
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// };










import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Code, 
  Rocket, 
  Palette, 
  MousePointer
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Type Definition for Experience
interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  achievements: string[];
  color: string;
  icon_key: string;
}

// Placeholder Icon Mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  rocket: Rocket,
  palette: Palette,
  default: Code
};

export const Timeline = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('year', { ascending: false });

        if (error) {
          throw error;
        }

        setExperiences(data || []);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((_, index) => (
        <div 
          key={index} 
          className="animate-pulse flex flex-col md:flex-row items-center"
        >
          <div className="w-full md:w-[calc(50%-40px)] bg-gray-700 h-48 rounded-2xl"></div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-950 text-red-300 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Error Loading Experiences</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Professional Journey
        </h2>

        <motion.div
          className="flex items-center justify-center mb-8 text-gray-400"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        >
          <MousePointer className="mr-2" />
          <span className="text-sm">Click on cards to explore details</span>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : experiences.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            No experiences added yet.
          </div>
        ) : (
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-800" />

            <div className="space-y-8 md:space-y-0">
              {experiences.map((exp, index) => {
                const ExperienceIcon = iconMap[exp.icon_key] || iconMap.default;

                return (
                  <motion.div
                    key={exp.id}
                    className={`
                      relative flex flex-col md:flex-row items-center w-full
                      md:even:flex-row-reverse
                    `}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div 
                      className={`
                        hidden md:block absolute left-1/2 transform -translate-x-1/2 
                        w-6 h-6 rounded-full z-10
                        ${exp.color} border-4 border-gray-900
                      `}
                      style={{
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />

                    <motion.div
                      className={`
                        w-full md:w-[calc(50%-40px)] p-6 rounded-2xl 
                        bg-gray-800 shadow-lg cursor-pointer
                        transition-all duration-300 hover:scale-[1.02]
                        ${activeExperience?.id === exp.id 
                          ? 'border-2 border-white/20' 
                          : 'border-2 border-transparent'}
                      `}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveExperience(activeExperience?.id === exp.id ? null : exp)}
                    >
                      <div className="flex items-center mb-4">
                        <ExperienceIcon className={`w-8 h-8 mr-4 ${exp.color}`} />
                        <div>
                          <h3 className="text-xl font-bold">{exp.title}</h3>
                          <p className="text-sm text-gray-400">{exp.year}</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{exp.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className={`
                              px-2 py-1 rounded-full text-xs
                              ${exp.color} bg-opacity-20
                            `}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {activeExperience?.id === exp.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="text-lg font-semibold mt-4 mb-2">
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, idx) => (
                              <li 
                                key={idx} 
                                className="flex items-center space-x-2 text-gray-300"
                              >
                                <span className={`w-2 h-2 rounded-full ${exp.color}`}></span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        </div>
 </div>
  );
};







