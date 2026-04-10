import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getXPForLevel = (lvl: number) => 1000 + Math.floor((lvl - 1) / 10) * 100;

export const getDefaultRewardForLevel = (lvl: number) => {
  if (lvl <= 1) return null;
  if (lvl <= 4) return { type: 'talentPoint', amount: 1 };
  if (lvl > 4 && lvl <= 16 && (lvl - 4) % 2 === 0) return { type: 'talentPoint', amount: 1 };
  if (lvl > 16 && lvl <= 43 && (lvl - 16) % 3 === 0) return { type: 'talentPoint', amount: 1 };
  if (lvl > 43 && (lvl - 43) % 5 === 0) return { type: 'talentPoint', amount: 1 };
  return null;
};
