'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { translations, Language, TranslationKeys } from './translations'

const LANGUAGE_STORAGE_KEY = 'contently-language'
const DEFAULT_LANGUAGE: Language = 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
  switchLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE)
  const [mounted, setMounted] = useState(false)

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguageState(savedLanguage)
    }
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = lang
  }, [])

  const switchLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'fr' : 'en'
    setLanguage(newLang)
  }, [language, setLanguage])

  // Get translations for current language
  const t = translations[language]

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{
          language: DEFAULT_LANGUAGE,
          setLanguage,
          t: translations[DEFAULT_LANGUAGE] as TranslationKeys,
          switchLanguage,
        }}
      >
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: t as TranslationKeys,
        switchLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Helper hook for quick access to translations
export function useTranslation() {
  const { t, language } = useLanguage()
  return { t, language }
}
