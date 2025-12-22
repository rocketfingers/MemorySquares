import { onMounted, onBeforeUnmount } from 'vue'
import { useGameStatusStore } from '../stores/gameStatusStore.js'
import { timeConstants } from 'src/gameConstants.js'

/**
 * Game timer composable - manages the game countdown timer with visibility detection
 *
 * Features:
 * - Runs a 1-second interval timer during active gameplay
 * - Pauses when browser tab is hidden (respects document.hidden API)
 * - Automatically stops at MAX_ALLOWED_TIME limit
 * - Auto-starts on component mount
 * - Auto-cleanup on component unmount
 *
 * The timer only updates when:
 * 1. Browser tab is visible (!document.hidden)
 * 2. Game is in progress (gameInProgress === true)
 * 3. Time hasn't exceeded the maximum allowed (≤ MAX_ALLOWED_TIME)
 *
 * @returns {Function} updateTime - Manual time update function (primarily for internal use)
 */
export function useTimer() {
  let timer = null

  const gameStatusStore = useGameStatusStore()

  /**
   * Updates the game time if all conditions are met
   * Called every second by the interval timer
   */
  const updateTime = () => {
    if (
      !document.hidden &&
      gameStatusStore.gameInProgress &&
      gameStatusStore.currentGameTime <= timeConstants.MAX_ALLOWED_TIME
    ) {
      gameStatusStore.updateGameTime()
    }
  }

  // Start the timer when component mounts
  onMounted(function () {
    timer = window.setInterval(() => updateTime(), 1000)
  })

  // Clean up the timer when component unmounts
    onBeforeUnmount(() => {
    clearInterval(timer)
  })

  return updateTime
}
