'use client'

import { useState, type ChangeEvent, type DragEvent } from 'react'

export function DeviceTokenInput({ error, accept, onToken, onError }: {
  error: Error | null
  accept?: string
  onToken: (token: string) => void
  onError: (err: Error) => void
}) {
  const [hovering, setHovering] = useState(false)

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => onToken(e.target?.result as string)
    reader.onerror = () => onError(new Error('Could not read file.'))
    reader.readAsText(file)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setHovering(false)
    const files = event.dataTransfer?.files
    if (!files || files.length !== 1) {
      onError(new Error('Drop a single machine file.'))
      return
    }
    handleFile(files[0])
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files || files.length !== 1) {
      onError(new Error('Choose a single machine file.'))
      return
    }
    handleFile(files[0])
    // Reset so choosing the same file again still fires onChange.
    event.target.value = ''
  }

  function setHover(next: boolean) {
    return (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setHovering(next)
    }
  }

  return (
    <div
      className={hovering ? 'device-token-input hovering' : 'device-token-input'}
      onDragStart={setHover(false)}
      onDragEnd={setHover(false)}
      onDragOver={setHover(true)}
      onDragEnter={setHover(true)}
      onDragLeave={setHover(false)}
      onDrop={handleDrop}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 16v-8M8 11.5l4-4 4 4M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <label htmlFor="device-token-input">
        <span className="link">Choose a machine file</span> or drag here to upload
      </label>
      <input
        id="device-token-input"
        type="file"
        accept={accept || '.dt'}
        onChange={handleInput}
      />
      {error ? <p className="error">{error.message}</p> : null}
    </div>
  )
}
