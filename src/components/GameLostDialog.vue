<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="text-h6">Game is lost</div>
          <q-icon size="xl" name="heart_broken" color="negative" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="props.reason === typeOfLost.WRONG_CLICKED">
          Unfortunately, you clicked wrong square. You can restart level or go to menu.
        </div>
        <div v-if="props.reason === typeOfLost.TIME_OUT">Unfortunately, you run out of time.</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          icon="home"
          flat
          label="Go to menu"
          @click="$emit('go-to-menu')"
          color="primary"
          v-close-popup
        />

        <q-btn
          icon="refresh"
          flat
          label="Restart game"
          @click="$emit('restart')"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

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
