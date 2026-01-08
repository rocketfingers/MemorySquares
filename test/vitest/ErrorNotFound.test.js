import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import ErrorNotFound from 'src/pages/ErrorNotFound.vue'

describe('ErrorNotFound.vue', () => {
  const createRouterMock = () => {
    return createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: '<div>Home</div>' },
        },
        {
          path: '/:catchAll(.*)*',
          name: 'error-404',
          component: ErrorNotFound,
        },
      ],
    })
  }

  describe('Rendering', () => {
    it('renders the 404 page', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('displays 404 error code', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('404')
    })

    it('displays error message', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.text()).toContain('Oops. Nothing here...')
    })

    it('displays Go Home button', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const button = wrapper.findComponent({ name: 'QBtn' })
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Go Home')
    })
  })

  describe('Go Home Button', () => {
    it('has correct props', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const button = wrapper.findComponent({ name: 'QBtn' })
      expect(button.props('color')).toBe('white')
      expect(button.props('textColor')).toBe('blue')
      expect(button.props('unelevated')).toBe(true)
      expect(button.props('noCaps')).toBe(true)
    })

    it('links to home page', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const button = wrapper.findComponent({ name: 'QBtn' })
      expect(button.props('to')).toBe('/')
    })
  })

  describe('Styling', () => {
    it('has fullscreen background', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const container = wrapper.find('.fullscreen')
      expect(container.exists()).toBe(true)
    })

    it('has blue background', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const container = wrapper.find('.bg-blue')
      expect(container.exists()).toBe(true)
    })

    it('has white text', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const container = wrapper.find('.text-white')
      expect(container.exists()).toBe(true)
    })

    it('is centered', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const container = wrapper.find('.text-center')
      expect(container.exists()).toBe(true)
    })
  })

  describe('Component Configuration', () => {
    it('has correct component name', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.vm.$options.name).toBe('ErrorNotFound')
    })
  })

  describe('Error Code Display', () => {
    it('displays error code in large font', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const errorCode = wrapper.find('div[style*="font-size: 30vh"]')
      expect(errorCode.exists()).toBe(true)
      expect(errorCode.text()).toBe('404')
    })
  })

  describe('Message Display', () => {
    it('displays message with text-h2 class', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const message = wrapper.find('.text-h2')
      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('Oops. Nothing here...')
    })

    it('message has opacity styling', () => {
      const router = createRouterMock()
      const pinia = createPinia()

      const wrapper = mount(ErrorNotFound, {
        global: {
          plugins: [router, pinia],
        },
      })

      const message = wrapper.find('.text-h2')
      expect(message.attributes('style')).toContain('opacity')
    })
  })
})
