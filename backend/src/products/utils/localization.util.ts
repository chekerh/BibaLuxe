/**
 * Utility functions for handling multilingual product data
 */

export type Locale = 'en' | 'fr' | 'ar';

export interface MultilingualText {
  en: string;
  fr?: string;
  ar?: string;
}

export interface MultilingualArray {
  en: string[];
  fr?: string[];
  ar?: string[];
}

/**
 * Get localized text from multilingual object or return string as-is
 */
export function getLocalizedText(
  text: string | MultilingualText | undefined,
  locale: Locale = 'en',
): string {
  if (!text) return '';
  
  // If it's already a string, return it (backward compatibility)
  if (typeof text === 'string') {
    return text;
  }

  // If it's a multilingual object, return the appropriate locale
  if (typeof text === 'object') {
    // Return requested locale, fallback to English, then any available
    return text[locale] || text.en || Object.values(text)[0] || '';
  }

  return '';
}

/**
 * Get localized array from multilingual array or return array as-is
 */
export function getLocalizedArray(
  array: string[] | MultilingualArray | undefined,
  locale: Locale = 'en',
): string[] {
  if (!array) return [];
  
  // If it's already an array, return it (backward compatibility)
  if (Array.isArray(array)) {
    return array;
  }

  // If it's a multilingual object, return the appropriate locale
  if (typeof array === 'object') {
    return array[locale] || array.en || [];
  }

  return [];
}

/**
 * Validate locale parameter
 */
export function isValidLocale(locale: string | undefined): locale is Locale {
  return locale === 'en' || locale === 'fr' || locale === 'ar';
}

/**
 * Get locale from request (defaults to 'en')
 */
export function getLocaleFromRequest(locale?: string): Locale {
  return isValidLocale(locale) ? locale : 'en';
}

