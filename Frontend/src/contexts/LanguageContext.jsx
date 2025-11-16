import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { translations } from "../locales/translations";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  translate: (text, fallback) => fallback ?? text,
});

const STORAGE_KEY = "satya-hospital-language";

const normalizeKey = (value) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value;

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "hi" || stored === "en" ? stored : "en";
  });

  const commitLanguage = useCallback((nextLanguage) => {
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const updated = prev === "en" ? "hi" : "en";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, updated);
      }
      return updated;
    });
  }, []);

  const translate = useCallback(
    (text, fallback) => {
      if (language === "en") {
        return fallback ?? text;
      }

      const key = normalizeKey(text);
      const existingFallback =
        fallback !== undefined ? fallback : typeof text === "string" ? text : "";

      if (!key || typeof key !== "string") {
        return existingFallback;
      }

      const dictionary = translations[language] || {};
      return dictionary[key] || existingFallback;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage: commitLanguage,
      toggleLanguage,
      translate,
    }),
    [language, commitLanguage, toggleLanguage, translate]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);


