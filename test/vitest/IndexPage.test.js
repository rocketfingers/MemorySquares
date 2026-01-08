import { vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import IndexPage from 'src/pages/IndexPage.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { gameResults } from 'src/gameResult'

// Mock the history composable
vi.mock('src/composables/historyComposable', () => ({
  useHistory: () => ({
    subscribe: vi.fn(),
    history: [],
    addGameToHistoryAsync: vi.fn(() => Promise.resolve()),
  }),
}))

describe('IndexPage.vue', () => {
  let router
  let pinia

  const createRouterMock = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'index',
          component: IndexPage,
        },
        {
          path: '/game',
          name: 'game',
          component: { template: '<div>Game Page</div>' },
        },
      ],
    })
  }

  beforeEach(() => {
    router = createRouterMock()
    pinia = createPinia()
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders the index page', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('displays game title', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Memory Squares')
    })

    it('displays game subtitle', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Test your memory and reflexes!')
    })

    it('displays Start Game button', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Start Game')
    })

    it('displays Game History button', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Game History')
    })

    it('displays How to Play card', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.text()).toContain('How to Play')
    })

    it('displays game instructions', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.text()).toContain('Memorize the highlighted squares')
      expect(wrapper.text()).toContain('You have 2 seconds!')
      expect(wrapper.text()).toContain('Click only the valid squares(blue)')
      expect(wrapper.text()).toContain('Complete in 12 seconds')
    })
  })

  describe('Game History Dialog', () => {
    it('shows history dialog when Game History button clicked', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.vm.showHistoryDialog).toBe(false)

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const historyButton = buttons.find((btn) => btn.text().includes('Game History'))

      await historyButton.trigger('click')

      expect(wrapper.vm.showHistoryDialog).toBe(true)
    })

    it('renders GameHistoryDialog component', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const historyDialog = wrapper.findComponent({ name: 'GameHistoryDialog' })
      expect(historyDialog.exists()).toBe(true)
    })
  })

  describe('Start Game - New Game (Round 1)', () => {
    it('navigates to game page when round is 1', async () => {
      const store = useGameStatusStore()
      store.round = 1

      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const startButton = buttons.find((btn) => btn.text().includes('Start Game'))

      await startButton.trigger('click')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/game')
    })
  })

  describe('Start Game - Resume Game (Round > 1)', () => {
    it('does not navigate immediately when round > 1', async () => {
      const store = useGameStatusStore()
      store.round = 5

      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const startButton = buttons.find((btn) => btn.text().includes('Start Game'))

      await startButton.trigger('click')
      await flushPromises()

      // Should show dialog instead of navigating
      expect(router.currentRoute.value.path).toBe('/')
    })
  })

  describe('Abandoned Game Detection', () => {
    it('detects abandoned game on mount', async () => {
      const store = useGameStatusStore()
      store.gameInProgress = true

      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(store.gameInProgress).toBe(false)
      expect(store.isBoardShowned).toBe(false)
    })

    it('does not affect non-abandoned games', async () => {
      const store = useGameStatusStore()
      store.gameInProgress = false
      store.round = 5

      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      await flushPromises()

      expect(store.round).toBe(5)
    })

    it('sets isBoardShowned to false on mount', async () => {
      const store = useGameStatusStore()
      store.isBoardShowned = true

      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      await flushPromises()

      expect(store.isBoardShowned).toBe(false)
    })
  })

  describe('Component Configuration', () => {
    it('has correct component name', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      expect(wrapper.vm.$options.name).toBe('IndexPage')
    })
  })

  describe('Visual Elements', () => {
    it('renders decorative squares', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const decoSquares = wrapper.findAll('.deco-square')
      expect(decoSquares.length).toBe(3)
    })

    it('renders game title icon', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const icons = wrapper.findAllComponents({ name: 'QIcon' })
      const titleIcon = icons.find((icon) => icon.props('name') === 'psychology')
      expect(titleIcon.exists()).toBe(true)
    })
  })

  describe('Button Styling', () => {
    it('Start Game button has primary color', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const startButton = buttons.find((btn) => btn.text().includes('Start Game'))

      expect(startButton.props('color')).toBe('primary')
    })

    it('History button has secondary color', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const historyButton = buttons.find((btn) => btn.text().includes('Game History'))

      expect(historyButton.props('color')).toBe('secondary')
    })

    it('Start Game button has sports icon', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const startButton = buttons.find((btn) => btn.text().includes('Start Game'))

      expect(startButton.props('icon')).toBe('sports_score')
    })

    it('History button has history icon', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(IndexPage, {
        global: {
          plugins: [router, pinia],
          stubs: {
            QPage: {
              template: '<div><slot /></div>',
            },
            QLayout: {
              template: '<div><slot /></div>',
            },
          },
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const historyButton = buttons.find((btn) => btn.text().includes('Game History'))

      expect(historyButton.props('icon')).toBe('history')
    })
  })
})
