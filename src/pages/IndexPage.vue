<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-y-md">
      <q-btn
        color="primary"
        icon="sports_score"
        label="Start"
        v-show="isStartShowned"
        @click="preStart()"
        class="fixed-width-btn"
      />
      <q-btn
        color="secondary"
        icon="history"
        label="Game History"
        v-show="isStartShowned"
        @click="showHistoryDialog = true"
        class="fixed-width-btn"
      />
    </div>
    <ResultsBox v-show="gameStatusStore.isBoardShowned" />
    <div
      v-show="gameStatusStore.isBoardShowned"
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
    <StatusBox
      v-show="gameStatusStore.isBoardShowned"
      :solved="countOfValidClicked"
      :total="countOfValid"
    />

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

/* .grid-container {
  display: inline-grid;
} */
</style>
