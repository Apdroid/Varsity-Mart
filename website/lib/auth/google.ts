"use client"

type GoogleCredentialResponse = {
  credential?: string
}

type PromptMomentNotification = {
  isNotDisplayed?: () => boolean
  isSkippedMoment?: () => boolean
  isDismissedMoment?: () => boolean
}

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
      }) => void
      prompt: (listener?: (notification: PromptMomentNotification) => void) => void
      cancel?: () => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentity
  }
}

let googleScriptPromise: Promise<void> | null = null

function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser"))
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load Google sign-in"))
      document.head.appendChild(script)
    })
  }

  return googleScriptPromise
}

export async function getGoogleIdToken(clientId: string): Promise<string> {
  if (!clientId) {
    throw new Error("Google sign-in is not configured")
  }

  await loadGoogleScript()

  return new Promise((resolve, reject) => {
    const googleId = window.google?.accounts?.id
    if (!googleId) {
      reject(new Error("Google sign-in is unavailable"))
      return
    }

    let settled = false

    googleId.initialize({
      client_id: clientId,
      callback: (response) => {
        if (settled) return
        const token = response.credential
        if (!token) {
          settled = true
          reject(new Error("Google did not return a token"))
          return
        }
        settled = true
        resolve(token)
      },
    })

    googleId.prompt((notification) => {
      if (settled) return

      const blocked = notification.isNotDisplayed?.() || notification.isSkippedMoment?.()
      const dismissed = notification.isDismissedMoment?.()

      if (blocked || dismissed) {
        settled = true
        reject(new Error("Google sign-in was cancelled"))
      }
    })
  })
}
