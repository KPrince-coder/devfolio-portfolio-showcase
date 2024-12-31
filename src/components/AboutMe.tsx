import { motion } from "framer-motion";
import { Card } from "./ui/card";

export const AboutMe = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4"
      >
        <h2 className="text-4xl font-bold text-center mb-12">
          About <span className="text-primary">Me</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
              <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
              <p className="text-muted-foreground leading-relaxed">
                I'm a passionate Data Engineer & Full Stack Developer with a love for creating
                elegant solutions to complex problems. My journey in tech has been driven by
                curiosity and a desire to build impactful applications.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
              <h3 className="text-2xl font-semibold mb-4">My Approach</h3>
              <p className="text-muted-foreground leading-relaxed">
                I believe in writing clean, maintainable code and creating intuitive user
                experiences. My expertise in Android Development with Jetpack Compose allows
                me to build modern, responsive applications.
              </p>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
                <h3 className="text-2xl font-semibold mb-4">My Goals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm constantly learning and exploring new technologies to stay at the
                  forefront of development. My goal is to create applications that make a
                  positive impact on users' lives.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Card className="inline-block p-6 backdrop-blur-sm bg-accent/10 border-primary/20">
            <p className="text-lg text-primary font-medium">
              "The only way to do great work is to love what you do."
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};