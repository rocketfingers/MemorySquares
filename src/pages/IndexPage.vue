<template>
  <q-page :class="{ 'game-page': isStartShowned, 'playing-page': gameStatusStore.isBoardShowned }">
    <!-- Main Menu -->
    <div v-show="isStartShowned" class="menu-container">
      <div class="game-hero">
        <!-- Game Title -->
        <div class="game-title-wrapper">
          <q-icon name="psychology" size="80px" color="primary" class="title-icon" />
          <h1 class="game-title">Memory Squares</h1>
          <p class="game-subtitle">Test your memory and reflexes!</p>
        </div>

        <!-- Decorative squares -->
        <div class="decorative-squares">
          <div class="deco-square square-1"></div>
          <div class="deco-square square-2"></div>
          <div class="deco-square square-3"></div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <q-btn
            unelevated
            rounded
            size="xl"
            color="primary"
            icon="sports_score"
            label="Start Game"
            @click="preStart()"
            class="game-btn start-btn"
          >
            <q-tooltip>Begin your memory challenge!</q-tooltip>
          </q-btn>
          <q-btn
            outline
            rounded
            size="lg"
            color="secondary"
            icon="history"
            label="Game History"
            @click="showHistoryDialog = true"
            class="game-btn history-btn"
          >
            <q-tooltip>View your past games</q-tooltip>
          </q-btn>
        </div>

        <!-- Game Info Card -->
        <q-card flat bordered class="info-card">
          <q-card-section class="text-center">
            <div class="text-h6 text-primary">How to Play</div>
            <div class="text-body2 q-mt-sm">
              <q-icon name="visibility" color="accent" /> Memorize the highlighted squares<br />
              <q-icon name="visibility" color="accent" /> You have 2 seconds!<br />

              <q-icon name="touch_app" color="accent" /> Click only the valid squares(blue)<br />
              <q-icon name="timer" color="accent" /> Complete in 12 seconds<br />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Game Board (existing) -->
    <div v-show="gameStatusStore.isBoardShowned" class="game-board-container">
      <ResultsBox />
      <div
        class="mainDiv q-mt-xs"
        :class="{ ['grid-container' + columns]: true, cursorNotAllowed: itemsNotClickable }"
      >
        <div
          v-ripple
          :class="{
            ['smallDiv' + columns]: true,
            notClicked: !item.isClicked,
            badClicked: item.isClicked && !item.isValid,
            goodClicked: item.isClicked && item.isValid,
          }"
          class="relative-position q-m-a-xs"
          @click="itemClicked(item.id)"
          :key="item.id"
          v-for="item in rectangles"
        ></div>
      </div>
      <StatusBox :solved="countOfValidClicked" :total="countOfValid" />
    </div>

    <GameLostDialog v-model="lostDialog" @go-to-menu="goToMenu" @restart="startGame" />
    <GameWonDialog
      v-model="wonDialog"
      :columns="columns"
      @go-to-menu="goToMenu"
      @restart="startGame"
      @next-level="nextLevel"
    />
    <GameHistoryDialog v-model="showHistoryDialog" />
  </q-page>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import StatusBox from 'src/components/StatusBox.vue'
import ResultsBox from 'src/components/ResultsBox.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useTimer } from 'src/composables/timerComposable.js'
import { useGameBoard } from 'src/composables/useGameBoard.js'
import { gameResults } from 'src/gameResult.js'
import GameHistoryDialog from 'src/components/GameHistoryDialog.vue'
import GameWonDialog from 'src/components/GameWonDialog.vue'
import GameLostDialog from 'src/components/GameLostDialog.vue'
import { useQuasar } from 'quasar'
import { timeConstants, typeOfLost } from 'src/gameConstants.js'

const $q = useQuasar()

// eslint-disable-next-line no-unused-vars
const _timer = useTimer()

const gameStatusStore = useGameStatusStore()

// Initialize game board composable
const gameBoard = useGameBoard(gameStatusStore)
const { columns, rectangles, itemsNotClickable, countOfValidClicked, countOfValid } = gameBoard

// Dialog state
const lostDialog = ref(false)
const wonDialog = ref(false)
const isStartShowned = ref(true)
const showHistoryDialog = ref(false)

const preStart = () => {
  const lvl = gameStatusStore.round
  if (lvl === 1) {
    startGame()
  } else {
    $q.dialog({
      title: 'Confirm',
      message: `Your previous game is not finished. Do you want to continue from round ${lvl} or restart from round 1?`,
      persistent: true,
      ok: {
        label: 'Continue',
        flat: true,
      },
      cancel: {
        label: 'Restart',
        flat: true,
      },
    })
      .onOk(() => {
        startGame()
      })
      .onCancel(() => {
        gameStatusStore.$reset()
        startGame()
      })
      .onDismiss(() => {
        return
      })
  }
}

const startGame = () => {
  typeLost.value = null

  columns.value = gameBoard.calculateColumns(gameStatusStore.round)
  isStartShowned.value = false
  gameStatusStore.isBoardShowned = true
  gameBoard.assignRectangles()
  gameBoard.boardResultsShowOrHide(true)
  itemsNotClickable.value = true
  window.setTimeout(() => {
    gameBoard.boardResultsShowOrHide(false)
  }, timeConstants.PREVIEW_DURATION)
}

const nextLevel = () => {
  gameStatusStore.round++

  if (gameBoard.shouldAddColumns(gameStatusStore.round)) {
    columns.value++
  }
  startGame()
}

const goToMenu = () => {
  isStartShowned.value = true
  gameStatusStore.isBoardShowned = false
}

const itemClicked = (id) => {
  try {
    const result = gameBoard.handleItemClick(id)

    if (!result) {
      return
    }

    if (result.lost) {
      gameStatusStore.endGame(gameResults.LOSE)
      typeLost.value = typeOfLost.WRONG_CLICKED
      lostDialog.value = true
      return
    }

    if (result.won) {
      gameStatusStore.endGame(gameResults.WIN)
      wonDialog.value = true
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'An error occurred. Please refresh the page.',
    })
    console.error('Game error:', error)
  }
}
const typeLost = ref(null)
watchEffect(() => {
  let time = gameStatusStore.currentGameTime
  if (
    time === timeConstants.MAX_ALLOWED_TIME &&
    gameStatusStore.isBoardShowned &&
    gameStatusStore.gameInProgress
  ) {
    gameStatusStore.endGame(gameResults.LOSE)
    typeLost.value = typeOfLost.TIME_OUT
    lostDialog.value = true
  }
})

const checkIfLastGameWasExited = () => {
  gameStatusStore.isBoardShowned = false

  // Initialize the game status store
  if (gameStatusStore.gameInProgress) {
    gameStatusStore.endGame(gameResults.LOSE)
    $q.notify({
      type: 'negative',
      message: 'You exited the browser tab in the middle of a game. It has been counted as a loss.',
    })
  }
}
checkIfLastGameWasExited()
// Set the initial number of columns based on the round

defineOptions({
  name: 'IndexPage',
})
</script>
<style scoped>
.cursorNotAllowed {
  cursor: not-allowed;
}

.mainDiv {
  background-color: #ecc483;
  width: 90vmin;
  height: 90vmin;
  border: 2px;
}

.notClicked {
  transition: 1s;

  background-color: #259999;
}

.badClicked {
  transition: 1s;
  background-color: #d84848;
}

.goodClicked {
  transition: 1s;
  background-color: #599ff0;
}

.smallDiv3 {
  margin: 8px;
}

.smallDiv4 {
  margin: 7px;
}

.smallDiv5 {
  margin: 5px;
}

.smallDiv6 {
  margin: 4px;
}

.grid-container3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.grid-container4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.grid-container5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.grid-container6 {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
}

/* Main Menu Styles */
.game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.playing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Dark Mode Styles */
.body--dark .game-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.body--dark .playing-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.body--dark .info-card {
  background: rgba(30, 30, 45, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

.body--dark .deco-square {
  background: rgba(255, 255, 255, 0.05);
}

.game-board-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
}

.game-board-container .mainDiv {
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
}

.menu-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.game-hero {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 2;
}

/* Title Section */
.game-title-wrapper {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
}

.title-icon {
  animation: pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.game-title {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin: 1rem 0 0.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
  line-height: 1;
}

.game-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.game-btn {
  min-width: 250px;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.start-btn {
  padding: 1.2rem 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
}

.history-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

/* Info Card */
.info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.info-card .text-body2 {
  line-height: 2;
}

/* Decorative Squares */
.decorative-squares {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.deco-square {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
  animation: float 3.5s ease-in-out infinite;
}

.square-1 {
  top: 15%;
  left: 8%;
  animation-delay: 0s;
  width: 90px;
  height: 90px;
}

.square-2 {
  bottom: 20%;
  left: 15%;
  animation-delay: 1.2s;
  width: 70px;
  height: 70px;
}

.square-3 {
  top: 30%;
  right: 12%;
  animation-delay: 0.7s;
  width: 110px;
  height: 110px;
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(40px, -60px) rotate(5deg);
  }
  50% {
    transform: translate(0, -80px) rotate(10deg);
  }
  75% {
    transform: translate(-40px, -60px) rotate(5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

/* Responsive Design */
@media (max-width: 750px) {
  .game-title {
    font-size: 2.5rem;
  }

  .game-subtitle {
    font-size: 1rem;
  }

  .title-icon {
    font-size: 60px !important;
  }

  .action-buttons {
    padding: 0 1rem;
  }

  .game-btn {
    min-width: 100%;
  }

  .game-board-container {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .game-board-container .mainDiv {
    order: 1;
    width: 100%;
  }

  .game-board-container .results-card {
    order: 2;
    width: calc(50% - 0.25rem);
  }

  .game-board-container .status-card {
    order: 3;
    width: calc(50% - 0.25rem);
  }

  .playing-page {
    padding: 1rem;
  }

  .square-1 {
    width: 60px;
    height: 60px;
  }

  .square-2 {
    width: 50px;
    height: 50px;
  }

  .square-3 {
    width: 70px;
    height: 70px;
  }
}
</style>
