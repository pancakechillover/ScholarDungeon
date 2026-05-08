import React from 'react';

interface SlotMachineProps {
  size?: number | string;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ 
  size = 24, 
  className = "", 
  color = "currentColor",
  strokeWidth = 2
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Base Machine */}
      <rect x="4" y="4" width="14" height="18" rx="2" />
      
      {/* Top light */}
      <path d="M9 4v-1a2 2 0 0 1 4 0v1" />

      {/* Screen */}
      <rect x="7" y="8" width="8" height="5" rx="1" />
      
      {/* Reel Dividers */}
      <path d="M9.66 8v5" />
      <path d="M12.33 8v5" />

      {/* Buttons */}
      <path d="M7 15h2" />
      <path d="M11 15h4" />

      {/* Coin Tray */}
      <rect x="7" y="18" width="8" height="2" rx="0.5" />

      {/* Side Lever Arm */}
      <path d="M18 11h1a1 1 0 0 0 1-1V6" />
      
      {/* Lever Ball */}
      <circle cx="20" cy="5" r="1.5" />
    </svg>
  );
};
