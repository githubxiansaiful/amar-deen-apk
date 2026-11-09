export function toBengaliDigits(input: string | number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return input
    .toString()
    .replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

export function formatTime12Bn(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minStr = minutes < 10 ? '0' + minutes : minutes.toString();
  return `${toBengaliDigits(hours)}:${toBengaliDigits(minStr)} ${ampm}`;
}

export function formatSimpleTimeBn(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minStr = minutes < 10 ? '0' + minutes : minutes.toString();
  return `${toBengaliDigits(hours)}:${toBengaliDigits(minStr)}`;
}

export function formatTime24(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

const HIJRI_MONTHS_BN = [
  'মুহাররম',
  'সফর',
  'রবিউল আউয়াল',
  'রবিউস সানি',
  'জমাদিউল আউয়াল',
  'জমাদিউস সানি',
  'রজব',
  'শাবান',
  'রমজান',
  'শাওয়াল',
  'জিলকদ',
  'জিলহজ্জ',
];

export function getEstimatedHijriDate(date: Date = new Date()): string {
  // Approximate Hijri algorithm for Bengali display
  // Adjust offset based on Bangladesh Islamic Foundation crescent sighting
  const gYear = date.getFullYear();
  const gMonth = date.getMonth();
  const gDay = date.getDate();

  // Julian day count
  let m = gMonth + 1;
  let y = gYear;
  if (m < 3) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + gDay + b - 1524.5;

  const z = jd - 1948440 + 10632;
  const n = Math.floor((z - 1) / 10631);
  const z2 = z - 10631 * n + 354;
  const j = Math.floor((10985 - z2) / 5316) * Math.floor((50 * z2) / 17719) + Math.floor(z2 / 5670) * Math.floor((43 * z2) / 15238);
  const z3 = z2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const mH = Math.floor((24 * z3) / 709);
  const dH = z3 - Math.floor((709 * mH) / 24);
  const yH = 30 * n + j - 30;

  const monthName = HIJRI_MONTHS_BN[(mH - 1 + 12) % 12] || 'রমজান';
  return `${toBengaliDigits(dH)} ${monthName} ${toBengaliDigits(yH)} হিজরি`;
}

export function getGregorianDateBn(date: Date = new Date()): string {
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const monthsBn = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];
  const dayName = daysBn[date.getDay()];
  const day = toBengaliDigits(date.getDate());
  const monthName = monthsBn[date.getMonth()];
  const year = toBengaliDigits(date.getFullYear());
  return `${dayName}, ${day} ${monthName} ${year}`;
}
