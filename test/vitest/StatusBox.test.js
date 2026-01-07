import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatusBox from 'src/components/StatusBox.vue'

describe('StatusBox.vue', () => {
  beforeEach(() => {
    // Reset Pinia store before each test
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders when a game has been started', () => {
    const wrapper = mount(StatusBox, {
      props: {
        solved: 5,
        total: 10,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('calculates percentage solved correctly', () => {
    const wrapper = mount(StatusBox, {
      props: {
        solved: 5,
        total: 10,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const progressText = wrapper.find('.progress-text')
    expect(progressText.text()).toBe('50%')
  })

  it('handles 100% progress', () => {
    const wrapper = mount(StatusBox, {
      props: {
        solved: 10,
        total: 10,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const progressText = wrapper.find('.progress-text')
    expect(progressText.text()).toBe('100%')
  })

  it('handles 0% progress', () => {
    const wrapper = mount(StatusBox, {
      props: {
        solved: 0,
        total: 10,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const progressText = wrapper.find('.progress-text')
    expect(progressText.text()).toBe('0%')
  })

  it('displays correct progress value in circular progress', () => {
    const wrapper = mount(StatusBox, {
      props: {
        solved: 3,
        total: 10,
      },
      global: {
        plugins: [createPinia()],
      },
    })

    const circularProgress = wrapper.findComponent({ name: 'QCircularProgress' })
    expect(circularProgress.props('value')).toBe(30)
  })
})
