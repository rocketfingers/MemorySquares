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

let localHistory = reactive([])
let history = reactive([])
export function useHistory() {
  try {
    const stored = localStorage.getItem('gameHistory')
    if (stored) {
      const parsed = JSON.parse(stored)
      localHistory = Array.isArray(parsed) ? parsed : []
    }
  } catch {
    localStorage.removeItem('gameHistory')
  }

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

  const getGameHistoryAuth = () => {
    const currentUser = useCurrentUser().value
    if (currentUser) {
      // Return Firestore history for authorized users
      const q = query(collection(db, 'gamesHistory'), where('userId', '==', currentUser.uid))

      return collection(q)
    }
  }
  const getGameHistoryLocal = () => {
    return localHistory
  }

  const subscribe = () => {
    if (history.length === 0) {
      history.splice(0, history.length) // Clear the history array
      getGameHistoryLocal().forEach((game) => {
        history.push(game)
      })
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        onSnapshot(
          query(collection(db, 'gamesHistory'), where('userId', '==', user.uid)),
          (snapshot) => {
            history.splice(0, history.length) // Clear the history array
            snapshot.docs.forEach((doc) => {
              history.push(doc.data()) // Store unsubscribe function if needed for cleanup
            })
          }, // Store unsubscribe function if needed for cleanup
        )
      } else {
        history.splice(0, history.length) // Clear the history array
        getGameHistoryLocal().forEach((game) => {
          history.push(game)
        })
      }
    })
  }

  const clearGameHistory = async () => {
    const currentUser = useCurrentUser().value
    const isAuthorized = currentUser !== null

    if (isAuthorized) {
      // Clear Firestore history for authorized users
      const q = query(collection(db, 'gamesHistory'), where('userId', '==', currentUser.uid))
      const snapshot = await getDocs(q)
      if (snapshot.empty) {
        console.log('No matching documents for deletion.')
        return
      }
      snapshot.docs.forEach((doc) => {
        deleteDoc(doc.ref)
      })
    }

    localHistory = []

    history = []
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
