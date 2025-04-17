import { defineStore } from 'pinia'
export const useGameStatusStore = defineStore('gameStatusStore', {
  state: () => ({
    round: 1,
    anyGameEverStarted: false,
    gameInProgress: false,
    currentGameTime: 0,
    totalGameTime: 0,
    solved: null,
    total: null,
  }),
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
    endGame() {
      this.gameInProgress = false
    },
  },
})
