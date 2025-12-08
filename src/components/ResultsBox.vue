<template>
  <div v-show="anyGameEverStarted" class="results-card">
    <div class="results-header">
      <q-icon name="leaderboard" size="24px" color="white" />
      <h3 class="results-title">Your Stats</h3>
    </div>

    <div class="stat-item">
      <div class="stat-icon-wrapper">
        <q-icon name="casino" size="28px" color="white" />
      </div>
      <div class="stat-content">
        <div class="stat-label">Max Round</div>
        <div class="stat-value">{{ maxRound }}</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon-wrapper">
        <q-icon name="alarm" size="28px" color="white" />
      </div>
      <div class="stat-content">
        <div class="stat-label">Avg Time</div>
        <div class="stat-value">{{ avgTime }}s</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon-wrapper success">
        <q-icon name="thumb_up" size="28px" color="white" />
      </div>
      <div class="stat-content">
        <div class="stat-label">Wins</div>
        <div class="stat-value success-text">{{ countWin }}</div>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-icon-wrapper error">
        <q-icon name="thumb_down" size="28px" color="white" />
      </div>
      <div class="stat-content">
        <div class="stat-label">Losses</div>
        <div class="stat-value error-text">{{ countLost }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useHistory } from 'src/composables/historyComposable'
import { gameResults } from 'src/gameResult'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { computed } from 'vue'

const historyComposable = useHistory()
historyComposable.subscribe()
let history = historyComposable.history

const maxRound = computed(() => {
  try {
    let roundsList = history.map((p) => p.round)
    return Math.max(...roundsList)
  } catch (error) {
    console.log('computed maxRound' + error)
    return 0
  }
})

const avgTime = computed(() => {
  try {
    let roundsList = history.map((p) => p.time)
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
    return history.filter((p) => p.result === result).length
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
.results-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
  animation: fadeInRight 0.6s ease-out;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.results-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.success {
  background: rgba(76, 175, 80, 0.3);
}

.stat-icon-wrapper.error {
  background: rgba(244, 67, 54, 0.3);
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.stat-value.success-text {
  color: #4caf50;
}

.stat-value.error-text {
  color: #f44336;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 750px) {
  .results-card {
    min-width: auto;
    width: 100%;
    padding: 0.75rem 0.5rem;
  }

  .results-header {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .results-title {
    font-size: 0.875rem;
  }

  .results-header q-icon {
    font-size: 20px;
  }

  .stat-item {
    padding: 0.4rem;
    margin-bottom: 0.4rem;
    gap: 0.5rem;
  }

  .stat-icon-wrapper {
    width: 28px;
    height: 28px;
  }

  .stat-icon-wrapper q-icon {
    font-size: 16px;
  }

  .stat-label {
    font-size: 0.6rem;
  }

  .stat-value {
    font-size: 1rem;
  }
}
</style>
