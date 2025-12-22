import { auth, db } from 'src/boot/firebase'
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore'
import { getCurrentUser, useCurrentUser } from 'vuefire'
import { reactive } from 'vue'

// Module-level state for game history
let localHistory = reactive([])
let history = reactive([])
let unsubscribe = null

/**
 * Game history composable - manages game history storage with dual-mode support
 *
 * Provides hybrid storage strategy:
 * - Authenticated users: Firestore (cloud storage)
 * - Guest users: localStorage (browser storage)
 *
 * Features:
 * - Real-time sync with Firestore for authenticated users
 * - Automatic migration on login/logout
 * - Persistent local storage for guests
 *
 * @returns {Object} Game history methods and reactive state
 */
export function useHistory() {
  // Initialize local history from localStorage
  try {
    const stored = localStorage.getItem('gameHistory')
    if (stored) {
      const parsed = JSON.parse(stored)
      localHistory = Array.isArray(parsed) ? parsed : []
    }
  } catch {
    localStorage.removeItem('gameHistory')
  }

  /**
   * Adds a game result to history
   * Storage location depends on authentication status
   *
   * @param {number} round - The round number reached
   * @param {number} time - Time taken for this round in seconds
   * @param {number} totalGameTime - Cumulative time across all rounds in seconds
   * @param {number} result - Game result (0 = loss, 1 = win)
   * @returns {Promise<void>}
   */
  const addGameToHistoryAsync = async (round, time, totalGameTime, result) => {
    const currentUser = await getCurrentUser()

    const isAuthorized = currentUser !== null
    if (isAuthorized) {
      // Store in Firestore for authorized users
      await addDoc(collection(db, 'gamesHistory'), {
        userId: currentUser.uid,
        round: round,
        time: time,
        totalGameTime: totalGameTime,
        result: result,
        timestamp: Timestamp.now(),
      })
    } else {
      // Store in localStorage for unauthorized users
      history.push({
        round: round,
        time: time,
        totalGameTime: totalGameTime,
        result,
        timestamp: Timestamp.now(),
      })
      localStorage.setItem('gameHistory', JSON.stringify(history))
    }
  }

  /**
   * Gets Firestore query for authenticated user's game history
   * @returns {Object|undefined} Firestore query object or undefined if not authenticated
   */
  const getGameHistoryAuth = () => {
    const currentUser = useCurrentUser().value
    if (currentUser) {
      // Return Firestore history for authorized users
      const q = query(collection(db, 'gamesHistory'), where('userId', '==', currentUser.uid))

      return collection(q)
    }
  }

  /**
   * Gets local game history from browser storage
   * @returns {Array} Array of game history objects
   */
  const getGameHistoryLocal = () => {
    return localHistory
  }

  /**
   * Subscribes to real-time history updates based on authentication state
   *
   * - For authenticated users: Sets up Firestore listener
   * - For guests: Uses localStorage
   * - Automatically switches between modes on login/logout
   * - Cleans up previous listeners to prevent memory leaks
   */
  const subscribe = () => {
    if (history.length === 0) {
      history.splice(0, history.length) // Clear the history array
      getGameHistoryLocal().forEach((game) => {
        history.push(game)
      })
    }

    auth.onAuthStateChanged((user) => {
      if (unsubscribe) unsubscribe()
      if (user) {
        unsubscribe = onSnapshot(
          query(collection(db, 'gamesHistory'), where('userId', '==', user.uid)),
          (snapshot) => {
            history.splice(0, history.length) // Clear the history array
            snapshot.docs.forEach((doc) => {
              history.push(doc.data())
            })
          },
        )
      } else {
        history.splice(0, history.length) // Clear the history array
        getGameHistoryLocal().forEach((game) => {
          history.push(game)
        })
      }
    })
  }

  /**
   * Clears all game history
   *
   * For authenticated users: Deletes Firestore records
   * For all users: Clears localStorage and reactive history
   *
   * @returns {Promise<void>}
   */
  const clearGameHistory = async () => {
    const currentUser = useCurrentUser().value
    const isAuthorized = currentUser !== null

    if (isAuthorized) {
      // Clear Firestore history for authorized users
      const q = query(collection(db, 'gamesHistory'), where('userId', '==', currentUser.uid))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)))
      }
    }

    // Always clear local storage and reactive history
    localStorage.removeItem('gameHistory')
    localHistory.length = 0
    history.splice(0, history.length)
  }

  return {
    addGameToHistoryAsync,
    getGameHistoryAuth,
    getGameHistoryLocal,
    clearGameHistory,
    history,
    subscribe,
  }
}
