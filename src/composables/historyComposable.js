import { useCollection } from 'vuefire'
import { db } from 'src/boot/firebase'
import { collection, addDoc, Timestamp, query, where } from 'firebase/firestore'
import { useCurrentUser } from 'vuefire'
import { ref } from 'vue'
const localHistory = ref([])

export function useHistory() {
  try {
    const stored = localStorage.getItem('gameHistory')
    if (stored) {
      const parsed = JSON.parse(stored)
      localHistory.value = Array.isArray(parsed) ? parsed : []
    }
  } catch {
    localStorage.removeItem('gameHistory')
  }

  const addGameToHistoryAsync = async (round, time, totalGameTime, result) => {
    let currentUser = useCurrentUser().value

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
      localHistory.value.push({
        round: round,
        time: time,
        totalGameTime: totalGameTime,
        result,
        timestamp: Timestamp.now(),
      })
      localStorage.setItem('gameHistory', JSON.stringify(localHistory.value))
    }
  }

  const getGameHistory = () => {
    const currentUser = useCurrentUser().value
    if (currentUser) {
      // Return Firestore history for authorized users
      const q = query(collection(db, 'gamesHistory'), where('userId', '==', currentUser.uid))
    
      return useCollection(q)
    } else {
      // Return localStorage history for unauthorized users
      return localHistory
    }
  }
  return {
    addGameToHistoryAsync,
    getGameHistory,
  }
}
