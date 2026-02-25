import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { AppShell } from './components/layout/AppShell'
import { ReloadPrompt } from './components/pwa/ReloadPrompt'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { bootstrapDatabase } from './lib/bootstrap'
import { db } from './lib/db'
import { useUiStore } from './stores/ui-store'

const OnboardingWizard = lazy(() => import('./components/profile/OnboardingWizard').then((module) => ({ default: module.OnboardingWizard })))
const CatalogoPage = lazy(() => import('./pages/Catalogo').then((module) => ({ default: module.CatalogoPage })))
const DashboardPage = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.DashboardPage })))
const EntrenarPage = lazy(() => import('./pages/Entrenar').then((module) => ({ default: module.EntrenarPage })))
const MisRutinasPage = lazy(() => import('./pages/MisRutinas').then((module) => ({ default: module.MisRutinasPage })))
const PerfilPage = lazy(() => import('./pages/Perfil').then((module) => ({ default: module.PerfilPage })))
const ProgresoPage = lazy(() => import('./pages/Progreso').then((module) => ({ default: module.ProgresoPage })))
const ConfiguracionPage = lazy(() => import('./pages/Configuracion').then((module) => ({ default: module.ConfiguracionPage })))

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/entrenar" element={<EntrenarPage />} />
            <Route path="/rutinas" element={<MisRutinasPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
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
    const result = await db.userProfile.toCollection().first()
    return result ?? null
  }, [])
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    void bootstrapDatabase()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = theme === 'dark' || (theme === 'system' && prefersDark)
    root.classList.toggle('dark', shouldUseDark)
  }, [theme])

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
