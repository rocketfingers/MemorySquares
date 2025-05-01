<template>
  <q-dialog v-model="dialogModel" persistent>
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
import { computed } from 'vue'

const emit = defineEmits(['go-to-menu', 'restart', 'next-level', 'update:modelValue'])
const props = defineProps({
  columns: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>
