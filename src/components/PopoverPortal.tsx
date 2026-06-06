import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PopoverPortalProps {
  anchorElement: HTMLElement | null;
  children: React.ReactNode;
  offsetY?: number;
}

export const PopoverPortal: React.FC<PopoverPortalProps> = ({ anchorElement, children, offsetY = 8 }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!anchorElement) {
      setRect(null);
      return;
    }
    
    let frameId: number;
    const updateRect = () => {
      setRect(anchorElement.getBoundingClientRect());
      frameId = requestAnimationFrame(updateRect);
    };
    updateRect();
    return () => cancelAnimationFrame(frameId);
  }, [anchorElement]);

  if (!anchorElement || !rect) return null;

  return createPortal(
    <div 
      className="fixed z-[9999] pointer-events-auto"
      style={{
        left: `${Math.min(Math.max(rect.left + rect.width / 2, 116), window.innerWidth - 116)}px`,
        top: `${Math.max(rect.top - offsetY, 16)}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {children}
    </div>,
    document.body
  );
};
