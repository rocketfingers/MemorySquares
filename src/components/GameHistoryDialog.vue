<template>
  <div>
    <q-dialog v-model="dialogModel" backdrop-filter="blur(4px)">
      <q-card class="game-dialog">
        <q-card-section class="bg-gradient text-white q-pa-md row items-center justify-between">
          <div class="text-h5 text-weight-bold row items-center">
            <q-icon name="history" class="q-mr-sm" size="sm" />
            Game History
          </div>
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            class="text-white op-80 hover-op-100"
          />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div class="sizeMobile">
            <div v-if="history.length > 0">
              <q-table
                :rows="history"
                :columns="columns"
                row-key="timestamp"
                flat
                :pagination="{ rowsPerPage: 7 }"
                class="history-table"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      class="text-weight-bold text-primary"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
                <template v-slot:body-cell-result="props">
                  <q-td :props="props">
                    <q-chip
                      :color="props.row.result == gameResults.LOSE ? 'red-1' : 'green-1'"
                      :text-color="props.row.result == gameResults.LOSE ? 'negative' : 'positive'"
                      size="sm"
                      class="text-weight-bold"
                    >
                      {{ props.row.result == gameResults.LOSE ? 'Loss' : 'Win' }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </div>

            <div v-else class="column items-center justify-center q-pa-xl text-grey-6">
              <q-icon name="history_toggle_off" size="4rem" class="q-mb-md opacity-50" />
              <div class="text-h6">No games played yet</div>
              <div class="text-caption">Complete a level to see your history</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1" v-if="history.length > 0">
          <q-btn
            icon="delete_outline"
            label="Clear History"
            flat
            color="negative"
            class="q-px-md"
            @click="clearHistory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.game-dialog {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 500px;
  max-width: 95vw;
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.op-80 {
  opacity: 0.8;
}
.hover-op-100:hover {
  opacity: 1;
}
.opacity-50 {
  opacity: 0.5;
}

/* Custom Scrollbar for table if needed */
.history-table :deep(.q-table__container) {
  background: white;
}

@media (max-width: 750px) {
  .sizeMobile {
    width: 95vw;
  }
}
</style>

<script setup>
import { useQuasar } from 'quasar'
import { useHistory } from 'src/composables/historyComposable'
import { gameResults } from 'src/gameResult'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
// import { computed, ref } from 'vue'

const dialogModel = defineModel()
const $q = useQuasar()
const gameStatusStore = useGameStatusStore()
const historyComposable = useHistory()
historyComposable.subscribe()
const { history } = useHistory()

const clearHistory = async () => {
  $q.dialog({
    title: 'Clear History',
    message: 'Are you sure you want to wipe all your records? This cannot be undone.',
    cardClass: 'game-dialog-card',
    persistent: true,
    ok: {
      label: 'Clear All',
      color: 'negative',
      push: true,
      icon: 'delete_sweep',
    },
    cancel: {
      label: 'Keep',
      color: 'primary',
      flat: true,
      icon: 'close',
    },
  }).onOk(async () => {
    gameStatusStore.$reset()
    await historyComposable.clearGameHistory()
  })
}

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

// Pagination handled by q-table internally or via props
/*
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
})
const pagesNumber = computed(() => Math.ceil(history.length / pagination.value.rowsPerPage))
*/
</script>
<style scoped>
@media (max-width: 750px) {
  .sizeMobile {
    width: 95vw;
  }
}
</style>
