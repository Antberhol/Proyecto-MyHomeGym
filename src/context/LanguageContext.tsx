import { useMemo, useState, type ReactNode } from 'react'
import i18n, { LANGUAGE_STORAGE_KEY } from '../i18n'
import { LanguageContext, type LanguageContextValue } from './language-context'

type AppLanguage = 'es' | 'en'

function getInitialLanguage(): AppLanguage {
  const value = (window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? i18n.language).toLowerCase()
  return value.startsWith('en') ? 'en' : 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(getInitialLanguage)

  const changeLanguage = async (lang: AppLanguage) => {
    await i18n.changeLanguage(lang)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    setCurrentLanguage(lang)
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      currentLanguage,
      changeLanguage,
    }),
    [currentLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

