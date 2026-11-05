'use client'

import { useInventory, Platform, type Download, type OwnedProduct } from '@moonbase.sh/react'
import { useEffect, useState } from 'react'
import { Portal } from '@/components/Portal'
import { formatBytes } from '@/lib/format'
import { detectPlatform, sortDownloads } from '@/lib/platform'
import { useBodyScrollLock } from '@/lib/use-scroll-lock'
import { useEscapeKey } from '@/lib/use-escape'
import { useUi } from '@/lib/ui-context'

export function ProductDownloadModal() {
  const { downloadModal, hideDownloadModal } = useUi()
  const { getProduct, downloadProduct } = useInventory()
  const [product, setProduct] = useState<OwnedProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<Set<string>>(new Set())
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(Platform.Universal)

  const productId = downloadModal?.productId ?? null
  const isTrial = (downloadModal?.mode ?? 'trial') === 'trial'

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setLoadError(null)
      return
    }
    let cancelled = false
    setCurrentPlatform(detectPlatform())
    setLoading(true)
    setLoadError(null)
    setProduct(null)
    getProduct(productId)
      .then((p) => { if (!cancelled) setProduct(p) })
      .catch((err: Error) => { if (!cancelled) setLoadError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [productId, getProduct])

  async function startDownload(download: Download) {
    setDownloading((s) => new Set(s).add(download.key))
    try {
      await downloadProduct(download)
    } catch (err) {
      console.error('Download failed', err)
    } finally {
      setDownloading((s) => { const next = new Set(s); next.delete(download.key); return next })
    }
  }

  useEscapeKey(Boolean(downloadModal), hideDownloadModal)
  useBodyScrollLock(Boolean(downloadModal))

  if (!downloadModal) return null
  const downloads = product?.downloads ? sortDownloads(product.downloads, currentPlatform) : []

  return (
    <Portal>
      <div className="modal-mask" onClick={hideDownloadModal}>
        <div className="modal trial-modal" role="dialog" aria-modal="true" aria-labelledby="download-modal-title" onClick={(e) => e.stopPropagation()}>
          <header className="trial-modal-head">
            <h2 id="download-modal-title">{isTrial ? 'Free trial · 14 days' : 'Downloads'}</h2>
            <button className="close-btn" type="button" aria-label="Close" onClick={hideDownloadModal}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
          {loading ? <p className="empty">Loading downloads…</p> : null}
          {!loading && loadError ? <p className="error">{loadError}</p> : null}
          {!loading && !loadError && product ? (
            <>
              <div className="trial-product">
                <div className="trial-product-icon">{product.iconUrl ? <img src={product.iconUrl} alt={product.name} /> : null}</div>
                <div>
                  <h3>{product.name}</h3>
                  {product.version ? <p className="hint">Version {product.version}</p> : null}
                </div>
              </div>
              <p className="trial-hint">
                {isTrial
                  ? 'Download the installer for your platform. The plugin runs as a 14-day trial — no card needed, all features unlocked. Sign in inside the plugin to extend with a license.'
                  : 'Pick the installer for your platform. Sign in inside the plugin if it asks — your license is already on your account.'}
              </p>
              {downloads.length === 0 ? (
                <p className="empty">No downloadable files available for this product yet.</p>
              ) : (
                <ul className="download-list">
                  {downloads.map((download) => {
                    const isCurrent = download.platform === currentPlatform
                    const isBusy = downloading.has(download.key)
                    return (
                      <li
                        key={download.key}
                        className={`download-row${isCurrent && download.platform !== Platform.Universal ? ' recommended' : ''}`}
                      >
                        <div>
                          <span className="name">{download.name}</span>
                          <span className="caption">{download.platform} · {formatBytes(download.size)}</span>
                        </div>
                        <button
                          type="button"
                          className={`download-btn${isCurrent ? ' primary' : ''}`}
                          disabled={isBusy}
                          onClick={() => startDownload(download)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M7 2v8M4 7.5L7 10.5l3-3M2.5 12h9" />
                          </svg>
                          {isBusy ? 'Starting…' : download.platform === Platform.Universal ? 'Download' : `Download for ${download.platform}`}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          ) : null}
        </div>
      </div>
    </Portal>
  )
}
