<template>
  <q-dialog v-model="dialogModel" persistent backdrop-filter="blur(4px)">
    <q-card class="game-dialog">
      <q-card-section
        class="column items-center justify-center q-pa-lg text-white bg-gradient-lost"
      >
        <q-icon size="4rem" name="heart_broken" class="q-mb-md shake-effect" />
        <div class="text-h4 text-weight-bold text-center">Game Over</div>
        <div class="text-subtitle1 q-mt-sm opacity-80">Don't give up!</div>
      </q-card-section>

      <q-card-section class="q-pa-md text-center text-grey-8">
        <div class="text-h6 q-mb-sm">
          {{ props.reason === typeOfLost.TIME_OUT ? "Time's Up!" : 'Wrong Move' }}
        </div>
        <p class="q-mt-none">
          <span v-if="props.reason === typeOfLost.WRONG_CLICKED">
            Oops! That wasn't the right square.
          </span>
          <span v-if="props.reason === typeOfLost.TIME_OUT">
            You ran out of time to find the squares.
          </span>
          Give it another shot?
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg q-px-lg column q-gutter-md">
        <q-btn
          icon="refresh"
          push
          label="Try Again"
          @click="$emit('restart')"
          color="negative"
          class="full-width text-weight-bold text-lg"
          size="lg"
          v-close-popup
        />
        <q-btn
          icon="home"
          flat
          label="Return to Menu"
          @click="$emit('go-to-menu')"
          color="grey-7"
          class="full-width"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.game-dialog {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  background: white;
}

.bg-gradient-lost {
  background: linear-gradient(135deg, #ff512f 0%, #dd2476 100%);
}

.shake-effect {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.text-lg {
  font-size: 1.1rem;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>

<script setup>
import { typeOfLost } from 'src/gameConstants'

const props = defineProps({
  reason: {
    type: Number,
    default: typeOfLost.WRONG_CLICKED,
  },
})
const dialogModel = defineModel()
defineEmits(['go-to-menu', 'restart'])

defineOptions({
  name: 'GameLostDialog',
})
</script>
