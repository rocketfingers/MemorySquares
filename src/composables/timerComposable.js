import { onMounted, onBeforeUnmount } from 'vue'
import { useGameStatusStore } from '../stores/gameStatusStore.js'
import { timeConstants } from 'src/gameConstants.js'

// by convention, composable function names start with "use"
export function useTimer() {
  let timer = null

  const gameStatusStore = useGameStatusStore()

  const updateTime = () => {
    if (
      !document.hidden &&
      gameStatusStore.gameInProgress &&
      gameStatusStore.currentGameTime <= timeConstants.MAX_ALLOWED_TIME
    ) {
      gameStatusStore.updateGameTime()
    }
  }

  onMounted(function () {
    timer = window.setInterval(() => updateTime(), 1000)
  })

  onBeforeUnmount(clearInterval(timer))

  return updateTime
}
