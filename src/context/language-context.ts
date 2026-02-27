import { createContext } from 'react'

type AppLanguage = 'es' | 'en'

export interface LanguageContextValue {
    currentLanguage: AppLanguage
    changeLanguage: (lang: AppLanguage) => Promise<void>
}

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)
