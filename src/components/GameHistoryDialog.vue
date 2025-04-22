<template>
  <div>
    <q-card style="min-width: 450px; max-width: 90vw">
      <q-card-section class="bg-accent text-white">
        <div class="text-h6">Game History</div>
      </q-card-section>
      <q-card-section>
        <q-table
          v-if="history.length > 0"
          :rows="history"
          :columns="columns"
          row-key="timestamp"
          flat
          dense
          :pagination="{ rowsPerPage: 10 }"
        />
        <div v-else class="text-grey text-center q-pa-md">No game history found.</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { useHistory } from 'src/composables/historyComposable'
import { gameResults } from 'src/gameResult'
import { ref } from 'vue'

const columns = [
  { name: 'round', label: 'Round', field: 'round', align: 'left' },
  { name: 'time', label: 'Game Time', field: (row) => row.time ?? row.gameTime, align: 'left' },
  {
    name: 'totalGameTime',
    label: 'Total Time',
    field: (row) => row.totalGameTime,
    align: 'left',
  },
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
let history = ref([])
// eslint-disable-next-line vue/no-ref-as-operand
history = useHistory().getGameHistory()
</script>
