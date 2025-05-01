import { defineStore } from 'pinia'
import { useHistory } from 'src/composables/historyComposable'
export const useGameStatusStore = defineStore('gameStatusStore', {
  state: () => ({
    round: 1,
    anyGameEverStarted: false,
    gameInProgress: false,
    currentGameTime: 0,
    totalGameTime: 0,
  }),
  persist: true,
  actions: {
    updateGameTime() {
      this.currentGameTime++
      this.totalGameTime++
    },
    startGame() {
      this.anyGameEverStarted = true
      this.gameInProgress = true
      this.currentGameTime = 0
    },
    async endGame(result) {
      this.gameInProgress = false
      await useHistory().addGameToHistoryAsync(
        this.round,
        this.currentGameTime,
        this.totalGameTime,
        result,
      )
    },
  },
})
