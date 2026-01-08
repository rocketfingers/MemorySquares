import { vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import GamePage from 'src/pages/GamePage.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { gameResults } from 'src/gameResult'
import { timeConstants, typeOfLost } from 'src/gameConstants'

// Mock the composables
vi.mock('src/composables/historyComposable', () => ({
  useHistory: () => ({
    subscribe: vi.fn(),
    history: [],
    addGameToHistoryAsync: vi.fn().mockResolvedValue(undefined),
  }),
}))

vi.mock('src/composables/timerComposable.js', () => ({
  useTimer: () => vi.fn(),
}))

describe('GamePage.vue', () => {
  let router
  let pinia

  const createRouterMock = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'index',
          component: { template: '<div>Home</div>' },
        },
        {
          path: '/game',
          name: 'game',
          component: GamePage,
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
    it('renders the game page', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

    it('renders the game board', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const mainDiv = wrapper.find('.mainDiv')
      expect(mainDiv.exists()).toBe(true)
    })

    it('renders ResultsBox component', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const resultsBox = wrapper.findComponent({ name: 'ResultsBox' })
      expect(resultsBox.exists()).toBe(true)
    })

    it('renders StatusBox component', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const statusBox = wrapper.findComponent({ name: 'StatusBox' })
      expect(statusBox.exists()).toBe(true)
    })

    it('renders GameLostDialog component', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const lostDialog = wrapper.findComponent({ name: 'GameLostDialog' })
      expect(lostDialog.exists()).toBe(true)
    })

    it('renders GameWonDialog component', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const wonDialog = wrapper.findComponent({ name: 'GameWonDialog' })
      expect(wonDialog.exists()).toBe(true)
    })
  })

  describe('Game Initialization', () => {
    it('starts game on mount', async () => {
      const store = useGameStatusStore()

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      expect(store.isBoardShowned).toBe(true)
    })

    it('creates game board with rectangles', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const squares = wrapper.findAll('[class*="smallDiv"]')
      expect(squares.length).toBeGreaterThan(0)
    })

    it('sets items as not clickable initially', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      expect(wrapper.vm.itemsNotClickable).toBe(true)
    })
  })

  describe('Board Grid Classes', () => {
    it('uses 3x3 grid for round 1', async () => {
      const store = useGameStatusStore()
      store.round = 1

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const mainDiv = wrapper.find('.mainDiv')
      expect(mainDiv.classes()).toContain('grid-container3')
    })
  })

  describe('StatusBox Props', () => {
    it('passes solved count to StatusBox', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const statusBox = wrapper.findComponent({ name: 'StatusBox' })
      expect(statusBox.props('solved')).toBeDefined()
    })

    it('passes total count to StatusBox', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const statusBox = wrapper.findComponent({ name: 'StatusBox' })
      expect(statusBox.props('total')).toBeDefined()
    })
  })

  describe('GameWonDialog Props', () => {
    it('passes columns prop to GameWonDialog', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const wonDialog = wrapper.findComponent({ name: 'GameWonDialog' })
      expect(wonDialog.props('columns')).toBe(3)
    })
  })

  describe('Dialog Events', () => {
    it('handles go-to-menu event from won dialog', async () => {
      const store = useGameStatusStore()

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const wonDialog = wrapper.findComponent({ name: 'GameWonDialog' })
      wonDialog.vm.$emit('go-to-menu')

      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/')
      expect(store.isBoardShowned).toBe(false)
    })

    it('handles go-to-menu event from lost dialog', async () => {
      const store = useGameStatusStore()

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const lostDialog = wrapper.findComponent({ name: 'GameLostDialog' })
      lostDialog.vm.$emit('go-to-menu')

      await flushPromises()

      expect(router.currentRoute.value.path).toBe('/')
      expect(store.isBoardShowned).toBe(false)
    })

    it('handles restart event from won dialog', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const wonDialog = wrapper.findComponent({ name: 'GameWonDialog' })
      wonDialog.vm.$emit('restart')

      await flushPromises()

      // Should reset and start new game
      expect(wrapper.vm.isBoardRotated).toBe(false)
    })

    it('handles restart event from lost dialog', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const lostDialog = wrapper.findComponent({ name: 'GameLostDialog' })
      lostDialog.vm.$emit('restart')

      await flushPromises()

      // Should reset and start new game
      expect(wrapper.vm.isBoardRotated).toBe(false)
    })

    it('handles next-level event from won dialog', async () => {
      const store = useGameStatusStore()
      store.round = 1

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const wonDialog = wrapper.findComponent({ name: 'GameWonDialog' })
      wonDialog.vm.$emit('next-level')

      await flushPromises()

      // Round should increment
      expect(store.round).toBe(2)
    })
  })

  describe('Board Rotation', () => {
    it('rotates board at round 3', async () => {
      const store = useGameStatusStore()
      store.round = 3

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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
      vi.advanceTimersByTime(timeConstants.PREVIEW_DURATION)
      await flushPromises()

      expect(wrapper.vm.isBoardRotated).toBe(true)
    })

    it('rotates board at round 6', async () => {
      const store = useGameStatusStore()
      store.round = 6

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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
      vi.advanceTimersByTime(timeConstants.PREVIEW_DURATION)
      await flushPromises()

      expect(wrapper.vm.isBoardRotated).toBe(true)
    })

    it('does not rotate board at other rounds', async () => {
      const store = useGameStatusStore()
      store.round = 2

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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
      vi.advanceTimersByTime(timeConstants.PREVIEW_DURATION)
      await flushPromises()

      expect(wrapper.vm.isBoardRotated).toBe(false)
    })

    it('applies rotated class when board is rotated', async () => {
      const store = useGameStatusStore()
      store.round = 3

      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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
      vi.advanceTimersByTime(timeConstants.PREVIEW_DURATION)
      await flushPromises()

      const mainDiv = wrapper.find('.mainDiv')
      expect(mainDiv.classes()).toContain('rotated')
    })
  })

  describe('Component Configuration', () => {
    it('has correct component name', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      expect(wrapper.vm.$options.name).toBe('GamePage')
    })
  })

  describe('Cursor State', () => {
    it('applies cursorNotAllowed class when items not clickable', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      const mainDiv = wrapper.find('.mainDiv')
      expect(mainDiv.classes()).toContain('cursorNotAllowed')
    })
  })

  describe('Dialog State', () => {
    it('initializes lost dialog as closed', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      expect(wrapper.vm.lostDialog).toBe(false)
    })

    it('initializes won dialog as closed', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      expect(wrapper.vm.wonDialog).toBe(false)
    })

    it('initializes board rotation as false', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(GamePage, {
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

      expect(wrapper.vm.isBoardRotated).toBe(false)
    })
  })
})
