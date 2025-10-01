import { describe, expect, it } from 'vitest'
import { autoBind } from './autoBind'

describe('autoBind', () => {
  it('binds methods to instance and allows calling them without context loss', () => {
    class TestClass {
      value = 42

      getValue() {
        return this.value
      }

      getSelf() {
        return this
      }
    }

    const instance = new TestClass()
    autoBind(instance)

    const { getValue, getSelf } = instance
    expect(getValue()).toBe(42)
    expect(getSelf()).toBe(instance)
    expect(Object.hasOwn(instance, 'getValue')).toBe(true)
    expect(Object.hasOwn(instance, 'getSelf')).toBe(true)
    expect(Object.hasOwn(instance, 'constructor')).toBe(false)
  })

  it('binds accessors (get/set) from prototype to specific instance', () => {
    class WithAccessor {
      _value = 10

      get double() {
        return this._value * 2
      }

      set double(value: number) {
        this._value = value / 2
      }
    }

    const instance = new WithAccessor()
    const prototype = Object.getPrototypeOf(instance)

    const originalDescriptor = Object.getOwnPropertyDescriptor(prototype, 'double')!
    const originalGetter = originalDescriptor.get!
    expect(() => originalGetter()).toThrow()

    autoBind(instance)

    const boundDescriptor = Object.getOwnPropertyDescriptor(prototype, 'double')!
    const boundGetter = boundDescriptor.get!
    const boundSetter = boundDescriptor.set!

    expect(boundGetter()).toBe(20)
    boundSetter(50)
    expect(instance._value).toBe(25)
    expect(instance.double).toBe(50)

    instance.double = 60
    expect(instance._value).toBe(30)
  })

  it('does not modify non-functional prototype properties or copy them to instance', () => {
    class TestClass {}
    ;(TestClass.prototype as any).nonFunctionProperty = 123

    const instance = new TestClass()
    autoBind(instance)

    expect((instance as any).nonFunctionProperty).toBe(123)
    expect(Object.hasOwn(instance, 'nonFunctionProperty')).toBe(false)
  })
})
