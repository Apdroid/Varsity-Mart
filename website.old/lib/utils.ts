import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple cookie helpers (client-side)
export function setCookie(name: string, value: string, days = 7, options?: { path?: string; secure?: boolean; sameSite?: "Lax" | "Strict" | "None" }) {
  if (typeof document === "undefined") return
  let expires = ""
  if (days) {
    const d = new Date()
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + d.toUTCString()
  }

  const path = options?.path ?? "/"
  const secure = options?.secure ? "; Secure" : ""
  const sameSite = options?.sameSite ? `; SameSite=${options?.sameSite}` : ""

  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${secure}${sameSite}`
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, "\\$1") + "=([^;]*)"))
  return match ? decodeURIComponent(match[1]) : null
}

export function removeCookie(name: string, options?: { path?: string }) {
  if (typeof document === "undefined") return
  const path = options?.path ?? "/"
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}
