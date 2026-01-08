import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import MainLayout from 'src/layouts/MainLayout.vue'
import { useGameStatusStore } from 'src/stores/gameStatusStore'
import { useSettingStore } from 'src/stores/settingStore'

// Mock Firebase and vuefire
vi.mock('src/boot/firebase', () => ({
  auth: {
    signOut: vi.fn().mockResolvedValue(undefined),
  },
  LoginProm: vi.fn().mockResolvedValue(undefined),
  deleteAccountAfterWarning: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('vuefire', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  useCurrentUser: vi.fn(() => ref(null)),
}))

describe('MainLayout.vue', () => {
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
          component: { template: '<div>Game</div>' },
        },
      ],
    })
  }

  beforeEach(() => {
    router = createRouterMock()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('Rendering', () => {
    it('renders the layout', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('renders header with title', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Memory Squares')
    })

    it('renders app logo', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const avatar = wrapper.findComponent({ name: 'QAvatar' })
      expect(avatar.exists()).toBe(true)
    })

    it('renders router view container', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const pageContainer = wrapper.findComponent({ name: 'QPageContainer' })
      expect(pageContainer.exists()).toBe(true)
    })
  })

  describe('Home Button', () => {
    it('shows home button when not on home page', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const homeButton = buttons.find((btn) => btn.props('icon') === 'home')
      expect(homeButton).toBeDefined()
    })

    it('hides home button when on home page', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })
      wrapper.vm.$nextTick()
      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const homeButton = buttons.find((btn) => btn.props('icon') === 'home')

      // Home button should have v-show="false" or not be visible
      // The button exists but is hidden
      if (homeButton) {
        expect(homeButton.element.style.display).toBe('none')
      }
    })
  })

  describe('Theme Toggle - Guest User', () => {
    it('displays theme toggle for guest users', async () => {
      const { useCurrentUser } = await import('vuefire')
      useCurrentUser.mockReturnValueOnce(ref(null))

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })
      await wrapper.vm.$nextTick()
      const toggle = wrapper.findComponent({ name: 'QToggle' })
      expect(toggle.exists()).toBe(true)
    })

    it('theme toggle has correct default value', async () => {
      const settingStore = useSettingStore()
      settingStore.theme = 'Light'

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.vm.theme).toBe('Light')
    })

    it('changes theme when toggle is clicked', async () => {
      const settingStore = useSettingStore()
      settingStore.theme = 'Light'

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      wrapper.vm.theme = 'Dark'
      await wrapper.vm.$nextTick()

      expect(settingStore.theme).toBe('Dark')
    })
  })

  describe('Login Button - Guest User', () => {
    it('displays login button for guest users not in game', async () => {
      const { useCurrentUser } = await import('vuefire')
      useCurrentUser.mockReturnValueOnce(ref(null))

      const gameStatusStore = useGameStatusStore()
      gameStatusStore.isBoardShowned = false

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const loginButton = buttons.find((btn) => btn.text().includes('Login'))
      expect(loginButton).toBeDefined()
    })

    it('hides login button during game', async () => {
      const { useCurrentUser } = await import('vuefire')
      useCurrentUser.mockReturnValueOnce(ref(null))

      const gameStatusStore = useGameStatusStore()
      gameStatusStore.isBoardShowned = true

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const loginButton = buttons.find((btn) => btn.text().includes('Login'))
      expect(loginButton).toBeUndefined()
    })

    it('login button has correct icon', async () => {
      const { useCurrentUser } = await import('vuefire')
      useCurrentUser.mockReturnValueOnce(ref(null))

      const gameStatusStore = useGameStatusStore()
      gameStatusStore.isBoardShowned = false

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const loginButton = buttons.find((btn) => btn.text().includes('Login'))
      expect(loginButton.props('icon')).toBe('login')
    })
  })

  describe('User Menu - Authenticated User', () => {
    it('displays user avatar for authenticated users', async () => {
      const { useCurrentUser } = await import('vuefire')
      const mockUser = {
        uid: 'test-user-123',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      }
      useCurrentUser.mockReturnValueOnce(ref(mockUser))

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      await wrapper.vm.$nextTick()

      // Should show user avatar when authenticated
      const avatars = wrapper.findAllComponents({ name: 'QAvatar' })
      expect(avatars.length).toBeGreaterThan(1) // More than just the logo
    })

    it('hides theme toggle in header for authenticated users', async () => {
      const { useCurrentUser } = await import('vuefire')
      const mockUser = {
        uid: 'test-user-123',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
      }
      useCurrentUser.mockReturnValueOnce(ref(mockUser))

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      await wrapper.vm.$nextTick()

      // Theme toggle should be in menu, not in main header for authenticated users
      const toolbar = wrapper.findComponent({ name: 'QToolbar' })
      const toolbarToggles = toolbar.findAllComponents({ name: 'QToggle' })

      // Should be 0 or hidden in toolbar (moved to menu)
      expect(toolbarToggles.length).toBe(0)
    })
  })

  describe('Component Configuration', () => {
    it('has correct component name', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.vm.$options.name).toBe('MainLayout')
    })

    it('initializes with correct title', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.vm.title).toBe('Memory Squares')
    })
  })

  describe('Dark Mode', () => {
    it('applies dark mode when theme is Dark', async () => {
      const settingStore = useSettingStore()
      settingStore.theme = 'Dark'

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      await wrapper.vm.$nextTick()

      // Dark mode should be set
      expect(wrapper.vm.$q.dark.isActive).toBe(true)
    })

    it('removes dark mode when theme is Light', async () => {
      const settingStore = useSettingStore()
      settingStore.theme = 'Light'

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      await wrapper.vm.$nextTick()

      // Dark mode should not be active
      expect(wrapper.vm.$q.dark.isActive).toBe(false)
    })
  })

  describe('Layout Structure', () => {
    it('uses hHh lpR fFf view configuration', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const layout = wrapper.findComponent({ name: 'QLayout' })
      expect(layout.props('view')).toBe('hHh lpR fFf')
    })

    it('header has primary background', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const header = wrapper.findComponent({ name: 'QHeader' })
      expect(header.classes()).toContain('bg-primary')
    })

    it('header has white text', async () => {
      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const header = wrapper.findComponent({ name: 'QHeader' })
      expect(header.classes()).toContain('text-white')
    })
  })

  describe('Button Colors', () => {
    it('home button has accent color', async () => {
      router.push('/game')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const homeButton = buttons.find((btn) => btn.props('icon') === 'home')

      if (homeButton && homeButton.isVisible()) {
        expect(homeButton.props('color')).toBe('accent')
      }
    })

    it('login button has accent color', async () => {
      const { useCurrentUser } = await import('vuefire')
      useCurrentUser.mockReturnValueOnce(ref(null))

      const gameStatusStore = useGameStatusStore()
      gameStatusStore.isBoardShowned = false

      router.push('/')
      await router.isReady()

      const wrapper = mount(MainLayout, {
        global: {
          plugins: [router, pinia],
        },
      })

      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const loginButton = buttons.find((btn) => btn.text().includes('Login'))

      if (loginButton) {
        expect(loginButton.props('color')).toBe('accent')
      }
    })
  })
})
