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
        <div v-if="user" class="row items-center q-mr-md">
          <q-avatar size="md" class="q-mr-sm">
            <img :src="user.photoURL" />
          </q-avatar>
          <span>{{ user.displayName }}</span>
        </div>
        <div v-show="!gameStatusStore.isBoardShowned">
          <q-btn v-if="!user" @click="login" flat round dense icon="login" />
          <q-btn v-if="user" @click="logout" flat round dense icon="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { auth, LoginProm } from '../boot/firebase'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useCurrentUser } from 'vuefire'
let user = useCurrentUser()
const gameStatusStore = useGameStatusStore()

const login = async () => {
  await LoginProm()
  useGameStatusStore().$reset
  user = useCurrentUser()
}

const logout = async () => {
  await auth.signOut()
  useGameStatusStore().$reset
  user = useCurrentUser()
}

const title = ref('Memory Squares')

defineOptions({
  name: 'MainLayout',
})
</script>
