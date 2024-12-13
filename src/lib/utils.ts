import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: number) {
  const secs = Math.round(time % 60)
  const ss = String(Math.round(time % 60)).padStart(2, '0')
  const mm = Math.round((time - secs)/60)

  return `${mm}:${ss}`
}