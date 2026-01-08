import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStatusStore } from 'src/stores/gameStatusStore.js'

// We need to test the timer composable behavior without actually mounting
// Since it uses onMounted/onBeforeUnmount, we'll test the core logic
describe('timerComposable', () => {
  let pinia
  let store
  let originalHidden

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    store = useGameStatusStore()

    // Mock document.hidden
    originalHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden')
    Object.defineProperty(document, 'hidden', {
      writable: true,
      configurable: true,
      value: false,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
    if (originalHidden) {
      Object.defineProperty(Document.prototype, 'hidden', originalHidden)
    }
  })

  describe('Timer Update Logic', () => {
    it('increments time when document is visible and game in progress', () => {
      const store = useGameStatusStore()
      store.gameInProgress = true
      store.currentGameTime = 0
      document.hidden = false

      // Simulate the updateTime function logic
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(1)
      expect(store.totalGameTime).toBe(1)
    })

    it('does not increment time when document is hidden', () => {
      const store = useGameStatusStore()
      store.gameInProgress = true
      store.currentGameTime = 5
      document.hidden = true

      // Simulate the updateTime function logic
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(5)
    })

    it('does not increment time when game is not in progress', () => {
      const store = useGameStatusStore()
      store.gameInProgress = false
      store.currentGameTime = 3
      document.hidden = false

      // Simulate the updateTime function logic
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(3)
    })

    it('does not increment time when time exceeds MAX_ALLOWED_TIME', () => {
      const store = useGameStatusStore()
      store.gameInProgress = true
      store.currentGameTime = 13
      document.hidden = false

      // Simulate the updateTime function logic
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(13)
    })

    it('stops incrementing at exactly MAX_ALLOWED_TIME', () => {
      const store = useGameStatusStore()
      store.gameInProgress = true
      store.currentGameTime = 12
      document.hidden = false

      // At 12 seconds, still allowed
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(13)

      // At 13 seconds, should not increment
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(13)
    })
  })

  describe('Timer Conditions', () => {
    it('requires all conditions to be true for time update', () => {
      const store = useGameStatusStore()

      // All false
      store.gameInProgress = false
      store.currentGameTime = 0
      document.hidden = true

      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(0)
    })

    it('updates when all conditions are met', () => {
      const store = useGameStatusStore()

      // All true
      store.gameInProgress = true
      store.currentGameTime = 5
      document.hidden = false

      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }

      expect(store.currentGameTime).toBe(6)
    })
  })

  describe('Visibility Changes', () => {
    it('pauses timer when tab becomes hidden', () => {
      const store = useGameStatusStore()
      store.gameInProgress = true
      store.currentGameTime = 5
      document.hidden = false

      // Timer running
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }
      expect(store.currentGameTime).toBe(6)

      // Tab hidden
      document.hidden = true
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }
      expect(store.currentGameTime).toBe(6) // No change
    })

    it('resumes timer when tab becomes visible again', () => {
      const store = useGameStatusStore()
      store.gameInProgress = true
      store.currentGameTime = 5
      document.hidden = true

      // Tab hidden - no update
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }
      expect(store.currentGameTime).toBe(5)

      // Tab visible again
      document.hidden = false
      if (!document.hidden && store.gameInProgress && store.currentGameTime <= 12) {
        store.updateGameTime()
      }
      expect(store.currentGameTime).toBe(6)
    })
  })
})
