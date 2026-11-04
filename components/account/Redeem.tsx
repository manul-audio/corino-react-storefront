'use client'

import { useVoucher, type Voucher } from '@moonbase.sh/react'
import { useState, type FormEvent } from 'react'

export function AccountRedeem() {
  const { redeem } = useVoucher()
  const [code, setCode] = useState('')
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voucher, setVoucher] = useState<Voucher | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRedeeming(true)
    setError(null)
    try {
      setVoucher(await redeem(code))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setRedeeming(false)
    }
  }

  function reset() {
    setVoucher(null)
    setCode('')
    setError(null)
  }

  return (
    <div className="account-section">
      {!voucher ? (
        <form className="account-form" onSubmit={submit}>
          <h3>Redeem voucher</h3>
          <p className="hint">Have a voucher code? Enter it below to add licenses to your account.</p>

          <label htmlFor="voucher-code">Voucher code</label>
          <input
            id="voucher-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            placeholder="0000-0000-0000-0000"
            required
          />

          <button type="submit" className="submit" disabled={redeeming}>
            {redeeming ? 'Redeeming…' : 'Redeem'}
          </button>

          {error ? <p className="error">{error}</p> : null}
        </form>
      ) : (
        <div className="voucher-success">
          <h3>{voucher.name}</h3>
          {voucher.description ? <p className="hint">&quot;{voucher.description}&quot;</p> : null}
          <p className="success">Licenses have been added to your account.</p>
          <p className="hint">
            Code: <strong>{voucher.code}</strong>
          </p>
          <button type="button" className="submit" onClick={reset}>
            Redeem another
          </button>
        </div>
      )}
    </div>
  )
}
