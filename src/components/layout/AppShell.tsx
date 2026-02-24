import {
  Activity,
  BookOpen,
  Dumbbell,
  LayoutDashboard,
  Menu,
  Settings,
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

function NavItem({ to, label, icon: Icon }: (typeof navItems)[number]) {
  return (
    <NavLink
      to={to}
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
          className={`hidden border-r border-slate-200 bg-white p-3 transition-all dark:border-slate-700 dark:bg-gym-cardDark lg:block ${sidebarCollapsed ? 'w-[78px]' : 'w-[250px]'
            }`}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600"
          >
            <Menu size={16} />
            {!sidebarCollapsed && <span>Menú</span>}
          </button>
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </div>
        </aside>

        <main className="flex-1 p-4 pb-24 sm:p-6">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-2 py-2 dark:border-slate-700 dark:bg-gym-cardDark lg:hidden">
        <div className="grid grid-cols-7 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-md px-1 py-2 text-[11px] ${isActive ? 'text-gym-primary' : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}