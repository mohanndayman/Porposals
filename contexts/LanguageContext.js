import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import en from "../translations/en.json";
import ar from "../translations/ar.json";

// Safe translation utility
const safeTranslate = (translations, key, fallback = "") => {
  // If key is not a string or translations is not an object, return fallback
  if (
    typeof key !== "string" ||
    typeof translations !== "object" ||
    translations === null
  ) {
    return fallback;
  }

  // Split the key into parts to handle nested translations
  const keyParts = key.split(".");

  let currentValue = translations;

  // Traverse the nested object
  for (const part of keyParts) {
    // If we can't find the next level, return fallback
    if (!currentValue || typeof currentValue !== "object") {
      return fallback;
    }

    currentValue = currentValue[part];
  }

  // If final value is an object, try to extract a string
  if (typeof currentValue === "object") {
    // Try to find a string value in common keys
    const stringKeys = ["value", "label", "text", "title", "name"];
    for (const stringKey of stringKeys) {
      if (
        currentValue[stringKey] &&
        typeof currentValue[stringKey] === "string"
      ) {
        return currentValue[stringKey];
      }
    }

    // If no string key found, try to convert object to string
    try {
      return Object.values(currentValue)
        .filter((val) => val !== null && val !== undefined)
        .map(String)
        .join(", ");
    } catch {
      return fallback;
    }
  }

  // If it's a string, return it
  if (typeof currentValue === "string") {
    return currentValue;
  }

  // Convert to string or return fallback
  return currentValue !== null && currentValue !== undefined
    ? String(currentValue)
    : fallback;
};

// Initialize translations
const i18n = new I18n({
  en,
  ar,
});

// Create a context for language
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState("en");
  const [isRTL, setIsRTL] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize language on app load
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLanguage");
        if (savedLocale) {
          setLocale(savedLocale);
          const shouldBeRTL = savedLocale === "ar";
          setIsRTL(shouldBeRTL);

          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);
          }
        } else {
          // FIX: Add null/undefined checks for Localization.locale
          let deviceLocale = "en"; // Default fallback

          try {
            // Check if Localization.locale exists and is a string
            if (
              Localization.locale &&
              typeof Localization.locale === "string"
            ) {
              deviceLocale = Localization.locale.split("-")[0];
            } else if (
              Localization.locales &&
              Array.isArray(Localization.locales) &&
              Localization.locales.length > 0
            ) {
              // Fallback to first locale in locales array
              deviceLocale = Localization.locales[0].split("-")[0];
            }
          } catch (localeError) {
            console.warn(
              "Error getting device locale, using default 'en':",
              localeError
            );
            deviceLocale = "en";
          }

          const initialLocale = ["en", "ar"].includes(deviceLocale)
            ? deviceLocale
            : "en";
          const shouldBeRTL = initialLocale === "ar";

          setLocale(initialLocale);
          setIsRTL(shouldBeRTL);

          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(shouldBeRTL);
            I18nManager.forceRTL(shouldBeRTL);
          }

          await AsyncStorage.setItem("userLanguage", initialLocale);
        }
        setIsReady(true);
      } catch (error) {
        console.error("Failed to load language settings:", error);
        // FIX: Ensure we still set a default locale even if everything fails
        setLocale("en");
        setIsRTL(false);
        setIsReady(true);
      }
    };

    loadLocale();
  }, []);

  // Improved changeLanguage function without forced restarts
  const changeLanguage = async (newLocale) => {
    try {
      if (!newLocale || typeof newLocale !== "string") {
        console.error("Invalid locale provided to changeLanguage:", newLocale);
        return;
      }

      if (newLocale !== locale) {
        const shouldBeRTL = newLocale === "ar";

        // Save the language preference
        await AsyncStorage.setItem("userLanguage", newLocale);

        // Update the locale state immediately for instant UI changes
        setLocale(newLocale);
        setIsRTL(shouldBeRTL);

        // Update RTL settings without forcing restart
        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);
          
          // Note: RTL changes will take effect on next app launch
          // No need to force restart - modern React Native handles this gracefully
        }
      }
    } catch (error) {
      console.error("Failed to save language setting:", error);
    }
  };

  // Set up i18n configuration
  i18n.locale = locale;
  i18n.enableFallback = true;

  // Custom translate function using safe translation
  const t = (key, options) => {
    // FIX: Add validation for key parameter
    if (!key || typeof key !== "string") {
      console.warn("Invalid translation key:", key);
      return String(key) || "";
    }

    // Use safeTranslate to handle complex translation objects
    const translations = locale === "ar" ? ar : en;

    // First try i18n translation
    try {
      const originalTranslation = i18n.t(key, options);

      // If original translation is an object, use safeTranslate
      if (typeof originalTranslation === "object") {
        return safeTranslate(translations, key, key);
      }

      // If it's a string, return it
      if (typeof originalTranslation === "string") {
        return originalTranslation;
      }
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
    }

    // Fallback to safeTranslate with parameter interpolation
    let translatedText = safeTranslate(translations, key, key);
    
    // Handle parameter interpolation manually if options are provided
    if (options && typeof translatedText === "string") {
      Object.keys(options).forEach(param => {
        const regex = new RegExp(`\\{\\{${param}\\}\\}`, 'g');
        translatedText = translatedText.replace(regex, options[param]);
      });
    }
    
    return translatedText;
  };

  if (!isReady) {
    // You could return a loading screen here
    return null;
  }

  return (
    <LanguageContext.Provider value={{ locale, isRTL, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
