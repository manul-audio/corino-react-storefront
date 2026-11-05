import { UiSwitch } from '@/components/UiSwitch'

export function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <span className="demo-dot" aria-hidden="true" />
      <span>
        <strong>Demo site</strong> — Corino is fictional. This page is a live integration of the{' '}
        <a href="https://github.com/manul-audio/moonbase-react" target="_blank" rel="noopener">
          Moonbase React SDK
        </a>
        .
      </span>
      <UiSwitch />
      <span className="demo-note">
        Because of CORS, the demo tenant works only on localhost.
      </span>
    </div>
  )
}
