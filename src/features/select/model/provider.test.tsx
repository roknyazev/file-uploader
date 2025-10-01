import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SelectFileProvider, useSelectFileContext } from './provider'

function TestConsumer() {
  const { file, isDragging } = useSelectFileContext()
  return (
    <div>
      <div data-testid="drag-status">{String(isDragging)}</div>
      <div data-testid="file-name">{file ? file.name : ''}</div>
    </div>
  )
}

describe('SelectFileProvider', () => {
  it('throws error when used outside provider', () => {
    const TestComponent = () => {
      useSelectFileContext()
      return null
    }

    expect(() => render(<TestComponent />)).toThrow('UploadForm must be used within provider')
  })

  it('provides initial context values', () => {
    render(
      <SelectFileProvider>
        <TestConsumer />
      </SelectFileProvider>,
    )

    expect(screen.getByTestId('drag-status').textContent).toBe('false')
    expect(screen.getByTestId('file-name').textContent).toBe('')
  })

  it('handles drag events and file drop', () => {
    render(
      <SelectFileProvider>
        <TestConsumer />
      </SelectFileProvider>,
    )

    fireEvent.dragEnter(document)
    expect(screen.getByTestId('drag-status').textContent).toBe('true')

    fireEvent.dragLeave(document)
    expect(screen.getByTestId('drag-status').textContent).toBe('false')

    const testFile = new File(['content'], 'test.txt', { type: 'text/plain' })
    fireEvent.drop(document, {
      dataTransfer: { files: [testFile] },
    })

    expect(screen.getByTestId('drag-status').textContent).toBe('false')
    expect(screen.getByTestId('file-name').textContent).toBe('test.txt')
  })

  it('cleans up event listeners on unmount', () => {
    const addListenerSpy = vi.spyOn(document, 'addEventListener')
    const removeListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = render(<SelectFileProvider />)

    const eventTypes = ['dragover', 'dragenter', 'dragleave', 'drop']
    const addedListeners = addListenerSpy.mock.calls.filter(([type]) => eventTypes.includes(type))

    unmount()

    addedListeners.forEach(([type, handler]) => {
      expect(removeListenerSpy).toHaveBeenCalledWith(type, handler)
    })

    addListenerSpy.mockRestore()
    removeListenerSpy.mockRestore()
  })
})
