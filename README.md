# Memory Squares

A memory and reflex-testing game where you memorize highlighted squares on a grid and then tap them from memory before time runs out. Built with Vue 3, Quasar, and Firebase.

## How the Game Works

1. A grid of squares appears, some highlighted for a few seconds (preview phase)
2. The highlights disappear — click the squares you remember within 15 seconds
3. Click a wrong square or run out of time and you lose
4. Win to advance through 124 levels with increasing grid sizes (3x3 up to 6x6) and optional board rotation

## Tech Stack

- **Vue 3** (Composition API) + **Quasar v2** (UI framework)
- **Pinia** for state management (with persistence)
- **Firebase** — Google Auth + Firestore for cloud game history
- **Vitest** + Happy DOM for unit testing
- **PWA** support via Workbox (offline play, install to home screen)
- **Vite** as build tool

## Project Structure

```
src/
├── pages/               # IndexPage (menu), GamePage (gameplay), ErrorNotFound
├── components/          # StatusBox, ResultsBox, GameWonDialog, GameLostDialog, GameHistoryDialog
├── composables/         # useGameBoard (grid logic), timerComposable, historyComposable
├── stores/              # gameStatusStore (round/progress), settingStore (theme)
├── boot/                # Firebase initialization
├── router/              # Vue Router config
├── levelsConfiguration.js   # 124 level definitions (grid size, rotation, square ratios)
└── gameConstants.js         # Timing constants (preview duration, max time)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build for Production

```bash
quasar build
```

### Testing

```bash
pnpm test              # Run tests once
pnpm test:watch        # Watch mode
pnpm test:ui           # Interactive UI
pnpm test:coverage     # With coverage report
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

## Configuration

- **Quasar**: [quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js)
- **Firebase**: configured in `src/boot/firebase.js`
- **Game levels**: `src/levelsConfiguration.js`
- **Game timing**: `src/gameConstants.js`
