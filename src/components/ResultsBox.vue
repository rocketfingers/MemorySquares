<template>
  <div v-show="anyGameEverStarted" class="status-box-inner shadow-4 q-mx-xs">
    <q-chip class="q-mb-sm" color="accent" text-color="white" icon="casino">
      Max round {{ maxRound }}
    </q-chip>
    <q-chip class="q-mb-sm" color="accent" text-color="white" icon="alarm">
      Avg {{ avgTime }}
    </q-chip>
    <q-chip class="q-mb-sm" color="accent" text-color="white" icon="thumb_up">
      Win {{ countWin }}
    </q-chip>
    <q-chip class="q-mb-sm" color="accent" text-color="white" icon="thumb_down">
      Lost {{ countLost }}
    </q-chip>
  </div>
</template>

<script setup>
import { ref } from 'firebase/storage'
import { storeToRefs } from 'pinia'
import { useHistory } from 'src/composables/historyComposable'
import { gameResults } from 'src/gameResult'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { computed } from 'vue'
let history = ref([])

history = useHistory().getGameHistory()

const maxRound = computed(() => {
  try {
    let roundsList = history.value.map((p) => p.round)
    return Math.max(...roundsList)
  } catch (error) {
    console.log('computed maxRound' + error)
    return 0
  }
})

const avgTime = computed(() => {
  try {
    let roundsList = history.value.map((p) => p.time)
    if (roundsList.length === 0) return 0 // Handle empty array case
    const sum = roundsList.reduce((acc, val) => acc + val, 0)
    return (sum / roundsList.length).toFixed(1)
  } catch (error) {
    console.log('computed maxRound' + error)
    return 0
  }
})

const getCountByResult = (result) => {
  try {
    return history.value.filter((p) => p.result === result).length
  } catch (error) {
    console.log('computed count' + error)
    return 0
  }
}

const countWin = computed(() => getCountByResult(gameResults.WIN))
const countLost = computed(() => getCountByResult(gameResults.LOSE))

const gameStatusStore = useGameStatusStore()
const { anyGameEverStarted } = storeToRefs(gameStatusStore)
</script>

<style lang="scss" scoped>
.status-box-inner {
  @media (max-width: 750px) {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  @media (min-width: 751px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
