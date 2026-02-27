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
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { SyncStatusIndicator } from '../sync/SyncStatusIndicator'
import { useUiStore } from '../../stores/ui-store'

interface NavEntry {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

function NavItem({
  to,
  label,
  icon: Icon,
  isExpanded,
}: NavEntry & { isExpanded: boolean }) {
  return (
    <NavLink
      to={to}
      aria-label={`Ir a ${label}`}
      className={({ isActive }) =>
        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${isExpanded ? 'gap-3' : 'justify-center'} ${isActive
          ? 'bg-gym-primary text-white'
          : 'text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700'
        }`
      }
    >
      <Icon size={18} className="flex-shrink-0" />
      <span
        className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'max-w-[10rem] opacity-100' : 'max-w-0 opacity-0'
          }`}
      >
        {label}
      </span>
    </NavLink>
  )
}

export function AppShell() {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage } = useLanguage()
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  const navItems: NavEntry[] = [
    { to: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/entrenar', label: t('nav.train'), icon: Dumbbell },
    { to: '/rutinas', label: t('nav.routines'), icon: Workflow },
    { to: '/catalogo', label: t('nav.catalog'), icon: BookOpen },
    { to: '/progreso', label: t('nav.progress'), icon: Activity },
    { to: '/perfil', label: t('nav.profile'), icon: UserCircle },
    { to: '/configuracion', label: t('nav.settings'), icon: Settings },
  ]

  const mobileNavItems: NavEntry[] = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/entrenar', label: t('nav.train'), icon: Dumbbell },
    { to: '/rutinas', label: t('nav.routines'), icon: List },
    { to: '/perfil', label: t('nav.profile'), icon: User },
  ]

  return (
    <div className="min-h-[100dvh] bg-gym-bgLight dark:bg-gym-bgDark dark:text-white">
      <div className="mx-auto flex h-[100dvh] max-w-[1400px] overflow-hidden">
        <aside
          className={`hidden border-r border-slate-200 bg-white p-3 transition-all dark:border-slate-700 dark:bg-gym-cardDark md:block ${sidebarCollapsed ? 'w-[78px]' : 'w-[250px]'
            }`}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Alternar menú lateral"
            className={`mb-4 inline-flex w-full items-center rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-300 dark:border-slate-600 ${sidebarCollapsed ? 'justify-center' : 'gap-2'
              }`}
          >
            <Menu size={16} className="flex-shrink-0" />
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'max-w-0 opacity-0' : 'max-w-[6rem] opacity-100'
                }`}
            >
              {t('common.menu')}
            </span>
          </button>
          <nav aria-label="Navegación principal" className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} isExpanded={!sidebarCollapsed} />
            ))}
          </nav>
        </aside>

        <main className="app-main-content flex-1 overflow-y-auto p-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))] sm:p-6 md:pb-6">
          <div className="mb-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                void changeLanguage(currentLanguage === 'es' ? 'en' : 'es')
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold dark:border-slate-600"
            >
              {currentLanguage === 'es' ? 'EN' : 'ES'}
            </button>
            <SyncStatusIndicator />
          </div>
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Navegación móvil"
        className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/80 px-2 pt-2 backdrop-blur-md dark:border-slate-700 dark:bg-gym-cardDark/80 md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={`Ir a ${label}`}
              className={({ isActive }) =>
                `mobile-bottom-nav-item flex flex-col items-center rounded-xl px-1 py-2 text-[11px] font-medium transition ${isActive
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