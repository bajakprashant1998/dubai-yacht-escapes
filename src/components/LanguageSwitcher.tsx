import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span>{locale === "en" ? "عربي" : "EN"}</span>
    </button>
  );
};

export default LanguageSwitcher;
