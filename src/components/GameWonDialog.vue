<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Game is won!!!</span>
        <q-icon size="xl" name="sentiment_very_satisfied" color="positive" />
      </q-card-section>
      <q-card-section>
        Do you want to go to next level, restart this one or stop current game?
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
          label="Restart"
          @click="$emit('restart')"
          color="primary"
          v-close-popup
        />
        <q-btn
          icon="arrow_forward"
          v-show="columns < 7"
          flat
          label="Next level"
          @click="$emit('next-level')"
          color="primary"
          v-close-popup
        />
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
