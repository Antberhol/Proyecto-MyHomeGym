import { Button } from '../design-system/Button'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../stores/auth-store'
import { authService } from '../../services/authService'

export function GoogleLoginButton() {
    const { t } = useTranslation()
    const user = useAuthStore((state) => state.user)
    const isAuthLoading = useAuthStore((state) => state.isAuthLoading)
    const authError = useAuthStore((state) => state.authError)
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle)
    const logout = useAuthStore((state) => state.logout)
    const isFirebaseReady = authService.isAvailable

    return (
        <div className="space-y-2">
            {user ? (
                <div className="flex flex-wrap items-center gap-3">
                    {user.photoURL && (
                        <img
                            src={user.photoURL}
                            alt={user.displayName ?? user.email ?? t('auth.googleUser')}
                            className="h-8 w-8 rounded-full"
                        />
                    )}
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                        {user.displayName ?? user.email ?? t('auth.authenticatedUser')}
                    </p>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => void logout()}
                        disabled={isAuthLoading}
                    >
                        {t('auth.logout')}
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => void loginWithGoogle()}
                    disabled={isAuthLoading || !isFirebaseReady}
                >
                    {isAuthLoading ? t('auth.connecting') : t('auth.loginWithGoogle')}
                </Button>
            )}

            {authError && <p className="text-sm text-red-600">{authError}</p>}
            {!isFirebaseReady && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                    {t('auth.firebaseConfigMissing')}
                </p>
            )}
        </div>
    )
}
