# Claude Code

This file can be used to provide context and documentation for working with this project using Claude Code.

## Project Overview

MemorySquares - A memory game application.

Created in Vue 3 with Quasar and Capacitor

## Recent Changes

- Added splash screen for Android
- Updated logo styling
- Optimized board size for better display across different screens
- Implemented board rotation feature for specific game rounds with animation
- Fixed return home dialog visibility issue

## Development Notes

- Use yarn only

## Testing

Unit testing is set up using Vitest with Vue Test Utils and happy-dom.

### Running Tests

```bash
yarn test              # Run tests once
yarn test:watch        # Run tests in watch mode
yarn test:ui           # Run tests with interactive UI
yarn test:coverage     # Run tests with coverage report
```

### Test Files

- Test files are located in `test/vitest/`
- Use `.test.js` or `.spec.js` extension for test files
- Example test: `test/vitest/StatusBox.test.js`

### Configuration

- Vitest config: `vitest.config.js`
- Test setup file: `test/vitest/setup.js` (configures Quasar and global mocks)
- Testing guide: `test/vitest/README.md`

### Writing Tests

The test environment includes:
- Vitest as the test runner
- @vue/test-utils for component testing
- happy-dom as the DOM environment
- Quasar components pre-configured
- Pinia store support

<!-- Add any project-specific notes, conventions, or guidelines here -->
