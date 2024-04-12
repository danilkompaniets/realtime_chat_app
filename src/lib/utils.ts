import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(id: string, id2: string) {
  const sortedIds = [id, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}
