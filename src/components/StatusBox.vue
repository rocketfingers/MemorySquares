<template>
  <div v-show="anyGameEverStarted" class="status-box-inner">
    <q-chip class="q-mb-sm" color="purple" text-color="white" icon="casino">
      Round {{ gameStatusStore.round }}
    </q-chip>
    <q-circular-progress
      show-value
      font-size="12px"
      :value="percentageSolved"
      size="50px"
      :thickness="0.22"
      color="accent"
      track-color="grey-3"
      class="q-ma-md"
    >
      {{ percentageSolved }}%
    </q-circular-progress>
    Game:
    <q-chip color="purple" text-color="white" icon="alarm" :label="currentGameTime" />
    Total:
    <q-chip color="purple" text-color="white" icon="alarm" :label="gameStatusStore.totalGameTime" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { computed } from 'vue'

const gameStatusStore = useGameStatusStore()
const { anyGameEverStarted, currentGameTime } = storeToRefs(gameStatusStore)

const props = defineProps({ solved: Number, total: Number })

const percentageSolved = computed(() => {
  try {
    return ((props.solved / props.total) * 100).toFixed(0)
  } catch (error) {
    console.log('computed percentageSolved' + error)
    return 0
  }
})
</script>

<style lang="scss" scoped>
.status-box-inner {
  @media (max-width: 750px) {
    display: flex;
    align-items: center;
    justify-content: space-around;
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
