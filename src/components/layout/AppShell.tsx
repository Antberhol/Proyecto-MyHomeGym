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
import { useEffect, useRef, useState } from 'react'
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
  const { t } = useTranslation()

  return (
    <NavLink
      to={to}
      aria-label={t('appShell.goToAria', { label })}
      className={({ isActive }) =>
        `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${isExpanded ? 'gap-3' : 'justify-center'} ${isActive
          ? 'bg-gym-card-2 text-gym-yellow'
          : 'text-gym-text-dim hover:bg-gym-card-2 hover:text-gym-text-bright'
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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!langDropdownOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [langDropdownOpen])

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
    <div className="min-h-[100dvh] bg-gym-bg-dark text-gym-text-base dark:bg-gym-bg-dark dark:text-gym-text-base">
      <div className="mx-auto flex h-[100dvh] max-w-[1400px] overflow-hidden">
        <aside
          className={`hidden border-r border-gym-border bg-gym-black p-3 transition-all md:block ${sidebarCollapsed ? 'w-[78px]' : 'w-[250px]'
            }`}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={t('appShell.toggleSidebarAria')}
            className={`mb-4 inline-flex w-full items-center rounded-lg border border-gym-border px-3 py-2 text-sm transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : 'gap-2'
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
          <nav aria-label={t('appShell.primaryNavAria')} className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} isExpanded={!sidebarCollapsed} />
            ))}
          </nav>
        </aside>

        <main className="app-main-content flex-1 overflow-y-auto p-4 pb-[calc(6.25rem+env(safe-area-inset-bottom))] sm:p-6 md:pb-6">
          <div className="mb-4 flex items-center justify-end gap-2">
            <div ref={langDropdownRef} className="relative z-50">
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={langDropdownOpen}
                className="flex items-center gap-1 rounded-lg border border-gym-border bg-gym-card px-3 py-2 text-xs font-semibold"
              >
                <span>{currentLanguage === 'es' ? '🇪🇸' : '🇬🇧'}</span>
                <span>{currentLanguage.toUpperCase()}</span>
              </button>

              {langDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-xl border border-gym-border bg-gym-card shadow-lg"
                >
                  {[
                    { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
                    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
                  ].map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      role="option"
                      aria-selected={currentLanguage === option.code}
                      onClick={() => {
                        void changeLanguage(option.code)
                        setLangDropdownOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition hover:bg-gym-card-2 first:rounded-t-xl last:rounded-b-xl ${currentLanguage === option.code
                          ? 'font-semibold text-gym-yellow'
                          : 'text-gym-text-base'
                        }`}
                    >
                      <span>{option.flag}</span>
                      <span>{option.label}</span>
                      {currentLanguage === option.code && (
                        <span className="ml-auto text-gym-yellow">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <SyncStatusIndicator />
          </div>
          <Outlet />
        </main>
      </div>

      <nav
        aria-label={t('appShell.mobileNavAria')}
        className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 border-t border-gym-border bg-gym-black px-2 pt-2 md:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              aria-label={t('appShell.goToAria', { label })}
              className={({ isActive }) =>
                `mobile-bottom-nav-item relative flex flex-col items-center rounded-xl px-1 py-2 text-[11px] font-medium transition ${isActive
                  ? "text-gym-yellow before:content-[''] before:absolute before:top-0 before:left-1/2 before:h-[2px] before:w-10 before:-translate-x-1/2 before:rounded-full before:bg-gym-yellow"
                  : 'text-gym-text-muted'
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