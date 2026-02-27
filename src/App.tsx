import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'
import { GoogleLoginButton } from './components/auth/GoogleLoginButton'
import { Button } from './components/design-system/Button'
import { AppShell } from './components/layout/AppShell'
import { ReloadPrompt } from './components/pwa/ReloadPrompt'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { useLanguage } from './context/useLanguage'
import { LANGUAGE_STORAGE_KEY } from './i18n'
import { bootstrapDatabase } from './lib/bootstrap'
import { profileRepository } from './repositories/profileRepository'
import { authService } from './services/authService'
import { syncService } from './services/SyncService'
import { useAuthStore } from './stores/auth-store'
import { useUiStore } from './stores/ui-store'

const OnboardingWizard = lazy(() => import('./components/profile/OnboardingWizard').then((module) => ({ default: module.OnboardingWizard })))
const CatalogoPage = lazy(() => import('./pages/Catalogo').then((module) => ({ default: module.CatalogoPage })))
const ExerciseDetailPage = lazy(() => import('./pages/ExerciseDetailPage').then((module) => ({ default: module.ExerciseDetailPage })))
const DashboardPage = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.DashboardPage })))
const EntrenarPage = lazy(() => import('./pages/Entrenar').then((module) => ({ default: module.EntrenarPage })))
const MisRutinasPage = lazy(() => import('./pages/MisRutinas').then((module) => ({ default: module.MisRutinasPage })))
const PerfilPage = lazy(() => import('./pages/Perfil').then((module) => ({ default: module.PerfilPage })))
const ProgresoPage = lazy(() => import('./pages/Progreso').then((module) => ({ default: module.ProgresoPage })))
const ConfiguracionPage = lazy(() => import('./pages/Configuracion').then((module) => ({ default: module.ConfiguracionPage })))

function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/entrenar" element={<EntrenarPage />} />
            <Route path="/rutinas" element={<MisRutinasPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/catalogo/:id" element={<ExerciseDetailPage />} />
            <Route path="/progreso" element={<ProgresoPage />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

function App() {
  const { t } = useTranslation()
  const { changeLanguage } = useLanguage()
  const profileQuery = useLiveQuery(async () => {
    const result = await profileRepository.getProfile()
    return result ?? null
  }, [])
  const theme = useUiStore((state) => state.theme)
  const user = useAuthStore((state) => state.user)
  const isGuest = useAuthStore((state) => state.isGuest)
  const isAuthReady = useAuthStore((state) => state.isAuthReady)
  const enterAsGuest = useAuthStore((state) => state.enterAsGuest)
  const setUser = useAuthStore((state) => state.setUser)
  const setAuthError = useAuthStore((state) => state.setAuthError)
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return stored === 'es' || stored === 'en'
  })

  const languageButtons = useMemo(
    () => [
      { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
      { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    ],
    [],
  )

  useEffect(() => {
    void bootstrapDatabase()
  }, [])

  useEffect(() => {
    syncService.start()

    let cancelled = false

    void (async () => {
      try {
        const redirectUser = await authService.resolveRedirectSignIn()

        if (cancelled) {
          return
        }

        if (redirectUser) {
          setUser(redirectUser)
          await syncService.setAuthenticatedUser(redirectUser)
          setAuthError(undefined)
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        setAuthError(error instanceof Error ? error.message : 'No se pudo completar el inicio de sesión con Google')
      }
    })()

    const unsubscribe = authService.onAuthChanged((authUser) => {
      setUser(authUser)
      void syncService.setAuthenticatedUser(authUser)
    })

    return () => {
      cancelled = true
      unsubscribe()
      syncService.stop()
    }
  }, [setAuthError, setUser])

  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = theme === 'dark' || (theme === 'system' && prefersDark)
    root.classList.toggle('dark', shouldUseDark)
  }, [theme])

  if (!hasSelectedLanguage) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gym-bgLight p-4 dark:bg-gym-bgDark dark:text-white">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-gym-cardDark">
          <h1 className="text-2xl font-bold">{t('languageSelection.title')}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('languageSelection.subtitle')}</p>
          <div className="mt-5 grid grid-cols-1 gap-3">
            {languageButtons.map((option) => (
              <button
                key={option.code}
                type="button"
                className="flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-4 text-lg font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => {
                  void changeLanguage(option.code)
                  setHasSelectedLanguage(true)
                }}
              >
                <span aria-hidden="true" className="text-2xl">{option.flag}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthReady) {
    return <LoadingSpinner />
  }

  if (!user && !isGuest) {
    return (
      <div className="min-h-screen bg-gym-bgLight p-4 dark:bg-gym-bgDark dark:text-white">
        <div className="mx-auto mt-16 w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-gym-cardDark">
          <h1 className="text-2xl font-bold">MyHomeGym</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {t('auth.chooseEntry')}
          </p>
          <div className="mt-4 space-y-3">
            <GoogleLoginButton />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              fullWidth
              onClick={enterAsGuest}
            >
              {t('auth.continueAsGuest')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // undefined = still loading, null = loaded but no profile
  if (profileQuery === undefined) {
    return <LoadingSpinner />
  }

  if (profileQuery === null) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingWizard />
      </Suspense>
    )
  }

  return (
    <>
      <AppRouter />
      <ReloadPrompt />
    </>
  )
}

export default App
