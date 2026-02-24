export interface User {
  id: string;
  name: string;
  role: 'student' | 'parent' | 'teacher';
  grade: number;
  parentConsent: boolean;
  badges: string[];
  completedSets: number;
  totalSets: number;
}

export interface ExperimentSet {
  id: string;
  title: string;
  subject: string;
  grade: number;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  parts: string[];
  steps: { id: number; text: string; completed: boolean }[];
  curriculumRef: string;
  description: string;
  emoji: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const mockUser: User = {
  id: '1',
  name: 'Elif',
  role: 'student',
  grade: 6,
  parentConsent: true,
  badges: ['b1', 'b2', 'b3'],
  completedSets: 3,
  totalSets: 40,
};

export const mockExperimentSets: ExperimentSet[] = [
  {
    id: '1',
    title: 'Elektrik Devresi',
    subject: 'Fizik',
    grade: 6,
    difficulty: 'Kolay',
    parts: ['LED', 'Pil Yuvası', 'Kablo', 'Anahtar'],
    steps: [
      { id: 1, text: 'Pil yuvasına pili yerleştir', completed: false },
      { id: 2, text: 'Kırmızı kabloyu pilin + ucuna bağla', completed: false },
      { id: 3, text: 'LED\'in uzun bacağını kabloya bağla', completed: false },
      { id: 4, text: 'Anahtarı devreye ekle', completed: false },
      { id: 5, text: 'Devreyi kapat ve LED\'i yak!', completed: false },
    ],
    curriculumRef: 'MEB F.6.4.2',
    description: 'Basit bir elektrik devresi kurarak LED yakma deneyimi',
    emoji: '💡',
  },
  {
    id: '2',
    title: 'Mıknatıs Gücü',
    subject: 'Fizik',
    grade: 5,
    difficulty: 'Kolay',
    parts: ['Mıknatıs', 'Demir Tozu', 'Kağıt', 'Pusula'],
    steps: [
      { id: 1, text: 'Kağıdı düz bir yüzeye koy', completed: false },
      { id: 2, text: 'Demir tozunu kağıdın üzerine serp', completed: false },
      { id: 3, text: 'Mıknatısı kağıdın altına yerleştir', completed: false },
      { id: 4, text: 'Manyetik alan çizgilerini gözlemle', completed: false },
    ],
    curriculumRef: 'MEB F.5.3.1',
    description: 'Mıknatısın manyetik alanını demir tozu ile görselleştirme',
    emoji: '🧲',
  },
  {
    id: '3',
    title: 'Asit-Baz Testi',
    subject: 'Kimya',
    grade: 7,
    difficulty: 'Orta',
    parts: ['Turnusol Kağıdı', 'Limon Suyu', 'Sabun Suyu', 'Su'],
    steps: [
      { id: 1, text: 'Üç bardağa sırasıyla limon suyu, sabun suyu ve su koy', completed: false },
      { id: 2, text: 'Her bardağa turnusol kağıdı batır', completed: false },
      { id: 3, text: 'Renk değişimlerini gözlemle ve kaydet', completed: false },
      { id: 4, text: 'Sonuçları asit-baz tablosuna yerleştir', completed: false },
    ],
    curriculumRef: 'MEB K.7.2.3',
    description: 'Günlük hayattaki maddelerin asit-baz özelliklerini keşfetme',
    emoji: '🧪',
  },
  {
    id: '4',
    title: 'Güneş Sistemi Modeli',
    subject: 'Astronomi',
    grade: 6,
    difficulty: 'Orta',
    parts: ['Strafor Toplar', 'Boya', 'Tel', 'Karton'],
    steps: [
      { id: 1, text: 'Strafor topları gezegen boyutlarına göre ayarla', completed: false },
      { id: 2, text: 'Her gezegeni doğru renkle boya', completed: false },
      { id: 3, text: 'Telleri kartona sabitle', completed: false },
      { id: 4, text: 'Gezegenleri sırasıyla yerleştir', completed: false },
      { id: 5, text: 'Güneş\'i ortaya koy ve modeli tamamla', completed: false },
    ],
    curriculumRef: 'MEB F.6.1.1',
    description: 'Güneş sistemi modelini oluşturarak gezegenleri tanıma',
    emoji: '🪐',
  },
  {
    id: '5',
    title: 'Rüzgar Türbini',
    subject: 'Mühendislik',
    grade: 8,
    difficulty: 'Zor',
    parts: ['Motor', 'Kanatlar', 'Kule', 'LED', 'Kablo'],
    steps: [
      { id: 1, text: 'Kuleyi monte et', completed: false },
      { id: 2, text: 'Motoru kulenin tepesine sabitle', completed: false },
      { id: 3, text: 'Kanatları motor miline tak', completed: false },
      { id: 4, text: 'LED\'i kablolarla motora bağla', completed: false },
      { id: 5, text: 'Kanatları üfleyerek LED\'i yak', completed: false },
    ],
    curriculumRef: 'MEB F.8.4.4',
    description: 'Rüzgar enerjisini elektrik enerjisine dönüştürme',
    emoji: '🌬️',
  },
  {
    id: '6',
    title: 'Bitki Büyüme Deneyi',
    subject: 'Biyoloji',
    grade: 5,
    difficulty: 'Kolay',
    parts: ['Tohum', 'Saksı', 'Toprak', 'Su Ölçer'],
    steps: [
      { id: 1, text: 'Saksıya toprak doldur', completed: false },
      { id: 2, text: 'Tohumu toprağa ek', completed: false },
      { id: 3, text: 'Düzenli olarak sula', completed: false },
      { id: 4, text: 'Büyümeyi günlük ölç ve kaydet', completed: false },
    ],
    curriculumRef: 'MEB B.5.2.1',
    description: 'Bitki büyümesini farklı koşullarda gözlemleme',
    emoji: '🌱',
  },
];

export const mockBadges: Badge[] = [
  { id: 'b1', title: 'İlk Adım', description: 'İlk deneyini tamamladın!', emoji: '🎯', unlocked: true },
  { id: 'b2', title: 'Meraklı Kaşif', description: '3 deney tamamladın', emoji: '🔍', unlocked: true },
  { id: 'b3', title: 'Bilim İnsanı', description: '5 deney tamamladın', emoji: '🔬', unlocked: true },
  { id: 'b4', title: 'Süper Mühendis', description: '10 deney tamamladın', emoji: '⚙️', unlocked: false },
  { id: 'b5', title: 'Deney Ustası', description: '20 deney tamamladın', emoji: '🏆', unlocked: false },
  { id: 'b6', title: 'AI Dostu', description: 'AI asistanla 10 sohbet', emoji: '🤖', unlocked: false },
  { id: 'b7', title: 'Hızlı Öğrenci', description: 'Bir deneyi 5 dakikada bitir', emoji: '⚡', unlocked: false },
  { id: 'b8', title: 'Geleceğin Mühendisi', description: 'Tüm deneyleri tamamla', emoji: '🚀', unlocked: false },
];
