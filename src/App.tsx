import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { AppShell } from './components/layout/AppShell'
import { OnboardingWizard } from './components/profile/OnboardingWizard'
import { bootstrapDatabase } from './lib/bootstrap'
import { db } from './lib/db'
import { useUiStore } from './stores/ui-store'
import { CatalogoPage } from './pages/Catalogo'
import { DashboardPage } from './pages/Dashboard'
import { EntrenarPage } from './pages/Entrenar'
import { MisRutinasPage } from './pages/MisRutinas'
import { PerfilPage } from './pages/Perfil'
import { ProgresoPage } from './pages/Progreso'
import { ConfiguracionPage } from './pages/Configuracion'

function AppRouter() {
  return (
    <BrowserRouter>
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
    return <div className="flex min-h-screen items-center justify-center text-lg">Cargando datos...</div>
  }

  if (profileQuery === null) {
    return <OnboardingWizard />
  }

  return <AppRouter />
}

export default App
