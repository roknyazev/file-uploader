import { createContext, useContext } from 'react'
import type { Context, Provider } from 'react'

export const useStrictContext = <T>(context: Context<T | null>): T => {
  const strictContext = useContext(context)

  if (strictContext === null) {
    throw new Error(`${context.displayName || 'Context'} must be used within provider`)
  }

  return strictContext
}

export const createStrictContext = <T extends NonNullable<unknown>>(name: string): [() => T, Provider<T>] => {
  const Context = createContext<null | T>(null)

  Context.displayName = name

  const useContextResult = (): T => useStrictContext(Context)

  return [useContextResult, Context.Provider as Provider<T>] as const
}
