import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStatusStore } from 'src/stores/gameStatusStore.js'

// Create a spy for the history function
const mockAddGameToHistory = vi.fn().mockResolvedValue(undefined)

// Mock the history composable
vi.mock('src/composables/historyComposable', () => ({
  useHistory: () => ({
    addGameToHistoryAsync: mockAddGameToHistory,
  }),
}))

describe('gameStatusStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    mockAddGameToHistory.mockClear()
  })

  describe('Initial State', () => {
    it('has correct default state', () => {
      const store = useGameStatusStore()

      expect(store.round).toBe(1)
      expect(store.anyGameEverStarted).toBe(false)
      expect(store.gameInProgress).toBe(false)
      expect(store.currentGameTime).toBe(0)
      expect(store.totalGameTime).toBe(0)
      expect(store.isBoardShowned).toBe(false)
    })
  })

  describe('updateGameTime', () => {
    it('increments currentGameTime by 1', () => {
      const store = useGameStatusStore()
      const initial = store.currentGameTime

      store.updateGameTime()

      expect(store.currentGameTime).toBe(initial + 1)
    })

    it('increments totalGameTime by 1', () => {
      const store = useGameStatusStore()
      const initial = store.totalGameTime

      store.updateGameTime()

      expect(store.totalGameTime).toBe(initial + 1)
    })

    it('updates both times independently over multiple calls', () => {
      const store = useGameStatusStore()

      store.updateGameTime()
      store.updateGameTime()
      store.updateGameTime()

      expect(store.currentGameTime).toBe(3)
      expect(store.totalGameTime).toBe(3)
    })
  })

  describe('startGame', () => {
    it('sets anyGameEverStarted to true', () => {
      const store = useGameStatusStore()
      expect(store.anyGameEverStarted).toBe(false)

      store.startGame()

      expect(store.anyGameEverStarted).toBe(true)
    })

    it('sets gameInProgress to true', () => {
      const store = useGameStatusStore()
      expect(store.gameInProgress).toBe(false)

      store.startGame()

      expect(store.gameInProgress).toBe(true)
    })

    it('resets currentGameTime to 0', () => {
      const store = useGameStatusStore()
      store.currentGameTime = 10

      store.startGame()

      expect(store.currentGameTime).toBe(0)
    })

    it('does not reset totalGameTime', () => {
      const store = useGameStatusStore()
      store.totalGameTime = 50

      store.startGame()

      expect(store.totalGameTime).toBe(50)
    })

    it('keeps anyGameEverStarted true on subsequent calls', () => {
      const store = useGameStatusStore()

      store.startGame()
      expect(store.anyGameEverStarted).toBe(true)

      store.startGame()
      expect(store.anyGameEverStarted).toBe(true)
    })
  })

  describe('endGame', () => {
    it('sets gameInProgress to false', async () => {
      const store = useGameStatusStore()
      store.gameInProgress = true

      await store.endGame(1)

      expect(store.gameInProgress).toBe(false)
    })

    it('calls addGameToHistoryAsync with correct parameters', async () => {
      const store = useGameStatusStore()
      store.round = 5
      store.currentGameTime = 8
      store.totalGameTime = 42

      await store.endGame(1)

      expect(mockAddGameToHistory).toHaveBeenCalledWith(5, 8, 42, 1)
    })

    it('handles loss result (0)', async () => {
      const store = useGameStatusStore()
      store.round = 3
      store.currentGameTime = 5
      store.totalGameTime = 20

      await store.endGame(0)

      expect(mockAddGameToHistory).toHaveBeenCalledWith(3, 5, 20, 0)
    })

    it('handles win result (1)', async () => {
      const store = useGameStatusStore()
      store.round = 7
      store.currentGameTime = 10
      store.totalGameTime = 65

      await store.endGame(1)

      expect(mockAddGameToHistory).toHaveBeenCalledWith(7, 10, 65, 1)
    })
  })

  describe('Game Flow', () => {
    it('simulates a complete game cycle', async () => {
      const store = useGameStatusStore()

      // Start game
      store.startGame()
      expect(store.gameInProgress).toBe(true)
      expect(store.currentGameTime).toBe(0)

      // Update time
      store.updateGameTime()
      store.updateGameTime()
      expect(store.currentGameTime).toBe(2)
      expect(store.totalGameTime).toBe(2)

      // End game
      await store.endGame(1)
      expect(store.gameInProgress).toBe(false)
    })

    it('simulates multiple rounds', async () => {
      const store = useGameStatusStore()

      // Round 1
      store.startGame()
      store.updateGameTime()
      store.updateGameTime()
      await store.endGame(1)

      expect(store.totalGameTime).toBe(2)
      expect(store.currentGameTime).toBe(2)

      // Round 2
      store.round = 2
      store.startGame()
      expect(store.currentGameTime).toBe(0) // Reset for new round
      expect(store.totalGameTime).toBe(2) // Cumulative

      store.updateGameTime()
      store.updateGameTime()
      store.updateGameTime()
      await store.endGame(1)

      expect(store.currentGameTime).toBe(3)
      expect(store.totalGameTime).toBe(5) // Cumulative
    })
  })

  describe('State Persistence', () => {
    it('maintains state values', () => {
      const store = useGameStatusStore()

      store.round = 10
      store.anyGameEverStarted = true
      store.totalGameTime = 100

      expect(store.round).toBe(10)
      expect(store.anyGameEverStarted).toBe(true)
      expect(store.totalGameTime).toBe(100)
    })
  })
})
