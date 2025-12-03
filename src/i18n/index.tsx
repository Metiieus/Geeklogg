import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import en from "./locales/en";
import pt from "./locales/pt";

type Locale = "en" | "pt";
type Translations = Record<string, string>;

const LOCALES: Record<Locale, Translations> = {
  en,
  pt,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem("locale");
      if (saved === "en" || saved === "pt") return saved;
    } catch (e) {}

    const nav = (typeof navigator !== "undefined" && (navigator.language || "")).toLowerCase();
    if (nav.startsWith("en")) return "en";
    return "pt";
  });

  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
    } catch (e) {}
  }, [locale]);

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) => {
      const dict = LOCALES[locale] || {};
      let text = dict[key] || key;
      if (vars) {
        for (const k of Object.keys(vars)) {
          const v = String(vars[k]);
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        }
      }
      return text;
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
};

// Named exports are declared above; no extra re-export needed.
