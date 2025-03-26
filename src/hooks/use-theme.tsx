
import React, { createContext, useContext, useEffect, useState } from "react";

// Définition du type pour le contexte de thème
type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Création du contexte pour le thème
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// Fonction pour récupérer la préférence de thème du système
const getSystemTheme = (): "dark" | "light" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light"; // Thème par défaut si matchMedia n'est pas disponible
};

// Fonction pour récupérer le thème initial
const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem("adlab-theme") as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
  }
  return "system";
};

// Provider pour le thème
export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => getInitialTheme() || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Supprimer les classes de thème existantes
    root.classList.remove("light", "dark");
    
    // Ajouter la classe de thème appropriée
    if (theme === "system") {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    // Stocker le thème dans localStorage
    window.localStorage.setItem("adlab-theme", theme);
  }, [theme]);

  // Écoutez les changements de thème du système
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        const root = window.document.documentElement;
        const systemTheme = getSystemTheme();
        
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook pour utiliser le contexte de thème
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
