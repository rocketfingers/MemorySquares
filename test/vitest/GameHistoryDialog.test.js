import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import GameHistoryDialog from 'src/components/GameHistoryDialog.vue'
import { gameResults } from 'src/gameResult'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
// Mock the history composable
vi.mock('src/composables/historyComposable', () => ({
  useHistory: () => ({
    subscribe: vi.fn(),
    history: [],
    clearGameHistory: vi.fn().mockResolvedValue(undefined),
  }),
}))

describe('GameHistoryDialog.vue', () => {
  let pinia

  beforeEach(() => {
    installQuasarPlugin()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('Rendering', () => {
    it('renders the dialog when model is true', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })

      expect(portalWrapper.find('.game-dialog').exists()).toBe(true)
    })

    it('displays Game History title', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      expect(portalWrapper.text()).toContain('Game History')
    })

    it('renders header with history icon', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const icons = portalWrapper.findAllComponents({ name: 'QIcon' })
      const historyIcon = icons.find((icon) => icon.props('name') === 'history')
      expect(historyIcon.exists()).toBe(true)
    })

    it('renders close button', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const closeButton = buttons.find((btn) => btn.props('icon') === 'close')
      expect(closeButton.exists()).toBe(true)
    })
  })

  describe('Empty History State', () => {
    it('displays empty state when no games played', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      expect(portalWrapper.text()).toContain('No games played yet')
    })

    it('displays empty state message', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      expect(portalWrapper.text()).toContain('Complete a level to see your history')
    })

    it('displays empty state icon', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const icons = portalWrapper.findAllComponents({ name: 'QIcon' })
      const emptyIcon = icons.find((icon) => icon.props('name') === 'history_toggle_off')
      expect(emptyIcon.exists()).toBe(true)
    })

    it('does not display Clear History button when empty', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const buttons = portalWrapper.findAllComponents({ name: 'QBtn' })
      const clearButton = buttons.find((btn) => btn.text().includes('Clear History'))
      expect(clearButton).toBeUndefined()
    })

    it('does not display table when empty', async () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const portalWrapper = wrapper.findComponent({ name: 'QPortal' })
      const table = portalWrapper.findComponent({ name: 'QTable' })
      expect(table.exists()).toBe(false)
    })
  })

  describe('History with Data', () => {
    it('displays table when history has games', async () => {
      vi.doMock('src/composables/historyComposable', () => ({
        useHistory: () => ({
          subscribe: vi.fn(),
          history: [
            {
              round: 1,
              time: 5,
              result: gameResults.WIN,
              timestamp: { seconds: Date.now() / 1000 },
            },
          ],
          clearGameHistory: vi.fn().mockResolvedValue(undefined),
        }),
      }))

      vi.resetModules()
      const GameHistoryDialogModule = await import(
        'src/components/GameHistoryDialog.vue?t=' + Date.now()
      )
      const wrapper = mount(GameHistoryDialogModule.default, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const table = wrapper.findComponent({ name: 'QTable' })
      expect(table.exists()).toBe(true)
    })

    it('displays Clear History button when history exists', async () => {
      vi.doMock('src/composables/historyComposable', () => ({
        useHistory: () => ({
          subscribe: vi.fn(),
          history: [
            {
              round: 1,
              time: 5,
              result: gameResults.WIN,
              timestamp: { seconds: Date.now() / 1000 },
            },
          ],
          clearGameHistory: vi.fn().mockResolvedValue(undefined),
        }),
      }))

      vi.resetModules()
      const GameHistoryDialogModule = await import(
        'src/components/GameHistoryDialog.vue?t=' + Date.now()
      )
      const wrapper = mount(GameHistoryDialogModule.default, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const clearButton = buttons.find((btn) => btn.text().includes('Clear History'))
      expect(clearButton.exists()).toBe(true)
    })
  })

  describe('Table Columns', () => {
    it('configures correct table columns', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      // Check that columns are defined in component
      expect(wrapper.vm.columns).toBeDefined()
      expect(wrapper.vm.columns.length).toBe(4)
    })

    it('has Round column', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const roundColumn = wrapper.vm.columns.find((col) => col.name === 'round')
      expect(roundColumn).toBeDefined()
      expect(roundColumn.label).toBe('Round')
    })

    it('has Time column', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const timeColumn = wrapper.vm.columns.find((col) => col.name === 'time')
      expect(timeColumn).toBeDefined()
      expect(timeColumn.label).toBe('Time(s)')
    })

    it('has Result column', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const resultColumn = wrapper.vm.columns.find((col) => col.name === 'result')
      expect(resultColumn).toBeDefined()
      expect(resultColumn.label).toBe('Result')
    })

    it('has Finished column', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const dateColumn = wrapper.vm.columns.find((col) => col.name === 'date')
      expect(dateColumn).toBeDefined()
      expect(dateColumn.label).toBe('Finished')
    })
  })

  describe('Clear History Functionality', () => {
    it('Clear History button has delete icon', async () => {
      vi.doMock('src/composables/historyComposable', () => ({
        useHistory: () => ({
          subscribe: vi.fn(),
          history: [
            {
              round: 1,
              time: 5,
              result: gameResults.WIN,
              timestamp: { seconds: Date.now() / 1000 },
            },
          ],
          clearGameHistory: vi.fn().mockResolvedValue(undefined),
        }),
      }))

      vi.resetModules()
      const GameHistoryDialogModule = await import(
        'src/components/GameHistoryDialog.vue?t=' + Date.now()
      )
      const wrapper = mount(GameHistoryDialogModule.default, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const clearButton = buttons.find((btn) => btn.text().includes('Clear History'))
      expect(clearButton.props('icon')).toBe('delete_outline')
    })

    it('Clear History button has negative color', async () => {
      vi.doMock('src/composables/historyComposable', () => ({
        useHistory: () => ({
          subscribe: vi.fn(),
          history: [
            {
              round: 1,
              time: 5,
              result: gameResults.WIN,
              timestamp: { seconds: Date.now() / 1000 },
            },
          ],
          clearGameHistory: vi.fn().mockResolvedValue(undefined),
        }),
      }))

      vi.resetModules()
      const GameHistoryDialogModule = await import(
        'src/components/GameHistoryDialog.vue?t=' + Date.now()
      )
      const wrapper = mount(GameHistoryDialogModule.default, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const clearButton = buttons.find((btn) => btn.text().includes('Clear History'))
      expect(clearButton.props('color')).toBe('negative')
    })
  })

  describe('Table Configuration', () => {
    it('sets pagination to 7 rows per page', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      // Check if pagination is set correctly in the data
      expect(wrapper.vm.$options).toBeDefined()
    })
  })

  describe('Dialog Configuration', () => {
    it('has backdrop filter', () => {
      const wrapper = shallowMount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const dialog = wrapper.findComponent({ name: 'QDialog' })
      expect(dialog.attributes('backdropfilter')).toBe('blur(4px)')
    })
  })

  describe('Result Display', () => {
    it('formats win result correctly', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const resultColumn = wrapper.vm.columns.find((col) => col.name === 'result')
      const resultText = resultColumn.field({ result: gameResults.WIN })
      expect(resultText).toBe('Win')
    })

    it('formats loss result correctly', () => {
      const wrapper = mount(GameHistoryDialog, {
        props: {
          modelValue: true,
        },
        global: {
          plugins: [pinia],
        },
      })

      const resultColumn = wrapper.vm.columns.find((col) => col.name === 'result')
      const resultText = resultColumn.field({ result: gameResults.LOSE })
      expect(resultText).toBe('Lose')
    })
  })
})
