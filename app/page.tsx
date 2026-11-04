'use client'

import { useStorefront } from '@moonbase.sh/react'
import { BundleSection } from '@/components/BundleSection'
import { DriftArt } from '@/components/DriftArt'
import { FeaturesSection } from '@/components/FeaturesSection'
import { HaloArt } from '@/components/HaloArt'
import { HeroSection } from '@/components/HeroSection'
import { PluginCard } from '@/components/PluginCard'
import { TrustSection } from '@/components/TrustSection'
import { useUi } from '@/lib/ui-context'

const TRIAL_ICON = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 2v8M4 7.5L7 10.5l3-3M2.5 12h9" />
  </svg>
)

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec">
      <div className="spec-label">{label}</div>
      <div className="spec-value">{value}</div>
    </div>
  )
}

export default function Home() {
  const { storefront, loaded } = useStorefront()
  const { showTrial } = useUi()

  return (
    <div>
      <HeroSection />

      <div id="plugins" className="section-head" data-boot={loaded ? 'ok' : 'loading'} data-products={storefront.products.length}>
        <div className="section-num">[01 / PLUGINS]</div>
        <div className="section-title">The instruments — two precise tools for tone and space.</div>
        <div className="section-aside">PAGE 01—02 OF 04</div>
      </div>

      <PluginCard
        productId="halo"
        variant="halo"
        fallbackPrice="$129"
        fallbackOriginalPrice="$199"
        art={<HaloArt />}
        chrome={(
          <>
            <div className="label"><span className="pulse" />HALO · v2.1 · ACTIVE</div>
            <div className="coord tr">+12.4 dB</div>
            <div className="coord bl">2nd · 3rd · 5th</div>
            <div className="coord br">SR 96k / 32f</div>
          </>
        )}
        meta={<><span>CRN-001</span><span className="dot">/</span><span>HARMONIC SATURATOR</span><span className="dot">/</span><span>VST3 · AU · AAX</span></>}
        tagline="Tape, tubes & transformer color in one warm box."
        desc="A psychoacoustic saturator built from a year of tape machine measurements. Three stages — preamp, head bump, and bias — each modeled with a per-frequency response so the lows breathe and the highs stay glassy. Push it for ten dB of glow on the mix bus, or sit it on a vocal at 1% for the kind of warmth that just gets out of the way."
        specs={<><Spec label="STAGES" value="3 + Bias" /><Spec label="OVERSAMPLING" value="×16" /><Spec label="CPU @ 96k" value="0.4%" /><Spec label="PRESETS" value="128" /></>}
        trial={<button type="button" className="trial-btn" onClick={() => showTrial('halo')}>{TRIAL_ICON} Try HALO free · 14 days</button>}
      />

      <PluginCard
        productId="drift"
        variant="drift"
        reverse
        fallbackPrice="$149"
        fallbackOriginalPrice="$229"
        art={<DriftArt />}
        chrome={(
          <>
            <div className="label"><span className="pulse" />DRIFT · v1.4 · LISTENING</div>
            <div className="coord tr">∞ TAILS</div>
            <div className="coord bl">GRAINS 1024</div>
            <div className="coord br">RT60 14.2s</div>
          </>
        )}
        meta={<><span>CRN-002</span><span className="dot">/</span><span>GRANULAR SPACE</span><span className="dot">/</span><span>VST3 · AU · AAX</span></>}
        tagline="A reverb that thinks in particles, not rooms."
        desc="DRIFT shreds incoming audio into a cloud of 1,024 grains, then suspends them in a tunable field of pitch, time and space. The result sits somewhere between reverb, delay and synthesis — perfect for ambient pads, dimensional vocals, or pulling a kick drum into a 14-second tail without losing its punch. Modulation runs internally so motion is built in, not bolted on."
        specs={<><Spec label="GRAINS" value="1024" /><Spec label="MAX TAIL" value="∞" /><Spec label="PITCH RANGE" value="±48 st" /><Spec label="PRESETS" value="160" /></>}
        trial={<button type="button" className="trial-btn" onClick={() => showTrial('drift')}>{TRIAL_ICON} Try DRIFT free · 14 days</button>}
      />

      <BundleSection />
      <FeaturesSection />
      <TrustSection />
    </div>
  )
}
