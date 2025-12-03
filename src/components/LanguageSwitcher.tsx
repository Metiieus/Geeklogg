import React, { useMemo } from "react";
import { useI18n } from "../i18n";

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useI18n();

  const other = useMemo(() => (locale === "pt" ? "en" : "pt"), [locale]);

  return (
    <div className="flex items-center gap-2">
      <button
        title={t ? t("language.switch") : "Switch language"}
        onClick={() => setLocale(other)}
        className="px-2 py-1 rounded-md bg-slate-800/40 hover:bg-slate-700/50 transition-colors text-sm text-slate-200"
      >
        {locale === "pt" ? "PT" : "EN"}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
