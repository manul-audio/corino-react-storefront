const SUBSCRIBED_KEY = 'corino:newsletter:subscribed'
const EMAIL_KEY = 'corino:newsletter:email'

export interface NewsletterState {
  subscribed: boolean
  email: string | null
}

export function readNewsletterState(): NewsletterState {
  if (typeof window === 'undefined') return { subscribed: false, email: null }
  return {
    subscribed: window.localStorage.getItem(SUBSCRIBED_KEY) === 'true',
    email: window.localStorage.getItem(EMAIL_KEY),
  }
}

export function rememberSubscribed(email: string): void {
  window.localStorage.setItem(SUBSCRIBED_KEY, 'true')
  window.localStorage.setItem(EMAIL_KEY, email)
}
