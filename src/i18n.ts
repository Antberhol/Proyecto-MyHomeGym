import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

export const LANGUAGE_STORAGE_KEY = 'myhomegym-language'

const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
const initialLanguage = storedLanguage === 'en' || storedLanguage === 'es' ? storedLanguage : 'es'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: initialLanguage,
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
