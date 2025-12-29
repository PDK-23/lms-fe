import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";

type AppState = {
  language: string;
  setLanguage: (lang: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang: string) => {
        set({ language: lang });
        // Keep i18n in sync whenever language is changed
        i18n.changeLanguage(lang);
      },
    }),
    {
      name: "app-storage",
      // After persisted state is rehydrated, ensure i18n uses the stored language
      onRehydrateStorage: () => (state) => {
        if (state?.language) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);
