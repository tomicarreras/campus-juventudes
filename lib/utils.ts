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
  const birthDate = parseDateString(birthDateStr)

  return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate()
}

/**
 * Calculate days until next birthday
 * Considers the birthday hasn't occurred yet this year
 */
export function daysUntilBirthday(birthDateStr: string): number {
  const today = new Date()
  const birthDate = parseDateString(birthDateStr)
  const currentYear = today.getFullYear()

  // Set birthday to current year
  let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate())

  // If birthday already passed this year, set to next year
  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate())
  }

  const diffTime = nextBirthday.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
