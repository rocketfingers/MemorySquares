import { ref, computed } from 'vue'

/**
 * Game board composable - manages the game grid, squares, and click interactions
 * @param {Object} gameStatusStore - Pinia game status store instance
 * @returns {Object} Game board state and methods
 */
export function useGameBoard(gameStatusStore) {
  // Board state
  const columns = ref(3)
  const rectangles = ref([])
  const itemsNotClickable = ref(true)

  // Computed properties
  const countOfSquares = computed(() => {
    return columns.value * columns.value
  })

  const countOfValidClicked = computed(() => {
    return rectangles.value.filter((p) => p.isClicked === true && p.isValid === true).length
  })

  const countOfValid = computed(() => {
    return rectangles.value.filter((p) => p.isValid === true).length
  })

  const isGameWon = computed(() => {
    return rectangles.value.filter((p) => p.isClicked === false && p.isValid === true).length === 0
  })

  const isGameLost = computed(() => {
    return rectangles.value.some((p) => p.isClicked === true && p.isValid === false)
  })

  /**
   * Determines if the grid should expand based on the round number
   * Grid expands every 3 rounds (4, 7, 10) up to round 13
   */
  const shouldAddColumns = (round) => {
    return round % 3 === 1 && round !== 1 && round < 13
  }

  /**
   * Calculates the number of columns for the current round
   */
  const calculateColumns = (round) => {
    let cols = 3
    for (let i = 1; i <= round; i++) {
      if (shouldAddColumns(i)) {
        cols++
      }
    }
    return cols
  }

  /**
   * Generates the game board with random valid/invalid squares
   * Ensures minimum of 2 valid and 2 invalid squares
   */
  const assignRectangles = () => {
    rectangles.value = []

    // Calculate difficulty modifier based on round
    const lvlAdjustment = gameStatusStore.round % 3 === 0 ? 3 : gameStatusStore.round % 3

    // Create initial rectangles with random validity
    for (let i = 0; i < countOfSquares.value; i++) {
      rectangles.value.push({
        id: i,
        isValid: Math.random() < 0.15 + 0.15 * lvlAdjustment,
        isClicked: false,
      })
    }

    // Count valid rectangles
    let validCount = rectangles.value.filter((p) => p.isValid).length

    // Ensure minimum 2 valid rectangles
    while (validCount < 2) {
      const nonValidSquares = rectangles.value.filter((p) => !p.isValid)
      const randomSquare = nonValidSquares[Math.floor(Math.random() * nonValidSquares.length)]
      randomSquare.isValid = true
      validCount++
    }

    // Ensure minimum 2 invalid rectangles
    while (validCount > countOfSquares.value - 2) {
      const validSquares = rectangles.value.filter((p) => p.isValid)
      const randomSquare = validSquares[Math.floor(Math.random() * validSquares.length)]
      randomSquare.isValid = false
      validCount--
    }
  }

  /**
   * Shows or hides the board results (preview mode vs play mode)
   * @param {boolean} shown - If true, shows all squares (preview mode). If false, hides them (play mode)
   */
  const boardResultsShowOrHide = (shown) => {
    rectangles.value.forEach((square) => {
      square.isClicked = shown
    })
    if (shown === false) {
      itemsNotClickable.value = false
      gameStatusStore.startGame()
    }
  }

  /**
   * Handles square click events
   * @param {number} id - The ID of the clicked square
   * @returns {Object|null} Result object with win/loss status, or null if no result yet
   */
  const handleItemClick = (id) => {
    if (itemsNotClickable.value) {
      return null
    }

    const item = rectangles.value.find((p) => p.id === id)
    if (!item) {
      return null
    }

    item.isClicked = true

    // Check for loss
    if (isGameLost.value) {
      return { won: false, lost: true }
    }

    // Check for win
    if (isGameWon.value) {
      return { won: true, lost: false }
    }

    return null
  }

  /**
   * Resets the board for a new round
   */
  const resetBoard = () => {
    columns.value = calculateColumns(gameStatusStore.round)
    assignRectangles()
    itemsNotClickable.value = true
  }

  /**
   * Enables clicking on the board
   */
  const enableClicking = () => {
    itemsNotClickable.value = false
  }

  /**
   * Disables clicking on the board
   */
  const disableClicking = () => {
    itemsNotClickable.value = true
  }

  return {
    // State
    columns,
    rectangles,
    itemsNotClickable,

    // Computed
    countOfSquares,
    countOfValidClicked,
    countOfValid,
    isGameWon,
    isGameLost,

    // Methods
    assignRectangles,
    boardResultsShowOrHide,
    shouldAddColumns,
    calculateColumns,
    handleItemClick,
    resetBoard,
    enableClicking,
    disableClicking,
  }
}
