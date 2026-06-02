import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getXPForLevel = (lvl: number) => 1000 + Math.floor((lvl - 1) / 10) * 100;

export function getTitleForLevel(level: number): string {
  if (level >= 1 && level < 4) {
    return 'Novice';
  } else if (level >= 4 && level < 16) {
    return 'Veteran';
  } else if (level >= 16 && level < 48) {
    return 'Master';
  } else {
    return 'Grandmaster';
  }
}

export const getDefaultRewardForLevel = (lvl: number) => {
  if (lvl <= 1) return null;
  if (lvl <= 4) return { type: 'talentPoint', amount: 1 };
  if (lvl > 4 && lvl <= 16 && (lvl - 4) % 2 === 0) return { type: 'talentPoint', amount: 1 };
  if (lvl > 16 && lvl <= 43 && (lvl - 16) % 3 === 0) return { type: 'talentPoint', amount: 1 };
  if (lvl > 43 && (lvl - 43) % 5 === 0) return { type: 'talentPoint', amount: 1 };
  return null;
};

export function getDeviceType(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  if (/windows phone/i.test(ua)) return 'Windows Phone';
  if (/Macintosh/i.test(ua)) return 'macOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown Device';
}

export function getDeviceCode(): string {
  if (typeof localStorage === 'undefined') return 'server';
  let code = localStorage.getItem('scholars_dungeon_device_code');
  if (!code) {
    code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('scholars_dungeon_device_code', code);
  }
  return code;
}
