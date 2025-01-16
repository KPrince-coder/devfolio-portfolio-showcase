import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { useTheme } from "@/hooks/use-theme";

export const P5Background = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5>();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let particles: Particle[] = [];
      const particleCount = 50; // Reduced for performance

      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        size: number;
        color: number;

        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.size = p.random(3, 8);
          this.color = p.random(180, 255);
        }

        update() {
          let mouse = p.createVector(p.mouseX, p.mouseY);
          let dir = p5.Vector.sub(mouse, this.pos);
          dir.normalize();
          dir.mult(0.2);

          this.acc = dir;
          this.vel.add(this.acc);
          this.vel.limit(2);
          this.pos.add(this.vel);

          // Bounce off edges
          if (this.pos.x < 0 || this.pos.x > p.width) this.vel.x *= -1;
          if (this.pos.y < 0 || this.pos.y > p.height) this.vel.y *= -1;
        }

        draw() {
          p.noStroke();
          const alpha = p.map(this.vel.mag(), 0, 2, 50, 150);
          p.fill(this.color, alpha);
          p.circle(this.pos.x, this.pos.y, this.size);
        }

        connect(particles: Particle[]) {
          particles.forEach((other) => {
            const d = p5.Vector.dist(this.pos, other.pos);
            if (d < 100) {
              const alpha = p.map(d, 0, 100, 50, 0);
              p.stroke(this.color, alpha);
              p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
          });
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style("position", "fixed");
        canvas.style("top", "0");
        canvas.style("left", "0");
        canvas.style("z-index", "-1");

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle());
        }

        // Enable P5's built-in performance optimizations
        p.frameRate(30);
        p.pixelDensity(1);
      };

      p.draw = () => {
        p.clear();
        p.background(isDarkMode ? 0 : 255, 10);

        // Update and draw particles
        particles.forEach((particle) => {
          particle.update();
          particle.draw();
          particle.connect(particles);
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    // Create new P5 instance
    p5Instance.current = new p5(sketch, containerRef.current);

    // Cleanup
    return () => {
      p5Instance.current?.remove();
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
      role="presentation"
    />
  );
};

// Performance optimization with React.memo
export default React.memo(P5Background);
