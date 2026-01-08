import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ResultsBox from 'src/components/ResultsBox.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { reactive } from 'vue'

// Create reactive history that can be updated
const mockHistory = reactive([])

// Mock the history composable
vi.mock('src/composables/historyComposable', () => ({
  useHistory: () => ({
    subscribe: vi.fn(),
    history: mockHistory,
  }),
}))

describe('ResultsBox.vue', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    // Clear mock history before each test
    mockHistory.splice(0, mockHistory.length)
  })

  describe('Rendering', () => {
    it('is hidden when no game has ever started', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = false

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const resultsCard = wrapper.find('.results-card')
      expect(resultsCard.attributes('style')).toContain('display: none')
    })

    it('is visible when a game has been started', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const resultsCard = wrapper.find('.results-card')
      expect(resultsCard.exists()).toBe(true)
      expect(resultsCard.isVisible()).toBe(true)
    })

    it('renders all stat items', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statItems = wrapper.findAll('.stat-item')
      expect(statItems.length).toBe(4) // Max Round, Avg Time, Wins, Losses
    })

    it('renders header with icon and title', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const header = wrapper.find('.results-header')
      expect(header.exists()).toBe(true)

      const title = wrapper.find('.results-title')
      expect(title.text()).toBe('Your Stats')
    })
  })

  describe('Stats Calculations with Empty History', () => {
    it('displays 0 for max round when history is empty', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      // Max round stat value should be 0
      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[0].text()).toBe('0')
    })

    it('displays 0s for avg time when history is empty', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[1].text()).toBe('0s')
    })

    it('displays 0 for wins when history is empty', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[2].text()).toBe('0')
    })

    it('displays 0 for losses when history is empty', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[3].text()).toBe('0')
    })
  })

  describe('Stats Calculations with History', () => {
    it('calculates max round correctly', async () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      // Add games to mock history
      mockHistory.push(
        { round: 3, time: 5, result: 1 },
        { round: 7, time: 8, result: 1 },
        { round: 5, time: 6, result: 0 }
      )

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[0].text()).toBe('7')
    })

    it('calculates average time correctly', async () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      // Add games to mock history
      mockHistory.push(
        { round: 1, time: 4, result: 1 },
        { round: 2, time: 6, result: 1 },
        { round: 3, time: 8, result: 0 }
      )

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const statValues = wrapper.findAll('.stat-value')
      // Average of 4, 6, 8 = 18/3 = 6.0
      expect(statValues[1].text()).toBe('6.0s')
    })

    it('counts wins correctly', async () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      // Add games to mock history
      mockHistory.push(
        { round: 1, time: 4, result: 1 }, // Win
        { round: 2, time: 6, result: 1 }, // Win
        { round: 3, time: 8, result: 0 } // Loss
      )

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[2].text()).toBe('2')
    })

    it('counts losses correctly', async () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      // Add games to mock history
      mockHistory.push(
        { round: 1, time: 4, result: 1 }, // Win
        { round: 2, time: 6, result: 0 }, // Loss
        { round: 3, time: 8, result: 0 } // Loss
      )

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      await wrapper.vm.$nextTick()

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[3].text()).toBe('2')
    })
  })

  describe('Stat Labels', () => {
    it('displays correct stat labels', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statLabels = wrapper.findAll('.stat-label')
      expect(statLabels[0].text()).toBe('Max Round')
      expect(statLabels[1].text()).toBe('Avg Time')
      expect(statLabels[2].text()).toBe('Wins')
      expect(statLabels[3].text()).toBe('Losses')
    })
  })

  describe('Styling', () => {
    it('applies success styling to wins icon wrapper', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const iconWrappers = wrapper.findAll('.stat-icon-wrapper')
      expect(iconWrappers[2].classes()).toContain('success')
    })

    it('applies error styling to losses icon wrapper', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const iconWrappers = wrapper.findAll('.stat-icon-wrapper')
      expect(iconWrappers[3].classes()).toContain('error')
    })

    it('applies success-text class to win value', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[2].classes()).toContain('success-text')
    })

    it('applies error-text class to loss value', () => {
      const store = useGameStatusStore()
      store.anyGameEverStarted = true

      const wrapper = mount(ResultsBox, {
        global: {
          plugins: [pinia],
        },
      })

      const statValues = wrapper.findAll('.stat-value')
      expect(statValues[3].classes()).toContain('error-text')
    })
  })
})
