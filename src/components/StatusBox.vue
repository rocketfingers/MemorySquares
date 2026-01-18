<template>
  <div v-show="anyGameEverStarted" class="status-card">
    <div class="status-header">
      <q-icon name="sports_score" size="24px" color="white" />
      <h3 class="status-title">Current Game</h3>
    </div>
    <div class="time-stats">
      <div class="time-item">
        <q-icon name="alarm" size="24px" color="white" />
        <div class="time-content">
          <div class="time-label">Round Time</div>
          <div class="time-value">
            <div :class="{ 'text-red': timeColorShouldBeRed }">
              {{ currentGameTime }}
            </div>
            /{{ timeConstants.MAX_ALLOWED_TIME }}s
          </div>
        </div>
      </div>

      <div class="progress-section">
        <q-circular-progress
          show-value
          font-size="14px"
          :value="percentageSolved"
          size="80px"
          :thickness="0.15"
          color="white"
          track-color="rgba(255, 255, 255, 0.2)"
          class="progress-circle"
        >
          <div class="progress-text">{{ percentageSolved }}%</div>
        </q-circular-progress>
        <div class="progress-label">Progress</div>
      </div>

      <div class="round-display">
        <q-icon name="casino" size="36px" color="white" />
        <div class="round-content">
          <div class="round-label">Round</div>
          <div class="round-value">{{ gameStatusStore.round }}</div>
        </div>
      </div>

      <div v-show="!$q.platform.is.mobile" class="time-item">
        <q-icon name="schedule" size="24px" color="white" />
        <div class="time-content">
          <div class="time-label">Total Time</div>
          <div class="time-value">{{ gameStatusStore.totalGameTime }}s</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { computed } from 'vue'
import { timeConstants } from 'src/gameConstants'

const gameStatusStore = useGameStatusStore()
const { anyGameEverStarted, currentGameTime } = storeToRefs(gameStatusStore)

const props = defineProps({ solved: Number, total: Number })

const timeColorShouldBeRed = computed(() => {
  return currentGameTime.value >= timeConstants.MAX_ALLOWED_TIME * 0.8
})

const percentageSolved = computed(() => {
  try {
    return Number.parseInt(((props.solved / props.total) * 100).toFixed(0))
  } catch (error) {
    console.log('computed percentageSolved' + error)
    return 0
  }
})
</script>

<style lang="scss" scoped>
.status-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 280px;
  animation: fadeInLeft 0.6s ease-out;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.status-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.round-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-radius: 16px;
}

.round-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.round-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.round-value {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.progress-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
}

.progress-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-circle {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.progress-text {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.time-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.time-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-5px);
}

.time-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-value {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 750px) {
  .status-card {
    min-width: auto;
    width: 100%;
    padding: 1rem 0.75rem;
  }

  .status-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .status-title {
    font-size: 1rem;
  }

  .status-header q-icon {
    font-size: 24px;
  }

  .round-display {
    padding: 0.25rem;
  }

  .round-label {
    font-size: 0.65rem;
  }

  .round-value {
    font-size: 1.25rem;
  }

  .round-display q-icon {
    font-size: 20px;
  }

  .progress-section {
    padding: 0.5rem 0;
  }

  .progress-label {
    font-size: 0.65rem;
  }

  .progress-circle {
    font-size: 60px !important;
  }

  .progress-text {
    font-size: 0.9rem;
  }

  .time-item {
    padding: 0.5rem;
  }

  .time-item q-icon {
    font-size: 20px;
  }

  .time-label {
    font-size: 0.65rem;
  }

  .time-value {
    font-size: 0.9rem;
  }
}
</style>
