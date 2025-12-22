<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          {{ title }}
        </q-toolbar-title>
        <q-btn
          class="q-mr-sm"
          v-show="$route.path !== '/'"
          round
          color="accent"
          icon="home"
          @click="goToMenu"
        />

        <div v-if="user" class="row items-center q-mr-md">
          <q-btn flat round class="q-mr-sm">
            <q-avatar size="md" class="q-mr-sm">
              <img :src="user.photoURL" />
            </q-avatar>
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <q-toggle
                    size="lg"
                    checked-icon="light_mode"
                    color="accent"
                    unchecked-icon="dark_mode"
                    false-value="Light"
                    true-value="Dark"
                    v-model="theme"
                    label="Theme:"
                    left-label
                  />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img :src="user.photoURL" />
                  </q-avatar>

                  <div class="text-subtitle1 no-wrap q-mt-md q-mb-xs">{{ user.displayName }}</div>

                  <q-btn
                    :disable="gameStatusStore.isBoardShowned"
                    color="primary"
                    label="Logout"
                    @click="logout"
                    push
                    size="sm"
                    v-close-popup
                  >
                    <q-tooltip v-if="gameStatusStore.isBoardShowned">
                      You cannot logout during the game.
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    :disable="gameStatusStore.isBoardShowned"
                    color="negative"
                    label="Delete Account"
                    @click="deleteAccount"
                    push
                    class="q-mt-sm"
                    size="sm"
                    v-close-popup
                  >
                    <q-tooltip v-if="gameStatusStore.isBoardShowned">
                      You cannot delete account during the game.
                    </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
        <div>
          <q-toggle
            size="lg"
            v-if="!user"
            checked-icon="light_mode"
            color="accent"
            unchecked-icon="dark_mode"
            class="q-mr-md"
            false-value="Light"
            true-value="Dark"
            v-model="theme"
            label="Theme:"
            left-label
          />
          <q-btn v-if="!user" color="accent" @click="login" label="Login" icon="login" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { auth, LoginProm, deleteAccountAfterWarning } from '../boot/firebase'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useSettingStore } from 'src/stores/settingStore'
import { getCurrentUser, useCurrentUser } from 'vuefire'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { gameResults } from 'src/gameResult.js'
const router = useRouter()

let user = useCurrentUser()
const settingStore = useSettingStore()
const { dontShowLoginPromptAgain, theme } = storeToRefs(settingStore)
const gameStatusStore = useGameStatusStore()
const $q = useQuasar()

watch(
  theme,
  (newTheme) => {
    if (newTheme === 'Dark') {
      $q.dark.set(true)
    } else {
      $q.dark.set(false)
    }
  },
  {
    // immediate: true,
    deep: true,
  },
)

const askToLogin = () => {
  $q.notify({
    progress: true,
    message: 'Please login to store your progress on multiple devices',
    icon: 'arrow_forward',
    position: 'top',
    color: 'accent',
    multiLine: true,
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    actions: [
      {
        label: "Don't show again",
        color: 'yellow',
        handler: () => {
          dontShowLoginPromptAgain.value = true
        },
      },
    ],
  })
}
onMounted(async () => {
  if (theme.value === 'Dark') {
    $q.dark.set(true)
  } else {
    $q.dark.set(false)
  }
  const currentUser = await getCurrentUser()
  if (!currentUser && !dontShowLoginPromptAgain.value) {
    askToLogin()
  }
})

const deleteAccount = async () => {
  $q.dialog({
    title: 'Delete Account',
    message: 'Are you sure you want to delete your account? This action cannot be undone.',
    cardClass: 'game-dialog-card',
    persistent: true,
    ok: {
      label: 'Delete Forever',
      color: 'negative',
      push: true,
      icon: 'delete_forever',
    },
    cancel: {
      label: 'Cancel',
      color: 'primary',
      flat: true,
      icon: 'close',
    },
  }).onOk(async () => {
    await deleteAccountAfterWarning()
      .then(() => {
        $q.notify({
          message: 'Account deleted successfully',
          color: 'green',
          icon: 'check_circle',
        })
      })
      .catch((error) => {
        $q.notify({
          message: 'Error deleting account: ' + error.message,
          color: 'red',
          icon: 'error',
        })
      })
  })
}

const login = async () => {
  await LoginProm()
  useGameStatusStore().$reset()
  user = useCurrentUser()
}

const logout = async () => {
  $q.dialog({
    title: 'Logout',
    message: 'Are you sure you want to log out?',
    cardClass: 'game-dialog-card',
    persistent: true,
    ok: {
      label: 'Logout',
      color: 'primary',
      push: true,
      icon: 'logout',
    },
    cancel: {
      label: 'Stay',
      color: 'grey-7',
      flat: true,
      icon: 'close',
    },
  }).onOk(async () => {
    await auth.signOut()
    useGameStatusStore().$reset()
    user = useCurrentUser()
    $q.notify({
      message: 'Logged out successfully',
      color: 'green',
      icon: 'check_circle',
    })
  })
}

const title = ref('Memory Squares')

const goToMenu = () => {
  $q.dialog({
    title: 'Return to Menu?',
    message: 'Your current game will be counted as a loss. Are you sure?',
    cardClass: 'game-dialog-card',
    persistent: true,
    ok: {
      label: 'Quit Game',
      color: 'negative',
      push: true,
      icon: 'exit_to_app',
    },
    cancel: {
      label: 'Keep Playing',
      color: 'primary',
      flat: true,
      icon: 'play_arrow',
    },
  }).onOk(() => {
    gameStatusStore.isBoardShowned = false
    gameStatusStore.endGame(gameResults.LOSE)

    router.push('/')
  })
}

defineOptions({
  name: 'MainLayout',
})
</script>
