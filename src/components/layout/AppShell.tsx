import {
  Activity,
  BookOpen,
  Dumbbell,
  Home,
  LayoutDashboard,
  List,
  Menu,
  Settings,
  User,
  UserCircle,
  Workflow,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useUiStore } from '../../stores/ui-store'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/entrenar', label: 'Entrenar', icon: Dumbbell },
  { to: '/rutinas', label: 'Rutinas', icon: Workflow },
  { to: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { to: '/progreso', label: 'Progreso', icon: Activity },
  { to: '/perfil', label: 'Perfil', icon: UserCircle },
  { to: '/configuracion', label: 'Config', icon: Settings },
]

const mobileNavItems = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/entrenar', label: 'Entrenar', icon: Dumbbell },
  { to: '/rutinas', label: 'Rutinas', icon: List },
  { to: '/perfil', label: 'Perfil', icon: User },
]

function NavItem({ to, label, icon: Icon }: (typeof navItems)[number]) {
  return (
    <NavLink
      to={to}
      aria-label={`Ir a ${label}`}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
          ? 'bg-gym-primary text-white'
          : 'text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700'
        }`
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  )
}

export function AppShell() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  return (
    <div className="min-h-screen bg-gym-bgLight dark:bg-gym-bgDark dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside
          className={`hidden border-r border-slate-200 bg-white p-3 transition-all dark:border-slate-700 dark:bg-gym-cardDark md:block ${sidebarCollapsed ? 'w-[78px]' : 'w-[250px]'
            }`}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Alternar menú lateral"
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
          >
            <Menu size={16} />
            {!sidebarCollapsed && <span>Menú</span>}
          </button>
          <nav aria-label="Navegación principal" className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))] sm:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Navegación móvil"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/80 px-2 pt-2 backdrop-blur-md dark:border-slate-700 dark:bg-gym-cardDark/80 md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={`Ir a ${label}`}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl px-1 py-2 text-[11px] font-medium transition ${isActive
                  ? 'text-gym-primary'
                  : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              <Icon size={24} strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}