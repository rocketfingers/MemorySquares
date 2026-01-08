import { describe, it, expect, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import GameWonDialog from 'src/components/GameWonDialog.vue'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
describe('GameWonDialog.vue', () => {
  let pinia

  beforeEach(() => {
    installQuasarPlugin()
    pinia = createPinia()
  })

  describe('Rendering', () => {
    it('renders the component', () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QDialog' }).exists()).toBe(true)
    })

    it('contains Victory title in template', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const html = portalWrapper.html()
      expect(html).toContain('Victory!')
    })

    it('contains Level Complete subtitle in template', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const html = portalWrapper.html()
      expect(html).toContain('Level Complete')
    })

    it('displays trophy icon', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const icons = portalWrapper.findAllComponents({ name: 'QIcon' })
      const trophyIcon = icons.find((icon) => icon.props('name') === 'emoji_events')
      expect(trophyIcon).toBeDefined()
    })

    it('contains encouragement message in template', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const html = portalWrapper.html()
      expect(html).toContain('Excellent work!')
    })
  })

  describe('Props', () => {
    it('accepts columns prop', () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 5,
        },
        global: {
          plugins: [pinia],
        },
      })

      expect(wrapper.props('columns')).toBe(5)
    })

    it('requires columns prop', () => {
      const columns = GameWonDialog.props.columns
      expect(columns.required).toBe(true)
      expect(columns.type).toBe(Number)
    })
  })

  describe('Next Level Button', () => {
    it('shows Next Level button when columns < 7', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const nextLevelButton = buttons.find((btn) => btn.props('icon') === 'arrow_forward')
      expect(nextLevelButton).toBeDefined()
    })

    it('shows Next Level button when columns is 6', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 6,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const nextLevelButton = buttons.find((btn) => btn.props('icon') === 'arrow_forward')
      expect(nextLevelButton).toBeDefined()
    })

    it('hides Next Level button when columns >= 7', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 7,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const nextLevelButton = buttons.find((btn) => btn.props('icon') === 'arrow_forward')
      expect(nextLevelButton).toBeUndefined()
    })

    it('has correct icon for Next Level button', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const nextLevelButton = buttons.find((btn) => btn.props('icon') === 'arrow_forward')

      expect(nextLevelButton.props('icon')).toBe('arrow_forward')
    })
  })

  describe('Restart Button', () => {
    it('renders Restart button', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const restartButton = buttons.find((btn) => btn.props('icon') === 'refresh')
      expect(restartButton).toBeDefined()
      expect(restartButton.props('icon')).toBe('refresh')
    })
  })

  describe('Menu Button', () => {
    it('renders Menu button', async () => {
      const wrapper = mount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const menuButton = buttons.find((btn) => btn.props('icon') === 'home')
      expect(menuButton).toBeDefined()
      expect(menuButton.props('icon')).toBe('home')
    })
  })

  describe('Dialog Configuration', () => {
    it('has persistent dialog', async () => {
      const wrapper = shallowMount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      wrapper.findComponent({ name: 'QDialog' })
      expect(wrapper.attributes('persistent')).toBeDefined()
    })

    it('has backdrop filter', () => {
      const wrapper = shallowMount(GameWonDialog, {
        props: {
          modelValue: true,
          columns: 3,
        },
        global: {
          plugins: [pinia],
        },
      })

      const dialog = wrapper.findComponent({ name: 'QDialog' })
      expect(dialog.attributes('backdropfilter')).toBe('blur(4px)')
    })
  })

  describe('Events', () => {
    it('defines all required emits', () => {
      const emits = GameWonDialog.emits
      expect(emits).toContain('go-to-menu')
      expect(emits).toContain('restart')
      expect(emits).toContain('next-level')
    })
  })
})
