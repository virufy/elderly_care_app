import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { registerLocale } from 'react-datepicker';
import {
  ja, enUS,
} from 'date-fns/locale';

// Locales
import resources from './locales';

registerLocale('ja', ja);
registerLocale('en', enUS);

const DEFAULT_LANG = process.env.REACT_APP_DEFAULT_LANG || 'en';

const namespaces = [
  'main',
  'helpVirufy',
  'consent',
  'beforeStart',
  'recordingsIntroduction',
  'recordingsRecord',
  'recordingsRecordManual',
  'recordingsListen',
  'questionary',
  'beforeSubmit',
  'predictionResult',
  'thankyou',
  'footerReportProblems',
  'stayInTouch',
  'socialIcons',
  'predictionScreen',
  'recordCough',
];

// Translations
i18n
  .use(LanguageDetector) // TODO: KK: might need to remove if do not need language selection
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    ns: namespaces,
    defaultNS: 'main',
    fallbackNS: namespaces,
    missingKeyHandler: false,
    supportedLngs: ['en', 'ja'],
    lng: DEFAULT_LANG,
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });
console.log('Current Language: ', i18n.language);
console.log('bundles en/main:', i18n.getResourceBundle('en', 'main'));
// console.log('bundles ja/main:', i18n.getResourceBundle('ja', 'main'));
export default i18n;
