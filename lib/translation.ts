import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import az from './locales/az.json';
import en from './locales/en.json';

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    lng: deviceLocale.startsWith('az') ? 'az' : 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      az: { translation: az },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;