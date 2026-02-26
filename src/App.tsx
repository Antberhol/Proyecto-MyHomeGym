import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { GoogleLoginButton } from './components/auth/GoogleLoginButton'
import { Button } from './components/design-system/Button'
import { AppShell } from './components/layout/AppShell'
import { ReloadPrompt } from './components/pwa/ReloadPrompt'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
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

  useEffect(() => {
    void bootstrapDatabase()
  }, [])

  useEffect(() => {
    syncService.start()

    const unsubscribe = authService.onAuthChanged((authUser) => {
      setUser(authUser)
      void syncService.setAuthenticatedUser(authUser)
    })

    return () => {
      unsubscribe()
      syncService.stop()
    }
  }, [setUser])

  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = theme === 'dark' || (theme === 'system' && prefersDark)
    root.classList.toggle('dark', shouldUseDark)
  }, [theme])

  if (!isAuthReady) {
    return <LoadingSpinner />
  }

  if (!user && !isGuest) {
    return (
      <div className="min-h-screen bg-gym-bgLight p-4 dark:bg-gym-bgDark dark:text-white">
        <div className="mx-auto mt-16 w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-gym-cardDark">
          <h1 className="text-2xl font-bold">MyHomeGym</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Elige cómo quieres entrar: con Google para sincronizar en la nube o como invitado sin sincronización.
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
              Entrar como invitado (sin sincronización en la nube)
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
