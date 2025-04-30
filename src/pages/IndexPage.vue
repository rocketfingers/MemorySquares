<template>
  <q-page class="flex flex-center">
    <div class="column items-center q-gutter-y-md">
      <q-btn
        color="primary"
        icon="sports_score"
        label="Start"
        v-show="isStartShowned"
        @click="startGame()"
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
    <ResultsBox v-show="isBoardShowned" />
    <div
      v-show="isBoardShowned"
      class="mainDiv q-mt-xs"
      :class="{ ['grid-container' + columns]: true }"
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
    <StatusBox v-show="isBoardShowned" :solved="countOfValidClicked" :total="countOfValid" />

    <q-dialog v-model="lostDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Game is lost</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Unfortunately, you clicked wrong square. You can restart level or go to menu.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            icon="home"
            flat
            label="Go to menu"
            @click="goToMenu()"
            color="primary"
            v-close-popup
          />

          <q-btn
            icon="refresh"
            flat
            label="Restart game"
            @click="startGame()"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="wonDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="refresh" color="primary" text-color="white" />
          <span class="q-ml-sm">Game is won!!!</span>
        </q-card-section>
        <q-card-section>
          Do you want to go to next level, restart this one or stop current game?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            icon="home"
            flat
            label="Go to menu"
            @click="goToMenu()"
            color="primary"
            v-close-popup
          />
          <q-btn
            icon="refresh"
            flat
            label="Restart"
            @click="startGame()"
            color="primary"
            v-close-popup
          />
          <q-btn
            icon="arrow_forward"
            v-show="columns < 7"
            flat
            label="Next level"
            @click="nextLevel()"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Game History Dialog -->
    <q-dialog v-if="showHistoryDialog" v-model="showHistoryDialog">
      <GameHistoryDialog />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusBox from 'src/components/StatusBox.vue'
import ResultsBox from 'src/components/ResultsBox.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useTimer } from '../composables/timerComposable.js'
import { gameResults } from 'src/gameResult.js'
import GameHistoryDialog from 'src/components/GameHistoryDialog.vue' // <-- Add this import

// eslint-disable-next-line no-unused-vars
const timer = useTimer()

const gameStatusStore = useGameStatusStore()

// dialogs
const lostDialog = ref(false)
const wonDialog = ref(false)
const isStartShowned = ref(true)
const isBoardShowned = ref(false)
const showHistoryDialog = ref(false) // <-- Add this ref

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

const startGame = () => {
  isStartShowned.value = false
  isBoardShowned.value = true
  assignRectangles()
  boardResultsShowOrHide(true)
  itemsNotClickable.value = true
  window.setTimeout(() => {
    boardResultsShowOrHide(false)
  }, 2000)
}
const nextLevel = () => {
  if (gameStatusStore.round % 3 === 1 && gameStatusStore.round != 1) {
    columns.value++
  }
  startGame()
}

const goToMenu = () => {
  isStartShowned.value = true
  isBoardShowned.value = false
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
      lostDialog.value = true
      return
    }
    console.log('Item' + id + ' is clicked')
    if (isGameWon.value) {
      gameStatusStore.endGame(gameResults.WIN)
      gameStatusStore.round++
      wonDialog.value = true
    }
  } catch (error) {
    console.log(error)
  }
}

defineOptions({
  name: 'IndexPage',
})
</script>
<style scoped>
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
