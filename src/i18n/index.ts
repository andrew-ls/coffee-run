import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enGB from './locales/en-GB.json'

i18n.use(initReactI18next).init({
  lng: 'en-GB',
  fallbackLng: 'en-GB',
  showSupportNotice: false,
  resources: {
    'en-GB': {
      translation: enGB,
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
