import {
    type Auth,
    GoogleAuthProvider,
    browserLocalPersistence,
    onAuthStateChanged,
    setPersistence,
    signInWithPopup,
    signOut,
    type User,
} from 'firebase/auth'
import { db } from '../lib/db'
import { firebaseAuth, isFirebaseConfigured } from './firebase'

export interface AuthUser {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
}

function toAuthUser(user: User | null): AuthUser | null {
    if (!user) return null

    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    }
}

function getFirebaseAuthOrThrow(): Auth {
    if (!isFirebaseConfigured || !firebaseAuth) {
        throw new Error('Firebase no está configurado. Define VITE_FIREBASE_* en .env.local (local) y en GitHub Secrets/Variables (deploy).')
    }

    return firebaseAuth
}

export const authService = {
    isAvailable: isFirebaseConfigured,

    async signInWithGoogle(): Promise<AuthUser> {
        const auth = getFirebaseAuthOrThrow()

        await setPersistence(auth, browserLocalPersistence)
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)

        return toAuthUser(result.user) as AuthUser
    },

    async signOut(): Promise<void> {
        const auth = getFirebaseAuthOrThrow()

        try {
            await signOut(auth)
        } finally {
            try {
                await db.delete()
            } catch (error) {
                void error
            }

            localStorage.removeItem('auth-storage')
            localStorage.removeItem('sync-storage')
            localStorage.removeItem('ui-storage')
            window.location.reload()
        }
    },

    onAuthChanged(callback: (user: AuthUser | null) => void): () => void {
        if (!isFirebaseConfigured || !firebaseAuth) {
            callback(null)
            return () => undefined
        }

        return onAuthStateChanged(firebaseAuth, (user) => {
            callback(toAuthUser(user))
        })
    },
}
