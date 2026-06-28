"use client";

import { useEffect, useRef } from "react";

export default function VehicleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set internal resolution for crisp rendering
    canvas.width = 800;
    canvas.height = 300;

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      // Clear canvas for next frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05; // Speed of the animation

      const centerY = 200;
      const carX = canvas.width / 2 - 150;
      
      // 1. Draw the moving road/grid
      ctx.beginPath();
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"; // Tailwind blue-500 with opacity
      ctx.lineWidth = 2;
      const dashOffset = (time * 100) % 40;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -dashOffset;
      ctx.moveTo(0, centerY + 40);
      ctx.lineTo(canvas.width, centerY + 40);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 2. Draw the sleek blueprint car chassis
      ctx.beginPath();
      ctx.strokeStyle = "#64748b"; // Tailwind slate-500
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)"; // slate-900 background
      ctx.lineWidth = 3;
      ctx.moveTo(carX, centerY + 10); // Rear bumper
      ctx.lineTo(carX, centerY - 30); // Rear trunk
      ctx.lineTo(carX + 60, centerY - 30); // Rear windshield base
      ctx.lineTo(carX + 120, centerY - 70); // Roof rear
      ctx.lineTo(carX + 200, centerY - 70); // Roof front
      ctx.lineTo(carX + 260, centerY - 20); // Hood base
      ctx.lineTo(carX + 320, centerY - 10); // Front bumper top
      ctx.lineTo(carX + 320, centerY + 20); // Front bumper bottom
      ctx.lineTo(carX + 260, centerY + 20); // Front wheel well front
      // Front Wheel Arch
      ctx.arc(carX + 230, centerY + 20, 35, 0, Math.PI, true);
      ctx.lineTo(carX + 110, centerY + 20); // Side skirt
      // Rear Wheel Arch
      ctx.arc(carX + 70, centerY + 20, 35, 0, Math.PI, true);
      ctx.lineTo(carX, centerY + 20); // Under rear bumper
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw futuristic glowing lines on chassis
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6"; // neon blue
      ctx.lineWidth = 2;
      ctx.moveTo(carX + 120, centerY - 70);
      ctx.lineTo(carX + 200, centerY - 70);
      ctx.lineTo(carX + 260, centerY - 20);
      ctx.stroke();

      // 3. Helper function to draw spinning wheels
      const drawWheel = (x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y);
        
        // Add a slight vertical bounce to simulate suspension
        const bounce = Math.sin(time * 5) * 2;
        ctx.translate(0, bounce);
        
        // Rotate the wheel based on time
        ctx.rotate(time * 2);

        // Tire rubber
        ctx.beginPath();
        ctx.strokeStyle = "#cbd5e1"; // slate-300
        ctx.lineWidth = 6;
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.stroke();

        // Inner rim (Glowing)
        ctx.beginPath();
        ctx.strokeStyle = "#3b82f6"; // blue-500
        ctx.lineWidth = 2;
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Spokes
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -18);
          ctx.stroke();
          ctx.rotate((Math.PI * 2) / 5);
        }

        ctx.restore();
      };

      // Draw Rear Wheel
      drawWheel(carX + 70, centerY + 20);
      
      // Draw Front Wheel
      drawWheel(carX + 230, centerY + 20);

      // Request next frame
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto flex justify-center drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
      <canvas 
        ref={canvasRef} 
        className="w-full h-auto object-contain"
        style={{ imageRendering: "pixelated" }} // Keeps the lines sharp
      />
    </div>
  );
}