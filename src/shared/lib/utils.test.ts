import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob, formatFileSize } from './utils'

describe('formatFileSize', () => {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024

  it.each<[number, string]>([
    [0, '0 Bytes'],
    [1, '1 Bytes'],
    [1023, '1023 Bytes'],
    [KB, '1 KB'],
    [KB + KB / 2, '1.5 KB'],
    [MB, '1 MB'],
    [Math.floor(1.2345 * MB), '1.23 MB'],
    [GB, '1 GB'],
  ])('returns %s as %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected)
  })
})

describe('downloadBlob', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates link, sets href and download, clicks and revokes URL', () => {
    const blob = new Blob(['hello'], { type: 'text/plain' })
    const mockUrl = 'blob:mock-url'

    const createObjectURLMock = vi.fn().mockReturnValue(mockUrl)
    const revokeObjectURLMock = vi.fn()

    Object.defineProperty(window.URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectURLMock,
    })
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURLMock,
    })

    const anchor = document.createElement('a') as HTMLAnchorElement & { click: () => void }
    const clickSpy = vi.fn()
    anchor.click = clickSpy

    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor)

    downloadBlob(blob, 'test.txt')

    expect(createObjectURLMock).toHaveBeenCalledWith(blob)
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(anchor.href).toBe(mockUrl)
    expect(anchor.download).toBe('test.txt')
    expect(clickSpy).toHaveBeenCalled()
    expect(revokeObjectURLMock).toHaveBeenCalledWith(mockUrl)
  })
})
