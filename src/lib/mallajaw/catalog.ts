export type CountryId = "TN" | "DZ" | "LY";
export type OperatorId = "orange" | "ooredoo" | "telecom";

export type Person = {
  id: string;
  name: string;
  city: string;
  country: CountryId;
  role: string;
};

export type Agency = {
  id: string;
  name: string;
  city: string;
  country: CountryId;
  blurb: string;
  hostIds: string[];
  roomId: string;
  heat: number;
};

export type RoomKind = "agency" | "private";

export type Room = {
  id: string;
  kind: RoomKind;
  title: string;
  topic: string;
  agencyId?: string;
  hostId: string;
  seats: Array<string | null>;
  listeners: number;
  lock?: string;
};

export type Thread = {
  id: string;
  personId: string;
  unread: number;
};

export type DirectMessage = {
  id: string;
  threadId: string;
  authorId: string;
  text: string;
  at: number;
};

export type RoomLine = {
  id: string;
  roomId: string;
  authorId: string;
  text: string;
  at: number;
  kind: "chat" | "gift" | "system";
};

export type LedgerEntry = {
  id: string;
  at: number;
  label: string;
  delta: number;
};

export type Gift = {
  id: string;
  name: string;
  cost: number;
};

export type ScratchCard = {
  code: string;
  country: CountryId;
  operator: OperatorId;
  face: string;
  francs: number;
};

export const COUNTRIES: Array<{ id: CountryId; name: string; dial: string }> = [
  { id: "TN", name: "تونس", dial: "216" },
  { id: "DZ", name: "الجزائر", dial: "213" },
  { id: "LY", name: "ليبيا", dial: "218" },
];

export const OPERATORS: Array<{ id: OperatorId; name: string; latin: string }> = [
  { id: "orange", name: "أورونج", latin: "Orange" },
  { id: "ooredoo", name: "أوريدو", latin: "Ooredoo" },
  { id: "telecom", name: "تيليكوم", latin: "Telecom" },
];

export const GIFTS: Gift[] = [
  { id: "rose", name: "وردة", cost: 30 },
  { id: "coffee", name: "قهوة", cost: 80 },
  { id: "gem", name: "جوهرة", cost: 200 },
  { id: "crown", name: "تاج", cost: 500 },
  { id: "flare", name: "شعلة", cost: 1200 },
];

/** Demo scratch cards only. They never leave the device and do not debit a real line. */
export const SCRATCH_CARDS: ScratchCard[] = [
  { code: "21614000000015", country: "TN", operator: "orange", face: "5 د.ت", francs: 500 },
  { code: "21614000000020", country: "TN", operator: "orange", face: "10 د.ت", francs: 1100 },
  { code: "21615000000015", country: "TN", operator: "ooredoo", face: "5 د.ت", francs: 500 },
  { code: "21615000000040", country: "TN", operator: "ooredoo", face: "20 د.ت", francs: 2400 },
  { code: "21616000000011", country: "TN", operator: "telecom", face: "1 د.ت", francs: 100 },
  { code: "21616000000020", country: "TN", operator: "telecom", face: "10 د.ت", francs: 1100 },
  { code: "21314000000500", country: "DZ", operator: "orange", face: "500 د.ج", francs: 400 },
  { code: "21314000001000", country: "DZ", operator: "orange", face: "1000 د.ج", francs: 900 },
  { code: "21315000000200", country: "DZ", operator: "ooredoo", face: "200 د.ج", francs: 160 },
  { code: "21315000001000", country: "DZ", operator: "ooredoo", face: "1000 د.ج", francs: 900 },
  { code: "21316000000500", country: "DZ", operator: "telecom", face: "500 د.ج", francs: 400 },
  { code: "21316000002000", country: "DZ", operator: "telecom", face: "2000 د.ج", francs: 2000 },
  { code: "21814000000005", country: "LY", operator: "orange", face: "5 د.ل", francs: 900 },
  { code: "21814000000010", country: "LY", operator: "orange", face: "10 د.ل", francs: 1900 },
  { code: "21815000000005", country: "LY", operator: "ooredoo", face: "5 د.ل", francs: 900 },
  { code: "21815000000020", country: "LY", operator: "ooredoo", face: "20 د.ل", francs: 4000 },
  { code: "21816000000010", country: "LY", operator: "telecom", face: "10 د.ل", francs: 1900 },
  { code: "21816000000020", country: "LY", operator: "telecom", face: "20 د.ل", francs: 4000 },
];

export const PEOPLE: Person[] = [
  { id: "yasmine", name: "ياسمين بن يوسف", city: "تونس", country: "TN", role: "رئيسة القاعة" },
  { id: "mehdi", name: "مهدي الشريف", city: "صفاقس", country: "TN", role: "مضيف" },
  { id: "nour", name: "نور الهدى عياد", city: "تونس", country: "TN", role: "مضيفة" },
  { id: "fedi", name: "فادي الجلاصي", city: "الحمامات", country: "TN", role: "صاحب غرفة" },
  { id: "lina", name: "لينا بوعلام", city: "الجزائر", country: "DZ", role: "رئيسة وكالة" },
  { id: "amine", name: "أمين قادري", city: "وهران", country: "DZ", role: "مضيف" },
  { id: "karim", name: "كريم بلقاسم", city: "قسنطينة", country: "DZ", role: "مضيف" },
  { id: "sara", name: "سارة المبروك", city: "طرابلس", country: "LY", role: "رئيسة وكالة" },
  { id: "omar", name: "عمر التومي", city: "بنغازي", country: "LY", role: "مضيف" },
  { id: "huda", name: "هدى الزنتاني", city: "مصراتة", country: "LY", role: "مضيفة" },
];

export const AGENCIES: Agency[] = [
  {
    id: "layali",
    name: "وكالة ليالي تونس",
    city: "تونس",
    country: "TN",
    blurb: "قاعة ليلية هادئة. الورد أكثر هدية، والمقاعد الثمانية ما تمتليش إلا بعد منتصف الليل.",
    hostIds: ["yasmine", "mehdi", "nour"],
    roomId: "r-layali",
    heat: 18400,
  },
  {
    id: "nojoom",
    name: "وكالة نجوم الجزائر",
    city: "الجزائر",
    country: "DZ",
    blurb: "صوت عالي ومقاعد للوكالات. كل هدية تتقسم: الوكالة تأخذ نصيبها والمضيف يأخذ الباقي.",
    hostIds: ["lina", "amine", "karim"],
    roomId: "r-nojoom",
    heat: 12650,
  },
  {
    id: "darb",
    name: "وكالة درب ليبيا",
    city: "طرابلس",
    country: "LY",
    blurb: "سهرة قريبة وكلام واضح. الفرنك هنا يمشي على المايك مباشرة.",
    hostIds: ["sara", "omar", "huda"],
    roomId: "r-darb",
    heat: 9800,
  },
];

const empty = (): Array<string | null> => [null, null, null, null, null, null, null, null];

function seats(ids: Array<string | null>): Array<string | null> {
  const next = empty();
  ids.forEach((id, index) => {
    next[index] = id;
  });
  return next;
}

export const ROOMS: Room[] = [
  {
    id: "r-layali",
    kind: "agency",
    title: "ليالي تونس",
    topic: "سهرة هادية · مقعد للضيوف",
    agencyId: "layali",
    hostId: "yasmine",
    seats: seats(["yasmine", "mehdi", "nour", null, null, null, null, null]),
    listeners: 128,
  },
  {
    id: "r-nojoom",
    kind: "agency",
    title: "نجوم الجزائر",
    topic: "قاعة الوكالة · هدايا مفتوحة",
    agencyId: "nojoom",
    hostId: "lina",
    seats: seats(["lina", "amine", null, "karim", null, null, null, null]),
    listeners: 86,
  },
  {
    id: "r-darb",
    kind: "agency",
    title: "درب ليبيا",
    topic: "مايك قريب · كلام خفيف",
    agencyId: "darb",
    hostId: "sara",
    seats: seats(["sara", null, "omar", "huda", null, null, null, null]),
    listeners: 64,
  },
  {
    id: "r-friends",
    kind: "private",
    title: "سهرة الأصدقاء",
    topic: "غرفة بلا رمز",
    hostId: "fedi",
    seats: seats(["fedi", null, null, null, null, null, null, null]),
    listeners: 7,
  },
  {
    id: "r-family",
    kind: "private",
    title: "مجلس العائلة",
    topic: "غرفة مقفلة",
    hostId: "nour",
    seats: seats(["nour", "huda", null, null, null, null, null, null]),
    listeners: 4,
    lock: "2244",
  },
];

const T = Date.UTC(2026, 9, 11, 20, 0, 0);

export const THREADS: Thread[] = [
  { id: "t-yasmine", personId: "yasmine", unread: 0 },
  { id: "t-lina", personId: "lina", unread: 1 },
  { id: "t-sara", personId: "sara", unread: 0 },
  { id: "t-fedi", personId: "fedi", unread: 1 },
];

export const MESSAGES: DirectMessage[] = [
  { id: "m1", threadId: "t-yasmine", authorId: "yasmine", text: "أهلا. سهرة ليالي تونس مفتوحة. تدخل المايك؟", at: T - 1000 * 60 * 80 },
  { id: "m2", threadId: "t-yasmine", authorId: "me", text: "ندخل بعد شوية. خلّيلي مقعد قدام.", at: T - 1000 * 60 * 70 },
  { id: "m3", threadId: "t-yasmine", authorId: "yasmine", text: "المقعد الرابع ليك. الورد الليلة بثلاثين فرنك.", at: T - 1000 * 60 * 64 },
  { id: "m4", threadId: "t-lina", authorId: "lina", text: "الوكالة محتاجة صوت من تونس. تحب تنضم لنجوم الجزائر؟", at: T - 1000 * 60 * 40 },
  { id: "m5", threadId: "t-sara", authorId: "sara", text: "بعثت لك جو الغرفة. درب ليبيا عامرة شوية.", at: T - 1000 * 60 * 140 },
  { id: "m6", threadId: "t-sara", authorId: "me", text: "واصل. نشحن فرنكات وندخل.", at: T - 1000 * 60 * 120 },
  { id: "m7", threadId: "t-fedi", authorId: "fedi", text: "الغرفة الخاصة بلا رمز الليلة. اجي كي تحب.", at: T - 1000 * 60 * 25 },
];

export const ROOM_LINES: RoomLine[] = [
  { id: "rl1", roomId: "r-layali", authorId: "system", text: "ياسمين فتحت قاعة الوكالة", at: T - 1000 * 60 * 30, kind: "system" },
  { id: "rl2", roomId: "r-layali", authorId: "yasmine", text: "المايك مفتوح للضيوف. تفضلوا.", at: T - 1000 * 60 * 22, kind: "chat" },
  { id: "rl3", roomId: "r-layali", authorId: "mehdi", text: "أهدى وردة إلى ياسمين", at: T - 1000 * 60 * 16, kind: "gift" },
  { id: "rl4", roomId: "r-nojoom", authorId: "lina", text: "مقاعد الوكالة جاهزة.", at: T - 1000 * 60 * 18, kind: "chat" },
  { id: "rl5", roomId: "r-darb", authorId: "sara", text: "من طرابلس، سهرة خفيفة.", at: T - 1000 * 60 * 12, kind: "chat" },
  { id: "rl6", roomId: "r-friends", authorId: "fedi", text: "ادخلوا بلا رمز.", at: T - 1000 * 60 * 9, kind: "chat" },
  { id: "rl7", roomId: "r-family", authorId: "nour", text: "الباب مقفول على الأربعة.", at: T - 1000 * 60 * 50, kind: "chat" },
];

export const WELCOME_LEDGER: LedgerEntry[] = [
  { id: "welcome", at: T - 1000 * 60 * 200, label: "رصيد ترحيبي", delta: 860 },
];

const REPLIES: Record<string, string[]> = {
  yasmine: [
    "حاضر، المقعد ليك كي تدخل القاعة.",
    "الورد يوصلني مباشرة. يعطيك الصحة.",
    "السهرة لسا طويلة، ما تستعجلش.",
  ],
  lina: [
    "إذا انضممت للوكالة، مقاعدك تتحسب مع النجوم.",
    "الهدايا هنا تتقسم ٣٠ للمكتب و٧٠ ليك إذا جلست.",
    "اكتبلي من أي مدينة في تونس.",
  ],
  sara: [
    "درب ليبيا مفتوح. ادخل من الغرف.",
    "الشحن ببطاقة ليبيا يمشي في المحفظة التجريبية.",
    "كي تيجي، سلم على عمر وهدى.",
  ],
  fedi: [
    "الغرفة بلا رمز، اضغط وادخل.",
    "إذا تحب تقفل غرفتك، حط أربعة أرقام وأنت تنشئها.",
    "نسمعك كي تفتح المايك المحلي.",
  ],
  mehdi: ["أنا على المقعد الثاني. ارسل وردة لو تحب.", "صفاقس في الدار الليلة."],
  nour: ["مجلس العائلة رمزه ٢٢٤٤.", "المقعد هادئ، تكلم براحتك."],
  amine: ["وهران حاضرة. القاعة لسا فيها مكان.", "التاج يبان على الشاشة طول."],
  karim: ["قسنطينة تسلم.", "ادخل مقعد فاضي وما تكثرش الهدايا دفعة واحدة."],
  omar: ["بنغازي على الخط.", "القهوة بثمانين فرنك، خفيفة ولطيفة."],
  huda: ["مصراتة معاكم.", "إذا الوكالة عجبتك، انضم من صفحة أنا."],
};

const FALLBACK = [
  "وصلت الرسالة.",
  "نكملوا في الغرفة أحسن.",
  "الفرنك في المحفظة إذا تحب تشحن قبل ما تدخل.",
];

export function replyFor(personId: string, text: string) {
  const list = REPLIES[personId] ?? FALLBACK;
  const index = Math.abs(text.trim().length) % list.length;
  return list[index] ?? list[0] ?? "وصلت.";
}

export function personById(id: string) {
  return PEOPLE.find((person) => person.id === id);
}

export function countryName(id: CountryId) {
  return COUNTRIES.find((country) => country.id === id)?.name ?? id;
}

export function operatorName(id: OperatorId) {
  return OPERATORS.find((operator) => operator.id === id)?.name ?? id;
}

export function clock(at: number) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Tunis",
  }).format(at);
}

export function formatFrancs(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} ف`;
}
