import { CityOption, MadhabOption, CalculationMethodOption } from './types';
import { CITIES, DEFAULT_CITY } from '@/data/cities';

const CITY_KEY = 'amardeen_selected_city';
const MADHAB_KEY = 'amardeen_madhab';
const METHOD_KEY = 'amardeen_calc_method';
const BOOKMARK_KEY = 'amardeen_last_read';
const UMRAH_CHECKLIST_KEY = 'amardeen_umrah_checklist';

export interface QuranBookmark {
  surahNumber: number;
  surahNameBn: string;
  ayahNumber: number;
  updatedAt: string;
}

export function getStoredCity(): CityOption {
  if (typeof window === 'undefined') return DEFAULT_CITY;
  try {
    const saved = localStorage.getItem(CITY_KEY);
    if (!saved) return DEFAULT_CITY;
    const found = CITIES.find((c) => c.id === saved);
    return found || DEFAULT_CITY;
  } catch {
    return DEFAULT_CITY;
  }
}

export function setStoredCity(cityId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CITY_KEY, cityId);
    window.dispatchEvent(new Event('amardeen_city_changed'));
  } catch (e) {
    console.error('Error saving city', e);
  }
}

export function getStoredMadhab(): MadhabOption {
  if (typeof window === 'undefined') return 'HANAFI';
  try {
    const val = localStorage.getItem(MADHAB_KEY) as MadhabOption;
    return val === 'SHAFI' ? 'SHAFI' : 'HANAFI';
  } catch {
    return 'HANAFI';
  }
}

export function setStoredMadhab(madhab: MadhabOption): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MADHAB_KEY, madhab);
    window.dispatchEvent(new Event('amardeen_settings_changed'));
  } catch (e) {
    console.error('Error saving madhab', e);
  }
}

export function getStoredCalcMethod(): CalculationMethodOption {
  if (typeof window === 'undefined') return 'KARACHI';
  try {
    const val = localStorage.getItem(METHOD_KEY) as CalculationMethodOption;
    return val || 'KARACHI';
  } catch {
    return 'KARACHI';
  }
}

export function setStoredCalcMethod(method: CalculationMethodOption): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(METHOD_KEY, method);
    window.dispatchEvent(new Event('amardeen_settings_changed'));
  } catch (e) {
    console.error('Error saving calc method', e);
  }
}

export function getStoredBookmark(): QuranBookmark | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(BOOKMARK_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setStoredBookmark(bookmark: QuranBookmark): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  } catch (e) {
    console.error('Error saving bookmark', e);
  }
}

export function getStoredUmrahChecklist(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(UMRAH_CHECKLIST_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function toggleStoredUmrahChecklist(id: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const current = getStoredUmrahChecklist();
    const updated = { ...current, [id]: !current[id] };
    localStorage.setItem(UMRAH_CHECKLIST_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return {};
  }
}
