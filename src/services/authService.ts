import {
    type AuthError,
    type Auth,
    GoogleAuthProvider,
    browserLocalPersistence,
    getRedirectResult,
    signInWithRedirect,
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

function mapFirebaseAuthError(error: unknown): Error {
    const code = (error as AuthError | undefined)?.code

    switch (code) {
        case 'auth/popup-blocked':
            return new Error('El navegador bloqueó la ventana de Google. Reintenta o permite popups para este sitio.')
        case 'auth/popup-closed-by-user':
            return new Error('Se cerró la ventana de inicio de sesión antes de completar la autenticación.')
        case 'auth/cancelled-popup-request':
            return new Error('Se canceló el intento de inicio de sesión. Inténtalo de nuevo.')
        case 'auth/unauthorized-domain':
            return new Error('Este dominio no está autorizado en Firebase Auth. Añade el dominio actual en Authorized domains.')
        case 'auth/operation-not-allowed':
            return new Error('El proveedor Google no está habilitado en Firebase Authentication.')
        case 'auth/network-request-failed':
            return new Error('No se pudo conectar con Firebase. Revisa tu conexión e inténtalo de nuevo.')
        default:
            if (error instanceof Error && error.message) {
                return new Error(`No se pudo iniciar sesión con Google: ${error.message}`)
            }
            return new Error('No se pudo iniciar sesión con Google.')
    }
}

export const authService = {
    isAvailable: isFirebaseConfigured,

    async signInWithGoogle(): Promise<AuthUser> {
        const auth = getFirebaseAuthOrThrow()

        await setPersistence(auth, browserLocalPersistence)
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const result = await signInWithPopup(auth, provider)
            return toAuthUser(result.user) as AuthUser
        } catch (popupError) {
            const authErrorCode = (popupError as AuthError | undefined)?.code

            if (
                authErrorCode === 'auth/popup-blocked' ||
                authErrorCode === 'auth/popup-closed-by-user' ||
                authErrorCode === 'auth/cancelled-popup-request' ||
                authErrorCode === 'auth/internal-error'
            ) {
                await signInWithRedirect(auth, provider)
                return new Promise<AuthUser>(() => undefined)
            }

            throw mapFirebaseAuthError(popupError)
        }
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

    async resolveRedirectSignIn(): Promise<AuthUser | null> {
        const auth = getFirebaseAuthOrThrow()

        try {
            const result = await getRedirectResult(auth)
            return toAuthUser(result?.user ?? null)
        } catch (error) {
            throw mapFirebaseAuthError(error)
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
