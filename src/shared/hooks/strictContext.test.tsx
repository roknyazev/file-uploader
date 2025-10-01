import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createContext } from 'react'
import { createStrictContext, useStrictContext } from './strictContext'

describe('useStrictContext', () => {
  it('throws error with context displayName when used outside provider', () => {
    const TestContext = createContext<number | null>(null)
    TestContext.displayName = 'MyContext'

    const TestComponent = () => {
      useStrictContext(TestContext)
      return null
    }

    expect(() => render(<TestComponent />)).toThrow('MyContext must be used within provider')
  })

  it('returns context value when used inside provider', () => {
    const TestContext = createContext<number | null>(null)
    TestContext.displayName = 'ValueContext'

    const TestComponent = () => {
      const value = useStrictContext(TestContext)
      return <div data-testid="value">{value}</div>
    }

    render(
      <TestContext.Provider value={123}>
        <TestComponent />
      </TestContext.Provider>,
    )

    expect(screen.getByTestId('value').textContent).toBe('123')
  })

  it('uses default "Context" name in error when displayName is not set', () => {
    const TestContext = createContext<string | null>(null)

    const TestComponent = () => {
      useStrictContext(TestContext)
      return null
    }

    expect(() => render(<TestComponent />)).toThrow('Context must be used within provider')
  })
})

describe('createStrictContext', () => {
  it('creates hook and provider; hook throws clear error outside provider', () => {
    const [useTestHook, TestProvider] = createStrictContext<number>('TestContext')

    const TestComponent = () => {
      useTestHook()
      return null
    }

    expect(() => render(<TestComponent />)).toThrow('TestContext must be used within provider')

    const TestComponentWithValue = () => {
      const value = useTestHook()
      return <div data-testid="value">{value}</div>
    }

    render(
      <TestProvider value={7}>
        <TestComponentWithValue />
      </TestProvider>,
    )

    expect(screen.getByTestId('value').textContent).toBe('7')
  })
})
