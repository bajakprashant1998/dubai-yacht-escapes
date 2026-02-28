import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useI18n();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border hover:border-primary/30 hover:shadow-sm bg-card transition-all duration-200 text-xs font-medium"
      aria-label="Switch language"
    >
      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
      <span>{locale === "en" ? "عربي" : "EN"}</span>
    </button>
  );
};

export default LanguageSwitcher;
