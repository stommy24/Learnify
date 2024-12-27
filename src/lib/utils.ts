import { type ClassValue as TailwindClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: TailwindClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function processProgressData(data: any) {
  // Add implementation based on your needs
  return data;
}

export function processTrendsData(data: any) {
  // Add implementation based on your needs
  return data;
}

export function processMetricsData(data: any) {
  // Add implementation based on your needs
  return data;
} 