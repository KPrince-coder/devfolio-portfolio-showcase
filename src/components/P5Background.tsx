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
      let nodes: Node[] = [];
      let dataPackets: DataPacket[] = [];
      const nodeCount = 15;
      const maxConnections = 50;
      let connections: Connection[] = [];
      let time = 0;
      let mousePos: p5.Vector;
      let isMousePressed = false;

      class Node {
        pos: p5.Vector;
        originalPos: p5.Vector;
        vel: p5.Vector;
        size: number;
        connections: number;
        pulsePhase: number;
        type: 'router' | 'endpoint' | 'server';
        
        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.originalPos = this.pos.copy();
          this.vel = p.createVector(0, 0);
          this.size = p.random(4, 12);
          this.connections = 0;
          this.pulsePhase = p.random(p.TWO_PI);
          this.type = p.random(['router', 'endpoint', 'server']) as 'router' | 'endpoint' | 'server';
        }

        update() {
          if (mousePos) {
            const mouseVec = p5.Vector.sub(mousePos, this.pos);
            const distance = mouseVec.mag();
            const magneticRadius = 150;
            
            if (distance < magneticRadius) {
              // Magnetic effect
              mouseVec.normalize();
              const force = p.map(distance, 0, magneticRadius, 8, 0);
              const repulsion = isMousePressed ? -1.5 : -1; // Stronger repulsion when clicking
              mouseVec.mult(force * repulsion);
              this.vel.add(mouseVec);
              
              // Add some turbulence when mouse is pressed
              if (isMousePressed) {
                const turbulence = p.createVector(
                  p.random(-1, 1),
                  p.random(-1, 1)
                ).mult(0.5);
                this.vel.add(turbulence);
              }
            }
            
            // Return to original position
            const homeForce = p5.Vector.sub(this.originalPos, this.pos);
            homeForce.mult(0.05);
            this.vel.add(homeForce);
          }
          
          // Apply velocity with damping
          this.vel.mult(0.95);
          this.pos.add(this.vel);
        }

        draw() {
          const pulse = p.sin(time * 2 + this.pulsePhase) * 0.5 + 0.5;
          const baseColor = isDarkMode ? 220 : 20;
          p.noStroke();
          
          // Draw magnetic field effect when near mouse
          if (mousePos) {
            const distance = p5.Vector.dist(this.pos, mousePos);
            const magneticRadius = 150;
            if (distance < magneticRadius) {
              const fieldIntensity = p.map(distance, 0, magneticRadius, 0.2, 0);
              p.push();
              p.translate(this.pos.x, this.pos.y);
              p.noFill();
              p.stroke(isDarkMode ? 255 : 0, 40 * fieldIntensity);
              p.strokeWeight(0.8);
              for (let i = 0; i < 3; i++) {
                const size = this.size * (2 + i * 2) * (1 + pulse * 0.3);
                p.circle(0, 0, size);
              }
              p.pop();
            }
          }
          
          // Draw glow
          const glowSize = this.size * (1.5 + pulse * 0.5);
          const glowAlpha = 40 + pulse * 20;
          p.fill(baseColor, glowAlpha);
          p.circle(this.pos.x, this.pos.y, glowSize * 2);
          
          // Draw node with type-specific styles
          if (this.type === 'router') {
            p.fill(isDarkMode ? '#2DD4BF' : '#0F766E');
            p.circle(this.pos.x, this.pos.y, this.size);
          } else if (this.type === 'server') {
            p.fill(isDarkMode ? '#FF6B6B' : '#BE123C');
            p.rect(this.pos.x - this.size/2, this.pos.y - this.size/2, this.size, this.size);
          } else {
            p.fill(isDarkMode ? '#3B82F6' : '#1D4ED8');
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(p.PI/4);
            p.rect(-this.size/2, -this.size/2, this.size, this.size);
            p.pop();
          }
        }
      }

      class Connection {
        start: Node;
        end: Node;
        active: boolean;
        
        constructor(start: Node, end: Node) {
          this.start = start;
          this.end = end;
          this.active = false;
        }

        draw() {
          const d = p5.Vector.dist(this.start.pos, this.end.pos);
          const alpha = p.map(d, 0, 200, 100, 20);
          
          if (this.active) {
            // Draw active connection with animated dash pattern
            p.push();
            p.stroke(isDarkMode ? '#2DD4BF' : '#0F766E', alpha);
            p.strokeWeight(1.5);
            this.drawDashedLine(
              this.start.pos.x, this.start.pos.y,
              this.end.pos.x, this.end.pos.y,
              time * 50
            );
            p.pop();
          } else {
            // Draw inactive connection with dynamic thickness
            const thickness = mousePos ? 
              p.map(p5.Vector.dist(mousePos, this.start.pos), 0, 150, 1.5, 0.5, true) : 0.5;
            p.stroke(isDarkMode ? 150 : 100, alpha * 0.5);
            p.strokeWeight(thickness);
            p.line(this.start.pos.x, this.start.pos.y, this.end.pos.x, this.end.pos.y);
          }
        }

        drawDashedLine(x1: number, y1: number, x2: number, y2: number, offset: number) {
          const dashLength = 10;
          const gapLength = 5;
          const dx = x2 - x1;
          const dy = y2 - y1;
          const distance = p.sqrt(dx * dx + dy * dy);
          const dashCount = Math.floor(distance / (dashLength + gapLength));
          const dashX = dx / dashCount;
          const dashY = dy / dashCount;

          offset = offset % (dashLength + gapLength);

          for (let i = 0; i < dashCount; i++) {
            const startX = x1 + i * dashX + (offset * dashX) / (dashLength + gapLength);
            const startY = y1 + i * dashY + (offset * dashY) / (dashLength + gapLength);
            const endX = startX + dashX * dashLength / (dashLength + gapLength);
            const endY = startY + dashY * dashLength / (dashLength + gapLength);
            p.line(startX, startY, endX, endY);
          }
        }
      }

      class DataPacket {
        pos: p5.Vector;
        target: p5.Vector;
        speed: number;
        color: string;
        size: number;
        life: number;
        
        constructor(start: p5.Vector, end: p5.Vector) {
          this.pos = start.copy();
          this.target = end.copy();
          this.speed = p.random(2, 4);
          this.color = p.random([
            isDarkMode ? '#2DD4BF' : '#0F766E',
            isDarkMode ? '#FF6B6B' : '#BE123C',
            isDarkMode ? '#3B82F6' : '#1D4ED8'
          ]);
          this.size = p.random(3, 6);
          this.life = 255;
        }

        update() {
          const dir = p5.Vector.sub(this.target, this.pos);
          const d = dir.mag();
          dir.normalize();
          dir.mult(this.speed);
          this.pos.add(dir);

          if (d < 2) {
            this.life = 0;
          }
        }

        draw() {
          p.noStroke();
          p.fill(this.color);
          p.circle(this.pos.x, this.pos.y, this.size);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style("position", "fixed");
        canvas.style("top", "0");
        canvas.style("left", "0");
        canvas.style("z-index", "-1");
        canvas.style("opacity", "0.6"); // Add reduced opacity
        mousePos = p.createVector(p.width/2, p.height/2);

        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
          nodes.push(new Node());
        }

        // Create connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            if (connections.length >= maxConnections) break;
            
            const d = p5.Vector.dist(nodes[i].pos, nodes[j].pos);
            if (d < 200 && nodes[i].connections < 4 && nodes[j].connections < 4) {
              connections.push(new Connection(nodes[i], nodes[j]));
              nodes[i].connections++;
              nodes[j].connections++;
            }
          }
        }
      };

      p.draw = () => {
        p.clear();
        time += 0.01;
        mousePos.set(p.mouseX, p.mouseY);
        isMousePressed = p.mouseIsPressed;

        // Update and draw connections
        connections.forEach(connection => {
          connection.draw();
        });

        // Update and draw nodes
        nodes.forEach(node => {
          node.update();
          node.draw();
        });

        // Create new data packets
        if (p.frameCount % 60 === 0 && dataPackets.length < 10) {
          const start = p.random(nodes);
          const connected = connections.filter(c => 
            c.start === start || c.end === start
          ).map(c => 
            c.start === start ? c.end : c.start
          );
          
          if (connected.length > 0) {
            const end = p.random(connected);
            dataPackets.push(new DataPacket(start.pos, end.pos));
          }
        }

        // Update and draw data packets
        dataPackets = dataPackets.filter(packet => {
          packet.update();
          packet.draw();
          return packet.life > 0;
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    p5Instance.current = new p5(sketch, containerRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [isDarkMode]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

// Performance optimization with React.memo
export default React.memo(P5Background);
