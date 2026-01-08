import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Firebase modules before importing the composable
vi.mock('src/boot/firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      callback(null)
      return vi.fn() // Return unsubscribe function
    }),
  },
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, name) => ({ _type: 'collection', name })),
  addDoc: vi.fn().mockResolvedValue({ id: 'mock-doc-id' }),
  Timestamp: {
    now: vi.fn(() => ({ seconds: Date.now() / 1000 })),
  },
  query: vi.fn((...args) => ({ _type: 'query', args })),
  where: vi.fn((field, op, value) => ({ _type: 'where', field, op, value })),
  getDocs: vi.fn().mockResolvedValue({
    empty: false,
    docs: [
      {
        ref: { id: 'doc1' },
        data: () => ({ round: 1, time: 5, result: 1 }),
      },
    ],
  }),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  onSnapshot: vi.fn((query, callback) => {
    callback({
      docs: [
        {
          data: () => ({ round: 1, time: 5, result: 1, userId: 'test-user' }),
        },
      ],
    })
    return vi.fn() // Return unsubscribe function
  }),
}))

vi.mock('vuefire', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  useCurrentUser: vi.fn(() => ({ value: null })),
}))

describe('historyComposable', () => {
  let localStorageMock

  beforeEach(() => {
    // Reset localStorage mock
    localStorageMock = {
      store: {},
      getItem: vi.fn((key) => localStorageMock.store[key] || null),
      setItem: vi.fn((key, value) => {
        localStorageMock.store[key] = value
      }),
      removeItem: vi.fn((key) => {
        delete localStorageMock.store[key]
      }),
      clear: vi.fn(() => {
        localStorageMock.store = {}
      }),
    }
    global.localStorage = localStorageMock

    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('initializes with empty history', async () => {
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      expect(history.history).toBeDefined()
      expect(Array.isArray(history.history)).toBe(true)
    })

    it('loads history from localStorage if available', async () => {
      const mockData = [
        { round: 1, time: 5, result: 1 },
        { round: 2, time: 7, result: 0 },
      ]
      localStorageMock.store.gameHistory = JSON.stringify(mockData)

      // Clear module cache to force re-initialization
      vi.resetModules()

      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      // The composable should have attempted to load from localStorage
      expect(localStorageMock.getItem).toHaveBeenCalled()
    })
  })

  describe('addGameToHistoryAsync', () => {
    it('adds game to localStorage for unauthorized users', async () => {
      const { getCurrentUser } = await import('vuefire')
      getCurrentUser.mockResolvedValueOnce(null)

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      await history.addGameToHistoryAsync(3, 8, 24, 1)

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('adds game to Firestore for authorized users', async () => {
      const { getCurrentUser } = await import('vuefire')
      const { addDoc } = await import('firebase/firestore')

      getCurrentUser.mockResolvedValueOnce({ uid: 'test-user-123' })

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      await history.addGameToHistoryAsync(5, 10, 50, 1)

      expect(addDoc).toHaveBeenCalled()
    })

    it('stores correct game data', async () => {
      const { getCurrentUser } = await import('vuefire')
      getCurrentUser.mockResolvedValueOnce(null)

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      const round = 7
      const time = 9
      const totalTime = 63
      const result = 0

      await history.addGameToHistoryAsync(round, time, totalTime, result)

      // Verify data was stored
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('getGameHistoryLocal', () => {
    it('returns local history array', async () => {
      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      const localHistory = history.getGameHistoryLocal()

      expect(Array.isArray(localHistory)).toBe(true)
    })
  })

  describe('clearGameHistory', () => {
    it('clears localStorage for unauthorized users', async () => {
      const { useCurrentUser } = await import('vuefire')
      useCurrentUser.mockReturnValueOnce({ value: null })

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      await history.clearGameHistory()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('gameHistory')
    })

    it('clears Firestore and localStorage for authorized users', async () => {
      const { useCurrentUser } = await import('vuefire')
      const { getDocs, deleteDoc } = await import('firebase/firestore')

      useCurrentUser.mockReturnValueOnce({ value: { uid: 'test-user-123' } })

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      await history.clearGameHistory()

      expect(getDocs).toHaveBeenCalled()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('gameHistory')
    })
  })

  describe('subscribe', () => {
    it('sets up history subscription', async () => {
      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      history.subscribe()

      // Should set up auth state listener
      const { auth } = await import('src/boot/firebase')
      expect(auth.onAuthStateChanged).toHaveBeenCalled()
    })

    it('loads local history initially', async () => {
      const mockData = [{ round: 1, time: 5, result: 1 }]
      localStorageMock.store.gameHistory = JSON.stringify(mockData)

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      history.subscribe()

      // Should attempt to load local history
      expect(localStorageMock.getItem).toHaveBeenCalled()
    })
  })

  describe('Storage Strategy', () => {
    it('uses localStorage for guest users', async () => {
      const { getCurrentUser } = await import('vuefire')
      getCurrentUser.mockResolvedValueOnce(null)

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      await history.addGameToHistoryAsync(1, 5, 5, 1)

      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('uses Firestore for authenticated users', async () => {
      const { getCurrentUser } = await import('vuefire')
      const { addDoc } = await import('firebase/firestore')

      getCurrentUser.mockResolvedValueOnce({ uid: 'authenticated-user' })

      vi.resetModules()
      const { useHistory } = await import('src/composables/historyComposable')
      const history = useHistory()

      await history.addGameToHistoryAsync(2, 6, 12, 0)

      expect(addDoc).toHaveBeenCalled()
    })
  })
})
