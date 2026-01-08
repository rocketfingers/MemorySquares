import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia, defineStore } from 'pinia'
import { useGameBoard } from 'src/composables/useGameBoard.js'

// Mock the game status store
const createMockGameStatusStore = (round = 1) => {
  return defineStore('gameStatusStore', {
    state: () => ({
      round,
      anyGameEverStarted: false,
      gameInProgress: false,
      currentGameTime: 0,
      totalGameTime: 0,
    }),
    actions: {
      startGame() {
        this.anyGameEverStarted = true
        this.gameInProgress = true
        this.currentGameTime = 0
      },
    },
  })()
}

describe('useGameBoard', () => {
  let pinia
  let mockStore

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    mockStore = createMockGameStatusStore(1)
  })

  describe('Initialization', () => {
    it('initializes with correct default values', () => {
      const gameBoard = useGameBoard(mockStore)

      expect(gameBoard.columns.value).toBe(3)
      expect(gameBoard.rectangles.value).toEqual([])
      expect(gameBoard.itemsNotClickable.value).toBe(true)
    })
  })

  describe('Computed Properties', () => {
    it('calculates countOfSquares correctly', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3
      expect(gameBoard.countOfSquares.value).toBe(9)

      gameBoard.columns.value = 4
      expect(gameBoard.countOfSquares.value).toBe(16)

      gameBoard.columns.value = 5
      expect(gameBoard.countOfSquares.value).toBe(25)
    })

    it('calculates countOfValidClicked correctly', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: true },
        { id: 1, isValid: true, isClicked: false },
        { id: 2, isValid: false, isClicked: true },
      ]

      expect(gameBoard.countOfValidClicked.value).toBe(1)
    })

    it('calculates countOfValid correctly', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: false },
        { id: 1, isValid: true, isClicked: true },
        { id: 2, isValid: false, isClicked: false },
        { id: 3, isValid: false, isClicked: true },
      ]

      expect(gameBoard.countOfValid.value).toBe(2)
    })

    it('determines isGameWon when all valid squares are clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: true },
        { id: 1, isValid: true, isClicked: true },
        { id: 2, isValid: false, isClicked: false },
      ]

      expect(gameBoard.isGameWon.value).toBe(true)
    })

    it('determines isGameWon is false when not all valid squares are clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: true },
        { id: 1, isValid: true, isClicked: false },
        { id: 2, isValid: false, isClicked: false },
      ]

      expect(gameBoard.isGameWon.value).toBe(false)
    })

    it('determines isGameLost when an invalid square is clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: false },
        { id: 1, isValid: false, isClicked: true },
      ]

      expect(gameBoard.isGameLost.value).toBe(true)
    })

    it('determines isGameLost is false when no invalid squares are clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: true },
        { id: 1, isValid: false, isClicked: false },
      ]

      expect(gameBoard.isGameLost.value).toBe(false)
    })
  })

  describe('shouldAddColumns', () => {
    it('returns true for rounds 4, 7, 10', () => {
      const gameBoard = useGameBoard(mockStore)

      expect(gameBoard.shouldAddColumns(4)).toBe(true)
      expect(gameBoard.shouldAddColumns(7)).toBe(true)
      expect(gameBoard.shouldAddColumns(10)).toBe(true)
    })

    it('returns false for round 1', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.shouldAddColumns(1)).toBe(false)
    })

    it('returns false for round 13 and above', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.shouldAddColumns(13)).toBe(false)
      expect(gameBoard.shouldAddColumns(14)).toBe(false)
    })

    it('returns false for non-expansion rounds', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.shouldAddColumns(2)).toBe(false)
      expect(gameBoard.shouldAddColumns(3)).toBe(false)
      expect(gameBoard.shouldAddColumns(5)).toBe(false)
    })
  })

  describe('calculateColumns', () => {
    it('returns 3 for round 1', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.calculateColumns(1)).toBe(3)
    })

    it('returns 4 for round 4', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.calculateColumns(4)).toBe(4)
    })

    it('returns 5 for round 7', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.calculateColumns(7)).toBe(5)
    })

    it('returns 6 for round 10', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.calculateColumns(10)).toBe(6)
    })

    it('returns 6 for round 13 (no more expansion)', () => {
      const gameBoard = useGameBoard(mockStore)
      expect(gameBoard.calculateColumns(13)).toBe(6)
    })
  })

  describe('assignRectangles', () => {
    it('creates correct number of rectangles based on columns', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3
      gameBoard.assignRectangles()

      expect(gameBoard.rectangles.value.length).toBe(9)
    })

    it('ensures minimum 2 valid rectangles', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3

      // Run multiple times due to randomness
      for (let i = 0; i < 10; i++) {
        gameBoard.assignRectangles()
        const validCount = gameBoard.rectangles.value.filter((r) => r.isValid).length
        expect(validCount).toBeGreaterThanOrEqual(2)
      }
    })

    it('ensures minimum 2 invalid rectangles', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3

      // Run multiple times due to randomness
      for (let i = 0; i < 10; i++) {
        gameBoard.assignRectangles()
        const invalidCount = gameBoard.rectangles.value.filter((r) => !r.isValid).length
        expect(invalidCount).toBeGreaterThanOrEqual(2)
      }
    })

    it('initializes all rectangles with isClicked as false', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3
      gameBoard.assignRectangles()

      gameBoard.rectangles.value.forEach((rect) => {
        expect(rect.isClicked).toBe(false)
      })
    })

    it('assigns unique IDs to each rectangle', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3
      gameBoard.assignRectangles()

      const ids = gameBoard.rectangles.value.map((r) => r.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(9)
    })
  })

  describe('boardResultsShowOrHide', () => {
    it('shows all squares when passed true', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: false },
        { id: 1, isValid: false, isClicked: false },
      ]

      gameBoard.boardResultsShowOrHide(true)

      expect(gameBoard.rectangles.value[0].isClicked).toBe(true)
      expect(gameBoard.rectangles.value[1].isClicked).toBe(true)
    })

    it('hides all squares when passed false', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: true },
        { id: 1, isValid: false, isClicked: true },
      ]

      gameBoard.boardResultsShowOrHide(false)

      expect(gameBoard.rectangles.value[0].isClicked).toBe(false)
      expect(gameBoard.rectangles.value[1].isClicked).toBe(false)
    })

    it('enables clicking when hiding squares', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [{ id: 0, isValid: true, isClicked: true }]
      gameBoard.itemsNotClickable.value = true

      gameBoard.boardResultsShowOrHide(false)

      expect(gameBoard.itemsNotClickable.value).toBe(false)
    })

    it('calls startGame on store when hiding squares', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.rectangles.value = [{ id: 0, isValid: true, isClicked: true }]

      gameBoard.boardResultsShowOrHide(false)

      expect(mockStore.gameInProgress).toBe(true)
      expect(mockStore.anyGameEverStarted).toBe(true)
    })
  })

  describe('handleItemClick', () => {
    it('returns null when items are not clickable', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = true
      gameBoard.rectangles.value = [{ id: 0, isValid: true, isClicked: false }]

      const result = gameBoard.handleItemClick(0)

      expect(result).toBeNull()
    })

    it('returns null when item is not found', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false
      gameBoard.rectangles.value = [{ id: 0, isValid: true, isClicked: false }]

      const result = gameBoard.handleItemClick(999)

      expect(result).toBeNull()
    })

    it('marks item as clicked when valid item is clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: false },
        { id: 1, isValid: true, isClicked: false },
      ]

      gameBoard.handleItemClick(0)

      expect(gameBoard.rectangles.value[0].isClicked).toBe(true)
    })

    it('returns loss result when invalid square is clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false
      gameBoard.rectangles.value = [{ id: 0, isValid: false, isClicked: false }]

      const result = gameBoard.handleItemClick(0)

      expect(result).toEqual({ won: false, lost: true })
    })

    it('returns win result when all valid squares are clicked', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: true },
        { id: 1, isValid: true, isClicked: false },
        { id: 2, isValid: false, isClicked: false },
      ]

      const result = gameBoard.handleItemClick(1)

      expect(result).toEqual({ won: true, lost: false })
    })

    it('returns null when game is ongoing', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false
      gameBoard.rectangles.value = [
        { id: 0, isValid: true, isClicked: false },
        { id: 1, isValid: true, isClicked: false },
        { id: 2, isValid: false, isClicked: false },
      ]

      const result = gameBoard.handleItemClick(0)

      expect(result).toBeNull()
    })
  })

  describe('resetBoard', () => {
    it('recalculates columns based on store round', () => {
      mockStore.round = 4
      const gameBoard = useGameBoard(mockStore)

      gameBoard.resetBoard()

      expect(gameBoard.columns.value).toBe(4)
    })

    it('creates new rectangles', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.columns.value = 3

      gameBoard.resetBoard()

      expect(gameBoard.rectangles.value.length).toBeGreaterThan(0)
    })

    it('sets items as not clickable', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false

      gameBoard.resetBoard()

      expect(gameBoard.itemsNotClickable.value).toBe(true)
    })
  })

  describe('enableClicking and disableClicking', () => {
    it('enables clicking', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = true

      gameBoard.enableClicking()

      expect(gameBoard.itemsNotClickable.value).toBe(false)
    })

    it('disables clicking', () => {
      const gameBoard = useGameBoard(mockStore)
      gameBoard.itemsNotClickable.value = false

      gameBoard.disableClicking()

      expect(gameBoard.itemsNotClickable.value).toBe(true)
    })
  })
})
