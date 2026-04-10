import React from 'react';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Coins, 
  Gem, 
  ShoppingBag, 
  Target, 
  BarChart3, 
  Scroll,
  LucideIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

export const IconMap: Record<string, LucideIcon> = {
  Zap,
  Flame,
  Trophy,
  Coins,
  Gem,
  ShoppingBag,
  Target,
  BarChart3,
  Scroll
};

interface TalentIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const TalentIcon: React.FC<TalentIconProps> = ({ iconName, className, size = 16 }) => {
  const Icon = IconMap[iconName] || Scroll;
  return <Icon className={className} size={size} />;
};
