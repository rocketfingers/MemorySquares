# Agents Documentation

This file provides context and documentation for AI agents working with this project.

## Project Overview

MemorySquares - A memory game application.

Created in Vue 3 with Quasar and Capacitor

## Development Notes

- Use pnpm

## Commit Naming Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>: <short description>
```

### Types

- `feat` — A new feature or enhancement to existing functionality
- `fix` — A bug fix
- `style` — Visual/UI changes (styling, layout, cosmetic updates)
- `chore` — Maintenance tasks (config, dependencies, .gitignore, etc.)
- `build` — Build system or version changes
- `test` — Adding or updating tests
- `refactor` — Code restructuring without changing behavior
- `docs` — Documentation changes

### Guidelines

- Use lowercase for the type and description
- Keep the description short and imperative (e.g., "add pwa support", not "added pwa support")
- No period at the end of the description
- Focus on *what* was done, not *how*

### Examples

```
feat: add board rotation feature for specific game rounds
fix: ensure return home dialog hides when game board is not shown
style: enhance layout responsiveness for mobile
chore: update .gitignore to include bun.lock and pnpm-lock.yaml
test: set up Vitest testing framework
build: version 1.0.0
```

## Testing

Unit testing is set up using Vitest with Vue Test Utils and happy-dom.

### Running Tests

```bash
pnpm test              # Run tests once
pnpm test:watch        # Run tests in watch mode
pnpm test:ui           # Run tests with interactive UI
pnpm test:coverage     # Run tests with coverage report
```

### Test Files

- Test files are located in `test/vitest/`
- Use `.test.js` or `.spec.js` extension for test files
- Example test: `test/vitest/StatusBox.test.js`

### Configuration

- Vitest config: `vitest.config.js`
- Test setup file: `test/vitest/setup.js` (configures Quasar and global mocks)

### Writing Tests

The test environment includes:

- Vitest as the test runner
- @vue/test-utils for component testing
- happy-dom as the DOM environment
- Quasar components pre-configured
- Pinia store support

### Example Test

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from 'src/components/MyComponent.vue'

describe('MyComponent.vue', () => {
  beforeEach(() => {
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

### Coverage

Coverage reports are generated in the `coverage/` directory and include:

- Text summary in terminal
- JSON report
- HTML report (open `coverage/index.html` in browser)
