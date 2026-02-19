import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda con separadores de miles y decimales
 * @param amount - El monto a formatear
 * @param decimals - Número de decimales (default: 2)
 * @returns String formateado (ej: "$1,000,000.00")
 */
export function formatCurrency(amount: number | undefined, decimals: number = 2): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "$0.00";
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Formatea un número con separadores de miles
 * @param num - El número a formatear
 * @param decimals - Número de decimales (default: 0)
 * @returns String formateado (ej: "1,000,000")
 */
export function formatNumber(num: number | undefined, decimals: number = 0): string {
  if (num === undefined || num === null || isNaN(num)) {
    return "0";
  }
  
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
