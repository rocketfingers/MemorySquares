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
import { computed, ref, watchEffect } from 'vue'
import StatusBox from 'src/components/StatusBox.vue'
import ResultsBox from 'src/components/ResultsBox.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useTimer } from '../composables/timerComposable.js'
import { gameResults } from 'src/gameResult.js'
import GameHistoryDialog from 'src/components/GameHistoryDialog.vue'
import GameWonDialog from 'src/components/GameWonDialog.vue'
import GameLostDialog from 'src/components/GameLostDialog.vue'
import { useQuasar } from 'quasar'
import { timeConstants, typeOfLost } from 'src/gameConstants.js'

const $q = useQuasar()

// eslint-disable-next-line no-unused-vars
const timer = useTimer()

const gameStatusStore = useGameStatusStore()

// dialogs
const lostDialog = ref(false)
const wonDialog = ref(false)
const isStartShowned = ref(true)
const showHistoryDialog = ref(false)

const columns = ref(3)

const countOfSquares = computed(() => {
  return columns.value * columns.value
})
const rectangles = ref([])
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
const itemsNotClickable = ref(true)

const assignRectangles = () => {
  rectangles.value = []

  let lvlAdjustemend = gameStatusStore.round % 3 === 0 ? 3 : gameStatusStore.round % 3

  // Create initial rectangles
  for (let i = 0; i < countOfSquares.value; i++) {
    rectangles.value.push({
      id: i,
      isValid: Math.random() < 0.15 + 0.15 * lvlAdjustemend,
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

const boardResultsShowOrHide = (shown) => {
  rectangles.value.forEach(function (p) {
    p.isClicked = shown
  })
  if (shown === false) {
    itemsNotClickable.value = false
    gameStatusStore.startGame()
  }
}

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

  // Set the initial number of columns based on the round
  columns.value = 3
  for (let i = 1; i <= gameStatusStore.round; i++) {
    if (i % 3 === 1 && i !== 1) {
      columns.value++
    }
  }
  isStartShowned.value = false
  useGameStatusStore().isBoardShowned = true
  assignRectangles()
  boardResultsShowOrHide(true)
  itemsNotClickable.value = true
  window.setTimeout(() => {
    boardResultsShowOrHide(false)
  }, 2000)
}

const nextLevel = () => {
  gameStatusStore.round++

  if (gameStatusStore.round % 3 === 1 && gameStatusStore.round != 1) {
    columns.value++
  }
  startGame()
}

const goToMenu = () => {
  isStartShowned.value = true
  useGameStatusStore().isBoardShowned = false
}

const itemClicked = (id) => {
  try {
    if (itemsNotClickable.value) {
      return
    }
    const item = rectangles.value.filter((p) => p.id === id)[0]
    item.isClicked = true

    if (isGameLost.value) {
      gameStatusStore.endGame(gameResults.LOSE)
      typeLost.value = typeOfLost.WRONG_CLICKED
      lostDialog.value = true
      return
    }
    console.log('Item' + id + ' is clicked')
    if (isGameWon.value) {
      gameStatusStore.endGame(gameResults.WIN)
      wonDialog.value = true
    }
  } catch (error) {
    console.log(error)
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
      message: 'Your exit browser tab in the middle of game. It is count as lose.',
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
