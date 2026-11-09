import {
  Coordinates,
  CalculationMethod as AdhanMethod,
  PrayerTimes,
  Madhab as AdhanMadhab,
  Prayer,
  Qibla,
} from 'adhan';
import {
  CityOption,
  CalculationMethodOption,
  MadhabOption,
  DayPrayerSchedule,
  PrayerTimeItem,
} from './types';
import {
  formatTime12Bn,
  formatSimpleTimeBn,
  formatTime24,
  getEstimatedHijriDate,
  getGregorianDateBn,
  toBengaliDigits,
} from './utils';

export function getCalculationParameters(
  method: CalculationMethodOption,
  madhab: MadhabOption
) {
  let params;
  switch (method) {
    case 'MUSLIM_WORLD_LEAGUE':
      params = AdhanMethod.MuslimWorldLeague();
      break;
    case 'UMM_AL_QURA':
      params = AdhanMethod.UmmAlQura();
      break;
    case 'EGYPTIAN':
      params = AdhanMethod.Egyptian();
      break;
    case 'NORTH_AMERICA':
      params = AdhanMethod.NorthAmerica();
      break;
    case 'DUBAI':
      params = AdhanMethod.Dubai();
      break;
    case 'KARACHI':
    default:
      params = AdhanMethod.Karachi();
      break;
  }

  params.madhab =
    madhab === 'HANAFI' ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;

  return params;
}

export function calculatePrayerSchedule(
  city: CityOption,
  method: CalculationMethodOption = 'KARACHI',
  madhab: MadhabOption = 'HANAFI',
  date: Date = new Date()
): DayPrayerSchedule {
  const coordinates = new Coordinates(city.latitude, city.longitude);
  const params = getCalculationParameters(method, madhab);
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const now = new Date();
  const currentCode = prayerTimes.currentPrayer(now);
  const nextCode = prayerTimes.nextPrayer(now);

  const fajrEnd = new Date(prayerTimes.sunrise.getTime() - 60000);
  const dhuhrEnd = new Date(prayerTimes.asr.getTime() - 60000);
  const asrEnd = new Date(prayerTimes.maghrib.getTime() - 180000);
  const maghribEnd = new Date(prayerTimes.isha.getTime() - 60000);

  const fajrItem: PrayerTimeItem = {
    id: 'fajr',
    nameEn: 'Fajr',
    nameBn: 'ফজর',
    nameAr: 'الفجر',
    timeFormatted: formatTime12Bn(prayerTimes.fajr),
    time24: formatTime24(prayerTimes.fajr),
    date: prayerTimes.fajr,
    endDate: fajrEnd,
    endTimeFormatted: formatSimpleTimeBn(fajrEnd),
    isCurrent: currentCode === Prayer.Fajr,
    isNext: nextCode === Prayer.Fajr,
    isPassed: now.getTime() > prayerTimes.fajr.getTime(),
  };

  const sunriseItem: PrayerTimeItem = {
    id: 'sunrise',
    nameEn: 'Sunrise',
    nameBn: 'সূর্যোদয়',
    nameAr: 'الشروق',
    timeFormatted: formatTime12Bn(prayerTimes.sunrise),
    time24: formatTime24(prayerTimes.sunrise),
    date: prayerTimes.sunrise,
    isCurrent: currentCode === Prayer.Sunrise,
    isNext: nextCode === Prayer.Sunrise,
    isPassed: now.getTime() > prayerTimes.sunrise.getTime(),
  };

  const dhuhrItem: PrayerTimeItem = {
    id: 'dhuhr',
    nameEn: 'Dhuhr',
    nameBn: 'যোহর',
    nameAr: 'الظهر',
    timeFormatted: formatTime12Bn(prayerTimes.dhuhr),
    time24: formatTime24(prayerTimes.dhuhr),
    date: prayerTimes.dhuhr,
    endDate: dhuhrEnd,
    endTimeFormatted: formatSimpleTimeBn(dhuhrEnd),
    isCurrent: currentCode === Prayer.Dhuhr,
    isNext: nextCode === Prayer.Dhuhr,
    isPassed: now.getTime() > prayerTimes.dhuhr.getTime(),
  };

  const asrItem: PrayerTimeItem = {
    id: 'asr',
    nameEn: 'Asr',
    nameBn: 'আসর',
    nameAr: 'العصر',
    timeFormatted: formatTime12Bn(prayerTimes.asr),
    time24: formatTime24(prayerTimes.asr),
    date: prayerTimes.asr,
    endDate: asrEnd,
    endTimeFormatted: formatSimpleTimeBn(asrEnd),
    isCurrent: currentCode === Prayer.Asr,
    isNext: nextCode === Prayer.Asr,
    isPassed: now.getTime() > prayerTimes.asr.getTime(),
  };

  const maghribItem: PrayerTimeItem = {
    id: 'maghrib',
    nameEn: 'Maghrib',
    nameBn: 'মাগরিব',
    nameAr: 'المغرب',
    timeFormatted: formatTime12Bn(prayerTimes.maghrib),
    time24: formatTime24(prayerTimes.maghrib),
    date: prayerTimes.maghrib,
    endDate: maghribEnd,
    endTimeFormatted: formatSimpleTimeBn(maghribEnd),
    isCurrent: currentCode === Prayer.Maghrib,
    isNext: nextCode === Prayer.Maghrib,
    isPassed: now.getTime() > prayerTimes.maghrib.getTime(),
  };

  const ishaItem: PrayerTimeItem = {
    id: 'isha',
    nameEn: 'Isha',
    nameBn: 'ইশা',
    nameAr: 'العشاء',
    timeFormatted: formatTime12Bn(prayerTimes.isha),
    time24: formatTime24(prayerTimes.isha),
    date: prayerTimes.isha,
    isCurrent: currentCode === Prayer.Isha,
    isNext: nextCode === Prayer.Isha,
    isPassed: now.getTime() > prayerTimes.isha.getTime(),
  };

  const prayers = [fajrItem, sunriseItem, dhuhrItem, asrItem, maghribItem, ishaItem];

  let currentPrayer: PrayerTimeItem | null = null;
  let nextPrayer: PrayerTimeItem | null = null;

  for (const p of prayers) {
    if (p.isCurrent) currentPrayer = p;
    if (p.isNext) nextPrayer = p;
  }

  // If next is none (after Isha), next is tomorrow Fajr
  let remainingMinutes = 0;
  if (nextPrayer) {
    const diffMs = nextPrayer.date.getTime() - now.getTime();
    remainingMinutes = Math.max(0, Math.floor(diffMs / 60000));
  } else {
    // Tomorrow Fajr calculation
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);
    const diffMs = tomorrowTimes.fajr.getTime() - now.getTime();
    remainingMinutes = Math.max(0, Math.floor(diffMs / 60000));
    nextPrayer = {
      ...fajrItem,
      date: tomorrowTimes.fajr,
      timeFormatted: formatTime12Bn(tomorrowTimes.fajr),
    };
  }

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  let remainingTimeFormatted = '';
  if (hours > 0) {
    remainingTimeFormatted = `${toBengaliDigits(hours)} ঘণ্টা ${toBengaliDigits(mins)} মিনিট বাকি`;
  } else {
    remainingTimeFormatted = `${toBengaliDigits(mins)} মিনিট বাকি`;
  }

  // Sahur & Iftar
  const sahurEnd = new Date(prayerTimes.fajr.getTime() - 5 * 60000);
  const sahurEndTimeFormatted = formatTime12Bn(sahurEnd);
  const iftarTimeFormatted = formatTime12Bn(prayerTimes.maghrib);

  // Forbidden Times (হারাম ওয়াক্ত)
  const forbiddenSunrise = `${formatSimpleTimeBn(prayerTimes.sunrise)} - ${formatSimpleTimeBn(new Date(prayerTimes.sunrise.getTime() + 15 * 60000))}`;
  const zawalStart = new Date(prayerTimes.dhuhr.getTime() - 8 * 60000);
  const forbiddenZawal = `${formatSimpleTimeBn(zawalStart)} - ${formatSimpleTimeBn(prayerTimes.dhuhr)}`;
  const sunsetForbidden = `${formatSimpleTimeBn(new Date(prayerTimes.maghrib.getTime() - 15 * 60000))} - ${formatSimpleTimeBn(prayerTimes.maghrib)}`;

  const forbiddenTimes = [
    {
      nameBn: 'সূর্যোদয়ের সময়',
      rangeFormatted: forbiddenSunrise,
      description: 'সূর্যোদয়ের পর থেকে প্রায় ১৫ মিনিট নফল বা সালাত আদায় নিষিদ্ধ।',
    },
    {
      nameBn: 'দ্বিপ্রহর (খরতাপ)',
      rangeFormatted: forbiddenZawal,
      description: 'যোহরের ওয়াক্ত শুরুর ঠিক পূর্বে সূর্য মাথার উপর থাকা অবস্থায় সালাত নিষিদ্ধ।',
    },
    {
      nameBn: 'সূর্যাস্তের সময়',
      rangeFormatted: sunsetForbidden,
      description: 'সূর্য হলুদ বর্ণ ধারণ থেকে সম্পূর্ণ অস্ত যাওয়া পর্যন্ত সালাত নিষিদ্ধ (ঐ দিনের কাজা আসর ব্যতীত)।',
    },
  ];

  return {
    cityName: city.nameBn,
    countryName: city.country,
    date,
    hijriFormatted: getEstimatedHijriDate(date),
    gregorianFormatted: getGregorianDateBn(date),
    fajr: fajrItem,
    sunrise: sunriseItem,
    dhuhr: dhuhrItem,
    asr: asrItem,
    maghrib: maghribItem,
    isha: ishaItem,
    prayers,
    currentPrayer,
    nextPrayer,
    remainingTimeFormatted,
    remainingMinutes,
    sahurEndTimeFormatted,
    iftarTimeFormatted,
    forbiddenTimes,
  };
}

export function calculateNaflTimes(prayerTimes: PrayerTimes) {
  const ishraqStart = new Date(prayerTimes.sunrise.getTime() + 18 * 60000);
  const chashtStart = new Date(prayerTimes.sunrise.getTime() + 90 * 60000);
  const chashtEnd = new Date(prayerTimes.dhuhr.getTime() - 15 * 60000);
  const awabinStart = new Date(prayerTimes.maghrib.getTime() + 15 * 60000);
  const awabinEnd = new Date(prayerTimes.isha.getTime() - 10 * 60000);
  const tahajjudStart = new Date(prayerTimes.isha.getTime() + 90 * 60000);
  const tahajjudEnd = new Date(prayerTimes.fajr.getTime() - 15 * 60000);

  return [
    {
      nameBn: 'তাহাজ্জুদ সালাত',
      timeFormatted: `${formatSimpleTimeBn(tahajjudStart)} - ${formatSimpleTimeBn(tahajjudEnd)}`,
      rakat: '২ থেকে ১২ রাকাত',
      virtue: 'রাতের শেষ তৃতীয়াংশে সালাতুল লাইল সর্বোত্তম নফল ইবাদত।',
    },
    {
      nameBn: 'ইশরাক সালাত',
      timeFormatted: `${formatSimpleTimeBn(ishraqStart)} - ${formatSimpleTimeBn(chashtStart)}`,
      rakat: '২ বা ৪ রাকাত',
      virtue: 'ফজরের পর সূর্যোদয় পর্যন্ত জিকির করে এই নামাজে পূর্ণ হজ ও উমরার সওয়াব রয়েছে।',
    },
    {
      nameBn: 'সালাতুদ দুহা (চাশত)',
      timeFormatted: `${formatSimpleTimeBn(chashtStart)} - ${formatSimpleTimeBn(chashtEnd)}`,
      rakat: '২, ৪ বা ৮ রাকাত',
      virtue: 'শরীরের ৩৬০টি জোড়ের সদকা হিসেবে বিবেচিত হয়।',
    },
    {
      nameBn: 'আওয়াবীন সালাত',
      timeFormatted: `${formatSimpleTimeBn(awabinStart)} - ${formatSimpleTimeBn(awabinEnd)}`,
      rakat: '৬ রাকাত',
      virtue: 'মাগরিবের পর আল্লাহর কাছে বিশেষভাবে ক্ষমা ও আনুগত্যের নামাজ।',
    },
  ];
}

export function calculateMonthSchedule(
  city: CityOption,
  year: number,
  month: number, // 0-indexed
  method: CalculationMethodOption = 'KARACHI',
  madhab: MadhabOption = 'HANAFI'
) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const scheduleList = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day, 12, 0, 0);
    const sched = calculatePrayerSchedule(city, method, madhab, d);
    scheduleList.push({
      day,
      date: d,
      hijri: sched.hijriFormatted,
      fajr: sched.fajr.timeFormatted,
      sunrise: sched.sunrise.timeFormatted,
      dhuhr: sched.dhuhr.timeFormatted,
      asr: sched.asr.timeFormatted,
      maghrib: sched.maghrib.timeFormatted,
      isha: sched.isha.timeFormatted,
      sahurEnd: sched.sahurEndTimeFormatted,
      iftar: sched.iftarTimeFormatted,
    });
  }

  return scheduleList;
}

export function calculateQibla(latitude: number, longitude: number): {
  directionDegrees: number;
  distanceKm: number;
} {
  const coordinates = new Coordinates(latitude, longitude);
  const directionDegrees = Math.round(Qibla(coordinates) * 10) / 10;

  // Haversine formula to Kaaba (21.4225, 39.8262)
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const R = 6371; // Earth's radius in km

  const dLat = ((kaabaLat - latitude) * Math.PI) / 180;
  const dLng = ((kaabaLng - longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((kaabaLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return { directionDegrees, distanceKm };
}
