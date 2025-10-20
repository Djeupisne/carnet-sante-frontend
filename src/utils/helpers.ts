import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''
  
  return format(dateObj, formatStr, { locale: fr })
}

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy à HH:mm')
}

export const formatTime = (time: string): string => {
  return time.slice(0, 5) // Format HH:MM
}

export const relativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(dateObj)) return ''
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr })
}

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// CORRIGÉ : Utilisation de ReturnType<typeof setTimeout> au lieu de NodeJS.Timeout
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]{10,}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}