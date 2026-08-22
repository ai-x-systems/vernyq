import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** Formats integer cents (e.g. 600000) as USD (e.g. "$6,000.00"). */
export function formatCentsAsUsd(cents: number): string {
  return usdFormatter.format(cents / 100);
}
