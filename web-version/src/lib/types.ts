export interface CityOption {
  id: string;
  nameBn: string;
  nameEn: string;
  districtBn: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type MadhabOption = 'HANAFI' | 'SHAFI';

export type CalculationMethodOption =
  | 'KARACHI'
  | 'MUSLIM_WORLD_LEAGUE'
  | 'UMM_AL_QURA'
  | 'EGYPTIAN'
  | 'NORTH_AMERICA'
  | 'DUBAI';

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameEn: string;
  nameBn: string;
  nameAr: string;
  timeFormatted: string;
  time24: string;
  date: Date;
  endDate?: Date;
  endTimeFormatted?: string;
  isCurrent: boolean;
  isNext: boolean;
  isPassed: boolean;
}

export interface DayPrayerSchedule {
  cityName: string;
  countryName: string;
  date: Date;
  hijriFormatted: string;
  gregorianFormatted: string;
  fajr: PrayerTimeItem;
  sunrise: PrayerTimeItem;
  dhuhr: PrayerTimeItem;
  asr: PrayerTimeItem;
  maghrib: PrayerTimeItem;
  isha: PrayerTimeItem;
  prayers: PrayerTimeItem[];
  currentPrayer: PrayerTimeItem | null;
  nextPrayer: PrayerTimeItem | null;
  remainingTimeFormatted: string;
  remainingMinutes: number;
  sahurEndTimeFormatted: string;
  iftarTimeFormatted: string;
  forbiddenTimes: {
    nameBn: string;
    rangeFormatted: string;
    description: string;
  }[];
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  bengaliName: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  pronunciationBn: string;
  translationBn: string;
  audioUrl?: string;
}

export interface SurahContext {
  rukuCount: number;
  namkoron: string;
  shaneNuzul: string;
  fazilat: string;
  tika: string[];
}

export interface DuaCategoryItem {
  id: string;
  nameBn: string;
  descriptionBn: string;
  icon: string;
  order: number;
}

export interface DuaItem {
  id: string;
  titleBn: string;
  categorySlug: string;
  arabic: string;
  transliteration: string;
  translationBn: string;
  reference: string;
  source: string;
  virtue?: string;
}

export interface PresetTasbih {
  id?: string;
  arabic: string;
  nameBn: string;
  pronunciationBn: string;
  meaningBn: string;
  defaultTarget: number;
}

export interface ZikrItem {
  id: string;
  titleBn: string;
  arabic: string;
  transliteration: string;
  translationBn: string;
  countTarget: number;
  reference: string;
  timeOfDay: 'MORNING' | 'EVENING' | 'GENERAL';
  order: number;
}

export interface RamadanDua {
  id: string;
  titleBn: string;
  occasionBn: string;
  arabic: string;
  pronunciationBn: string;
  meaningBn: string;
  reference: string;
}

export interface KnowledgeTopic {
  id: string;
  category: 'salah' | 'sawm' | 'sunnah' | 'manners' | 'zakat';
  titleBn: string;
  summaryBn: string;
  points: string[];
  reference: string;
}

export interface UmrahStepDua {
  arabic: string;
  pronunciationBn: string;
  meaningBn: string;
}

export interface UmrahStep {
  id: number;
  titleBn: string;
  subtitleBn: string;
  descBn: string;
  duas?: UmrahStepDua[];
  tips?: string[];
}

export interface UmrahChecklistItem {
  id: string;
  titleBn: string;
  categoryBn: string;
}
