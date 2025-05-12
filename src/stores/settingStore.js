import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settingStore', {
  state: () => ({
    dontShowLoginPromptAgain: false,
    theme: 'Light',
  }),
  persist: true,
  actions: {},
})
