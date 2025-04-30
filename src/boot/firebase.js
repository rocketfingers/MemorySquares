import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI } from 'vuefire'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDMzGi2kwu6kIe5TRb5YMmkXWPaQtodM4c',
  authDomain: 'memorysquareslogicgame.firebaseapp.com',
  projectId: 'memorysquareslogicgame',
  storageBucket: 'memorysquareslogicgame.firebasestorage.app',
  messagingSenderId: '391679230850',
  appId: '1:391679230850:web:39f9854d591e5dd0bbc59b',
  measurementId: 'G-C9L4HTBDH1',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)
export const provider = new GoogleAuthProvider()
export function LoginProm() {
  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user
        resolve(user)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default async ({ app }) => {
  app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth(), VueFireFirestoreOptionsAPI()],
  })
}
