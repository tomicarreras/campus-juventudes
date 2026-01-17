import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get today's date in YYYY-MM-DD format (local date, no timezone conversion)
 */
export function getTodayDateString(): string {
  const today = new Date()
  return today.toISOString().split("T")[0]
}

/**
 * Parse a date string (YYYY-MM-DD) and get the date in local timezone
 * This avoids timezone issues when comparing dates
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Check if today is someone's birthday based on birth date (YYYY-MM-DD format)
 * Compares month and day only, ignoring the year
 */
export function isBirthdayToday(birthDateStr: string): boolean {
  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()
  
  const [year, month, day] = birthDateStr.split("-").map(Number)
  
  return todayMonth === month && todayDay === day
}

/**
 * Calculate days until next birthday
 * Considers the birthday hasn't occurred yet this year
 */
export function daysUntilBirthday(birthDateStr: string): number {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()
  
  const [year, month, day] = birthDateStr.split("-").map(Number)
  
  // Check if birthday has occurred this year
  const hasOccurred = month < currentMonth || (month === currentMonth && day < currentDay)
  
  // Calculate target birthday
  const targetYear = hasOccurred ? currentYear + 1 : currentYear
  const targetDate = new Date(targetYear, month - 1, day)
  const today2 = new Date(currentYear, currentMonth - 1, currentDay)
  
  const diffTime = targetDate.getTime() - today2.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}
