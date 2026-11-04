'use client'

import { useInventory, Platform, type Activation, type Download, type License, type OwnedProduct } from '@moonbase.sh/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatBytes, formatDate } from '@/lib/format'
import { detectPlatform, sortDownloads } from '@/lib/platform'

export function AccountProductDetail({ productId }: { productId: string }) {
  const { getProduct, downloadProduct, getProductActivations, getProductLicenses, revokeActivation } = useInventory()
  const [product, setProduct] = useState<OwnedProduct | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [activations, setActivations] = useState<Activation[] | null>(null)
  const [licenses, setLicenses] = useState<License[] | null>(null)
  const [downloading, setDownloading] = useState<Set<string>>(new Set())
  const [revoking, setRevoking] = useState<Set<string>>(new Set())
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(Platform.Universal)

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      setCurrentPlatform(detectPlatform())
      let p: OwnedProduct
      try {
        p = await getProduct(productId)
      } catch (err) {
        if (!cancelled) setLoadError((err as Error).message)
        return
      }
      if (cancelled) return
      setProduct(p)
      if (p.maxActivations) {
        let resp = await getProductActivations(p.id)
        const all = [...resp.items]
        while (resp.hasMore && resp.next) {
          resp = await getProductActivations(p.id, resp.next)
          all.push(...resp.items)
        }
        if (!cancelled) setActivations(all)
      }
      if (p.externalLicenses) {
        let resp = await getProductLicenses(p.id)
        const all = [...resp.items]
        while (resp.hasMore && resp.next) {
          resp = await getProductLicenses(p.id, resp.next)
          all.push(...resp.items)
        }
        if (!cancelled) setLicenses(all)
      }
    }
    void loadAll()
    return () => { cancelled = true }
  }, [productId, getProduct, getProductActivations, getProductLicenses])

  const sortedDownloads = product?.downloads ? sortDownloads(product.downloads, currentPlatform) : []
  const totalLicenses = (product?.numberOfLicenses ?? 0) + (product?.subscriptionLicenses ?? 0)

  async function startDownload(download: Download) {
    setActionError(null)
    setDownloading((s) => new Set(s).add(download.key))
    try {
      await downloadProduct(download)
    } catch (err) {
      console.error('Download failed', err)
      setActionError((err as Error).message)
    } finally {
      setDownloading((s) => { const n = new Set(s); n.delete(download.key); return n })
    }
  }

  async function revoke(activation: Activation) {
    setActionError(null)
    setRevoking((s) => new Set(s).add(activation.id))
    try {
      await revokeActivation(activation)
      setActivations((list) => list ? list.filter((a) => a.id !== activation.id) : list)
      setProduct((p) => p ? { ...p, currentActivations: Math.max(0, (p.currentActivations ?? 1) - 1) } : p)
    } catch (err) {
      console.error('Revoke failed', err)
      setActionError((err as Error).message)
    } finally {
      setRevoking((s) => { const n = new Set(s); n.delete(activation.id); return n })
    }
  }

  return (
    <div className="product-detail">
      <Link href="/account/products" className="back">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 7H3M6.5 3.5L3 7l3.5 3.5" />
        </svg>
        Back to products
      </Link>

      {loadError ? (
        <p className="error">{loadError}</p>
      ) : !product ? (
        <p className="empty">Loading…</p>
      ) : (
        <>
          <header className="product-detail-head">
            <div className="product-icon large">
              {product.iconUrl ? <img src={product.iconUrl} alt={product.name} /> : null}
            </div>
            <div>
              <h3>{product.name}</h3>
              {product.version ? <p className="hint">Version {product.version}</p> : null}
            </div>
          </header>

          {actionError ? <p className="error">{actionError}</p> : null}

          <section className="detail-section">
            <h4>Downloads</h4>
            {product.releaseDescription ? <p className="release-notes">{product.releaseDescription}</p> : null}

            {(product.downloadsNeedsOwnership || product.downloadsNeedsUser) && totalLicenses === 0 ? (
              <p className="empty">This product requires ownership to download.</p>
            ) : sortedDownloads.length === 0 ? (
              <p className="empty">No downloadable files for this product.</p>
            ) : (
              <ul className="download-list">
                {sortedDownloads.map((download) => (
                  <li
                    key={download.key}
                    className={`download-row${download.platform === currentPlatform && download.platform !== Platform.Universal ? ' recommended' : ''}`}
                  >
                    <div>
                      <span className="name">{download.name}</span>
                      <span className="caption">{download.platform} · {formatBytes(download.size)}</span>
                    </div>
                    <button
                      type="button"
                      className={`download-btn${download.platform === currentPlatform ? ' primary' : ''}`}
                      disabled={downloading.has(download.key)}
                      onClick={() => void startDownload(download)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 2v8M4 7.5L7 10.5l3-3M2.5 12h9" />
                      </svg>
                      {downloading.has(download.key)
                        ? 'Starting…'
                        : download.platform === Platform.Universal
                          ? 'Download'
                          : `Download for ${download.platform}`}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="detail-section">
            <h4>
              Licenses
              {product.maxActivations ? (
                <span className="hint">
                  {' '}{product.currentActivations ?? 0} of {product.maxActivations} seats used
                </span>
              ) : null}
            </h4>

            {totalLicenses === 0 ? (
              <p className="empty">You don&apos;t own any licenses for this product yet.</p>
            ) : (
              <>
                {product.numberOfLicenses ? (
                  <p className="license-summary">
                    You own {product.numberOfLicenses} license{product.numberOfLicenses === 1 ? '' : 's'}.
                  </p>
                ) : null}
                {product.subscriptionLicenses ? (
                  <p className="license-summary">
                    You have {product.subscriptionLicenses} subscription license{product.subscriptionLicenses === 1 ? '' : 's'}.
                  </p>
                ) : null}

                {product.maxActivations && activations ? (
                  <div className="activation-list">
                    {activations.length === 0 ? <p className="empty">No active devices yet.</p> : null}
                    {activations.map((activation) => (
                      <div key={activation.id} className="activation-row">
                        <div>
                          <span className="caption">Device</span>
                          <span className="name">{activation.name}</span>
                        </div>
                        <div>
                          <span className="caption">Method</span>
                          <span className="value">{activation.activationMethod}</span>
                        </div>
                        {activation.firstValidatedAt ? (
                          <div>
                            <span className="caption">First activated</span>
                            <span className="value">{formatDate(activation.firstValidatedAt)}</span>
                          </div>
                        ) : null}
                        <button
                          type="button"
                          className="revoke-btn"
                          disabled={revoking.has(activation.id)}
                          onClick={() => void revoke(activation)}
                        >
                          {revoking.has(activation.id) ? 'Revoking…' : 'Revoke'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {product.externalLicenses && licenses && licenses.length > 0 ? (
                  <div className="license-list">
                    {licenses.map((license) => {
                      const fulfillment = license.externalFulfillment
                      return (
                        <div key={license.id} className="license-row">
                          <div className="license-row-head">
                            <span className="caption">{product.name} license</span>
                            {!fulfillment && !license.requiredConnectedAccount ? (
                              <span className="license-id">{license.id}</span>
                            ) : null}
                          </div>

                          {typeof fulfillment === 'string' ? (
                            <div className="license-fulfillment">
                              <span className="caption">Key code</span>
                              <code>{fulfillment}</code>
                            </div>
                          ) : fulfillment?.type === 'file' ? (
                            <div className="license-fulfillment">
                              <span className="caption">License file</span>
                              <a
                                className="license-download"
                                href={`data:${fulfillment.contentType};base64,${fulfillment.data}`}
                                download={fulfillment.fileName}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M7 2v8M4 7.5L7 10.5l3-3M2.5 12h9" />
                                </svg>
                                Download {fulfillment.fileName}
                              </a>
                            </div>
                          ) : fulfillment?.type === 'iLok' ? (
                            <div className="license-fulfillment ilok">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <span>Deposited to your iLok account</span>
                            </div>
                          ) : null}

                          {license.fulfillmentMessage ? <p className="license-message">{license.fulfillmentMessage}</p> : null}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </>
            )}
          </section>
        </>
      )}
    </div>
  )
}
