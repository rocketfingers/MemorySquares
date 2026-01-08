import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSettingStore } from 'src/stores/settingStore.js'

describe('settingStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('Initial State', () => {
    it('has correct default state', () => {
      const store = useSettingStore()

      expect(store.dontShowLoginPromptAgain).toBe(false)
      expect(store.theme).toBe('Light')
    })
  })

  describe('Theme State', () => {
    it('can set theme to Dark', () => {
      const store = useSettingStore()

      store.theme = 'Dark'

      expect(store.theme).toBe('Dark')
    })

    it('can set theme to Light', () => {
      const store = useSettingStore()
      store.theme = 'Dark'

      store.theme = 'Light'

      expect(store.theme).toBe('Light')
    })

    it('toggles between Light and Dark', () => {
      const store = useSettingStore()

      expect(store.theme).toBe('Light')

      store.theme = 'Dark'
      expect(store.theme).toBe('Dark')

      store.theme = 'Light'
      expect(store.theme).toBe('Light')
    })
  })

  describe('Login Prompt State', () => {
    it('can set dontShowLoginPromptAgain to true', () => {
      const store = useSettingStore()

      store.dontShowLoginPromptAgain = true

      expect(store.dontShowLoginPromptAgain).toBe(true)
    })

    it('can set dontShowLoginPromptAgain to false', () => {
      const store = useSettingStore()
      store.dontShowLoginPromptAgain = true

      store.dontShowLoginPromptAgain = false

      expect(store.dontShowLoginPromptAgain).toBe(false)
    })

    it('persists dontShowLoginPromptAgain state', () => {
      const store = useSettingStore()

      store.dontShowLoginPromptAgain = true

      expect(store.dontShowLoginPromptAgain).toBe(true)
    })
  })

  describe('State Persistence', () => {
    it('maintains multiple state changes', () => {
      const store = useSettingStore()

      store.theme = 'Dark'
      store.dontShowLoginPromptAgain = true

      expect(store.theme).toBe('Dark')
      expect(store.dontShowLoginPromptAgain).toBe(true)
    })
  })
})
