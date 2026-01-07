import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { Quasar, Notify, Dialog, Dark } from 'quasar'

// Configure Quasar for testing
config.global.plugins = [
  [
    Quasar,
    {
      plugins: {
        Notify,
        Dialog,
        Dark,
      },
    },
  ],
]

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock localStorage
const localStorageMock = {
  store: {},
  get length() {
    return Object.keys(this.store).length
  },
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value.toString()
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key]
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {}
  }),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})
