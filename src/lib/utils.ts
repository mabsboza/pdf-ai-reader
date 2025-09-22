import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToAscii(inputString: string) {
  return inputString.replace(/[^\x00-\x7F]+/g, "");
};

export function toNamespace(fileKey: string) {
  return fileKey
    .replace(/\s+/g, "_")   // reemplaza espacios
    .replace(/[^a-zA-Z0-9_-]/g, ""); // quita caracteres raros
}