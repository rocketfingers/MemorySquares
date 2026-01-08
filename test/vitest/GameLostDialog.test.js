import { describe, it, expect, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import GameLostDialog from 'src/components/GameLostDialog.vue'
import { typeOfLost } from 'src/gameConstants'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

describe('GameLostDialog.vue', () => {
  let pinia

  beforeEach(() => {
    installQuasarPlugin()
    pinia = createPinia()
  })

  describe('Rendering', () => {
    it('renders the component', () => {
      const wrapper = shallowMount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QDialog' }).exists()).toBe(true)
    })

    it('contains Game Over title in template', async () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const html = portalWrapper.html()
      expect(html).toContain('Game Over')
    })

    it('contains encouragement subtitle in template', async () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const html = portalWrapper.html()
      expect(html).toContain("Don't give up!")
    })

    it('displays broken heart icon', async () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const icons = portalWrapper.findAllComponents({ name: 'QIcon' })
      const heartIcon = icons.find((icon) => icon.props('name') === 'heart_broken')
      expect(heartIcon).toBeDefined()
    })
  })

  describe('Props', () => {
    it('accepts reason prop', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.TIME_OUT,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.props('reason')).toBe(typeOfLost.TIME_OUT)
    })

    it('has default reason of WRONG_CLICKED', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.props('reason')).toBe(typeOfLost.WRONG_CLICKED)
    })

    it('reason prop type is Number', () => {
      const reason = GameLostDialog.props.reason
      expect(reason.type).toBe(Number)
    })
  })

  describe('Loss Reason Messages - Wrong Click', () => {
    it('has WRONG_CLICKED reason prop set correctly', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.props('reason')).toBe(typeOfLost.WRONG_CLICKED)
      expect(wrapper.vm.$props.reason).toBe(typeOfLost.WRONG_CLICKED)
    })

    it('uses correct reason constant for wrong click', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      // Test that the reason matches the WRONG_CLICKED constant
      expect(wrapper.vm.$props.reason).toBe(0)
    })
  })

  describe('Loss Reason Messages - Timeout', () => {
    it('has TIME_OUT reason prop set correctly', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.TIME_OUT,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.props('reason')).toBe(typeOfLost.TIME_OUT)
      expect(wrapper.vm.$props.reason).toBe(typeOfLost.TIME_OUT)
    })

    it('uses correct reason constant for timeout', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.TIME_OUT,
        },
        global: {
          plugins: [pinia],
        },
      })

      // Test that the reason matches the TIME_OUT constant
      expect(wrapper.vm.$props.reason).toBe(1)
    })
  })

  describe('Try Again Button', () => {
    it('finds Try Again button with refresh icon', async () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const refreshButton = buttons.find((btn) => btn.props('icon') === 'refresh')
      expect(refreshButton).toBeDefined()
      expect(refreshButton.props('color')).toBe('negative')
    })
  })

  describe('Return to Menu Button', () => {
    it('finds Return to Menu button with home icon', async () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const homeButton = buttons.find((btn) => btn.props('icon') === 'home')
      expect(homeButton).toBeDefined()
    })
  })

  describe('Dialog Configuration', () => {
    it('has QDialog component', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      const dialog = wrapper.findComponent({ name: 'QDialog' })
      expect(dialog.exists()).toBe(true)
    })

    it('dialog receives modelValue prop', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.props('modelValue')).toBe(true)
    })
  })

  describe('Events', () => {
    it('defines all required emits', () => {
      const emits = GameLostDialog.emits
      expect(emits).toContain('go-to-menu')
      expect(emits).toContain('restart')
    })
  })

  describe('Component Name', () => {
    it('has correct component name', () => {
      const wrapper = mount(GameLostDialog, {
        props: {
          modelValue: true,
          reason: typeOfLost.WRONG_CLICKED,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.vm.$options.name).toBe('GameLostDialog')
    })
  })
})
