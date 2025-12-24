<template>
  <q-page class="playing-page">
    <!-- Game Board -->
    <div class="game-board-container">
      <ResultsBox />
      <div
        class="mainDiv q-mt-xs"
        :class="{
          ['grid-container' + columns]: true,
          cursorNotAllowed: itemsNotClickable,
          rotated: isBoardRotated,
        }"
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
  </q-page>
</template>

<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusBox from 'src/components/StatusBox.vue'
import ResultsBox from 'src/components/ResultsBox.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useTimer } from 'src/composables/timerComposable.js'
import { useGameBoard } from 'src/composables/useGameBoard.js'
import { gameResults } from 'src/gameResult.js'
import GameWonDialog from 'src/components/GameWonDialog.vue'
import GameLostDialog from 'src/components/GameLostDialog.vue'
import { useQuasar } from 'quasar'
import { timeConstants, typeOfLost } from 'src/gameConstants.js'

const $q = useQuasar()
const router = useRouter()

// eslint-disable-next-line no-unused-vars
const _timer = useTimer()

const gameStatusStore = useGameStatusStore()

// Initialize game board composable
const gameBoard = useGameBoard(gameStatusStore)
const { columns, rectangles, itemsNotClickable, countOfValidClicked, countOfValid } = gameBoard

// Dialog state
const lostDialog = ref(false)
const wonDialog = ref(false)
const isBoardRotated = ref(false)

const startGame = () => {
  typeLost.value = null
  isBoardRotated.value = false
  columns.value = gameBoard.calculateColumns(gameStatusStore.round)
  gameStatusStore.isBoardShowned = true
  gameBoard.assignRectangles()
  gameBoard.boardResultsShowOrHide(true)
  itemsNotClickable.value = true
  window.setTimeout(() => {
    gameBoard.boardResultsShowOrHide(false)

    // Rotate board by 90 degrees at round 3
    if (gameStatusStore.round === 3 || gameStatusStore.round === 6) {
      isBoardRotated.value = true
    }
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
  gameStatusStore.isBoardShowned = false
  router.push('/')
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

// Start the game when page is mounted
onMounted(() => {
  startGame()
})

defineOptions({
  name: 'GamePage',
})
</script>

<style scoped>
.cursorNotAllowed {
  cursor: not-allowed;
}

.mainDiv {
  background-color: #ecc483;
  width: 85vmin;
  height: 85vmin;
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

/* Board rotation animation */
.mainDiv {
  transition: transform 0.5s ease-in-out;
}

.mainDiv.rotated {
  transform: rotate(90deg);
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
.body--dark .playing-page {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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

/* Responsive Design */
@media (max-width: 750px) {
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
}
</style>
