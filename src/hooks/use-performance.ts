import { useEffect, useRef } from "react";

export const usePerformanceMonitor = (threshold = 30) => {
  const frameRates = useRef<number[]>([]);
  const lastFrameTime = useRef(performance.now());

  useEffect(() => {
    const checkPerformance = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime.current;
      const fps = 1000 / deltaTime;

      frameRates.current.push(fps);
      if (frameRates.current.length > 60) frameRates.current.shift();

      const avgFPS =
        frameRates.current.reduce((a, b) => a + b) / frameRates.current.length;

      if (avgFPS < threshold) {
        console.warn("Performance warning: Low FPS detected");
        // Implement your performance optimization strategy here
      }

      lastFrameTime.current = currentTime;
      requestAnimationFrame(checkPerformance);
    };

    requestAnimationFrame(checkPerformance);
  }, [threshold]);
};
