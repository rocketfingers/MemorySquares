<template>
  <q-dialog v-model="dialogModel" persistent backdrop-filter="blur(4px)">
    <q-card class="game-dialog">
      <q-card-section class="column items-center justify-center q-pa-lg text-white bg-gradient">
        <q-icon size="4rem" name="emoji_events" class="q-mb-md shine-effect" />
        <div class="text-h4 text-weight-bold text-center">Victory!</div>
        <div class="text-subtitle1 q-mt-sm opacity-80">Level Complete</div>
      </q-card-section>

      <q-card-section class="q-pa-md text-center text-grey-8">
        <div class="text-h6">Excellent work!</div>
        <p class="q-mt-sm">
          You've successfully cleared the board. What would you like to do next?
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg q-px-lg column q-gutter-md">
        <q-btn
          v-if="columns < 7"
          icon="arrow_forward"
          push
          label="Next Level"
          @click="$emit('next-level')"
          color="secondary"
          class="full-width text-weight-bold text-lg"
          size="lg"
          v-close-popup
        />
        <div class="row full-width q-gutter-sm justify-center">
          <q-btn
            icon="refresh"
            outline
            label="Restart"
            @click="$emit('restart')"
            color="primary"
            class="col-grow"
            v-close-popup
          />
          <q-btn
            icon="home"
            flat
            label="Menu"
            @click="$emit('go-to-menu')"
            color="grey-7"
            class="col-auto"
            v-close-popup
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
defineEmits(['go-to-menu', 'restart', 'next-level'])
defineProps({
  columns: {
    type: Number,
    required: true,
  },
})
const dialogModel = defineModel()
</script>

<style scoped>
.game-dialog {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  background: white;
}

.bg-gradient {
  background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%);
}

.shine-effect {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  animation: float 3s ease-in-out infinite;
}

.text-lg {
  font-size: 1.1rem;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
