<template>
  <q-dialog v-model="dialogModel">
    <q-card style="min-width: 450px; max-width: 95vw">
      <q-card-section class="bg-accent text-white">
        <div class="text-h6">Game History</div>
      </q-card-section>
      <q-card-section>
        <div class="sizeMobile">
          <div v-if="history.length > 0">
            <q-table
              :rows="history"
              :columns="columns"
              row-key="timestamp"
              flat
              dense
              hide-bottom
              v-model:pagination="pagination"
            />
            <div v-if="pagesNumber > 1" class="q-mt-xs">
              <q-pagination v-model="pagination.page" color="grey-8" :max="pagesNumber" size="sm" />
            </div>
          </div>

          <div v-else class="text-grey text-center q-pa-md">No game history found.</div>
        </div>
      </q-card-section>
      <q-card-actions align="left">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useHistory } from 'src/composables/historyComposable'
import { gameResults } from 'src/gameResult'
import { computed, ref } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const columns = [
  { name: 'round', label: 'Round', field: 'round', align: 'left' },
  { name: 'time', label: 'Time(s)', field: (row) => row.time ?? row.gameTime, align: 'left' },
  {
    name: 'result',
    label: 'Result',
    field: (row) => (row.result == gameResults.LOSE ? 'Lose' : 'Win'),
    align: 'left',
  },
  {
    name: 'date',
    label: 'Finished',
    field: (row) =>
      row.timestamp
        ? new Date(new Date(row.timestamp.seconds * 1000)).toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
    align: 'left',
  },
]

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  // rowsNumber: xx if getting data from a server
})
const pagesNumber = computed(() => Math.ceil(history.value.length / pagination.value.rowsPerPage))

let history = ref([])
// eslint-disable-next-line vue/no-ref-as-operand
history = useHistory().getGameHistory()
</script>
<style scoped>
@media (max-width: 750px) {
  .sizeMobile {
    width: 95vw;
  }
}
</style>
