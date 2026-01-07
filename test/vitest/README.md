# Vitest Testing Guide

This directory contains unit tests for the MemorySquares application.

## Running Tests

```bash
# Run tests once
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with UI
yarn test:ui

# Run tests with coverage report
yarn test:coverage
```

## Writing Tests

### Test File Structure

Test files should be placed in `test/vitest/` and follow the naming convention: `ComponentName.test.js` or `ComponentName.spec.js`

### Example Test

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from 'src/components/MyComponent.vue'

describe('MyComponent.vue', () => {
  beforeEach(() => {
    // Reset Pinia store before each test
    setActivePinia(createPinia())
  })

  it('renders properly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        msg: 'Hello World',
      },
    })
    expect(wrapper.text()).toContain('Hello World')
  })
})
```

## Testing Quasar Components

Quasar components are automatically configured in the test setup. You can use them in your tests without additional configuration.

## Testing Pinia Stores

The setup includes Pinia configuration. Use `createPinia()` and `setActivePinia()` in your `beforeEach` hook to reset the store state between tests.

## Coverage

Coverage reports are generated in the `coverage/` directory and include:
- Text summary in terminal
- JSON report
- HTML report (open `coverage/index.html` in browser)
