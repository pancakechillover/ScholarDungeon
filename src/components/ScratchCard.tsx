import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScratchCardProps {
  onComplete?: () => void;
  children: React.ReactNode;
  overlayColor?: string;
  scratchRadius?: number;
  threshold?: number;
  className?: string;
  containerClassName?: string;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  onComplete,
  children,
  overlayColor = '#1e293b', // slate-800
  scratchRadius = 30, // Default slightly larger
  threshold = 50, // Auto-reveal at 50% as requested
  className,
  containerClassName
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showHelper, setShowHelper] = useState(true);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set internal size to match displayed size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400; // Fallback
    canvas.height = rect.height || 260;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set brush style as requested (Square and Hard)
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'square';

    // Drawing the overlay
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add artistic "scratch-off" pattern (metallic texture)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#334155'); // slate-700
    gradient.addColorStop(0.2, '#94a3b8'); // slate-400 (shimmer)
    gradient.addColorStop(0.5, '#475569'); // slate-600
    gradient.addColorStop(0.8, '#94a3b8'); // slate-400 (shimmer)
    gradient.addColorStop(1, '#334155');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Artistic cross-hatch texture for a "brushed metal" feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = -canvas.height; i < canvas.width; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + canvas.height, canvas.height);
      ctx.stroke();
    }

    // Tiny gold/silver flecks
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }

    // "ICHIBAN" watermark text - multiple times across the card
    ctx.save();
    ctx.font = '900 24px Inter';
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.textAlign = 'center';
    for (let x = 0; x < canvas.width + 100; x += 150) {
      for (let y = 0; y < canvas.height + 100; y += 100) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText('ICHIBAN', 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();

    // Border highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, [overlayColor]);

  const checkCompletion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparentPixels++;
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage > threshold && !complete) {
      setComplete(true);
      onComplete?.();
    }
  }, [complete, threshold, onComplete]);

  const handleScratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    
    // Hard Circular Brush as requested
    // "smaller" and "80-100% transparency" on first scratch
    ctx.beginPath();
    ctx.arc(x, y, scratchRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();

    if (showHelper) setShowHelper(false);
    checkCompletion();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    handleScratch(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isScratching) handleScratch(e.clientX, e.clientY);
  };

  const onMouseUp = () => setIsScratching(false);

  const onTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    const touch = e.touches[0];
    handleScratch(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isScratching) {
      const touch = e.touches[0];
      handleScratch(touch.clientX, touch.clientY);
    }
  };

  const onTouchEnd = () => setIsScratching(false);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden group select-none", containerClassName)}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchEnd={onTouchEnd}
    >
      {/* Underlying Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Canvas Overlay */}
      <motion.canvas
        ref={canvasRef}
        animate={{ opacity: complete ? 0 : 1, scale: complete ? 1.05 : 1 }}
        transition={{ duration: 0.5 }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        className={cn(
          "absolute inset-0 cursor-crosshair z-20 w-full h-full",
          complete && "pointer-events-none",
          className
        )}
      />

      {/* Scratch Helper */}
      <AnimatePresence>
        {showHelper && !complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-black/20"
          >
            <motion.div
              animate={{ 
                x: [-20, 20, -20],
                y: [-10, 10, -10]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-white drop-shadow-lg"
            >
              <MousePointer2 size={40} className="fill-white" />
            </motion.div>
            <p className="mt-4 text-white font-black uppercase tracking-widest text-sm drop-shadow-lg">Scratch here!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
