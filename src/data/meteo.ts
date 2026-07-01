export interface LegendStop {
  color: string;
  label: string;
}

export interface MeteoLayer {
  id: string;
  n: number;
  title: string;
  short: string;
  unit: string;
  icon: string;
  desc: string;
  source: string;
  step: string;
  horizon: string;
  legend: LegendStop[];
  danger: number; // индекс порогового значения в легенде
}

export interface Region {
  id: string;
  name: string;
  full: string;
  center: string;
  map?: string;
}

export const REGIONS: Region[] = [
  {
    id: 'cfo',
    name: 'ЦФО',
    full: 'Центральный ФО',
    center: 'Москва',
    map: 'https://cdn.poehali.dev/projects/343215aa-5f78-4f68-9c4c-1d9e7ed1cc43/bucket/8bd1ed97-e47b-4808-88fc-63226448ba91.png',
  },
  {
    id: 'ufo',
    name: 'ЮФО',
    full: 'Южный ФО',
    center: 'Ростов-на-Дону',
    map: 'https://cdn.poehali.dev/projects/343215aa-5f78-4f68-9c4c-1d9e7ed1cc43/files/74bd156e-9f8f-4bfd-b6d4-6d15944e04ee.jpg',
  },
  {
    id: 'skfo',
    name: 'СКФО',
    full: 'Северо-Кавказский ФО',
    center: 'Пятигорск',
    map: 'https://cdn.poehali.dev/projects/343215aa-5f78-4f68-9c4c-1d9e7ed1cc43/files/1d1c1add-2ccb-455f-a1ff-3a04f5d5d24b.jpg',
  },
  {
    id: 'urfo',
    name: 'УФО',
    full: 'Уральский ФО',
    center: 'Екатеринбург',
    map: 'https://cdn.poehali.dev/projects/343215aa-5f78-4f68-9c4c-1d9e7ed1cc43/files/8a335526-e5a1-48ce-a510-acde668d8c15.jpg',
  },
];

export const LAYERS: MeteoLayer[] = [
  {
    id: 'reflectivity',
    n: 1,
    title: 'Радиолокационная отражаемость',
    short: 'Отражаемость',
    unit: 'dBZ',
    icon: 'Radar',
    desc: 'Интенсивность осадков по данным реанализа',
    source: 'ERA5 / COSMO-REA6',
    step: 'шаг 3 ч',
    horizon: '24 ч',
    danger: 5,
    legend: [
      { color: '#0b3d91', label: '5' },
      { color: '#1d9bf0', label: '15' },
      { color: '#2ecc71', label: '25' },
      { color: '#f1c40f', label: '35' },
      { color: '#e67e22', label: '45' },
      { color: '#e74c3c', label: '55' },
      { color: '#c0392b', label: '65' },
      { color: '#8e44ad', label: '75+' },
    ],
  },
  {
    id: 'lightning',
    n: 2,
    title: 'Молниевой потенциал (CAPE)',
    short: 'Молнии',
    unit: 'Дж/кг',
    icon: 'Zap',
    desc: 'Конвективная неустойчивость атмосферы',
    source: 'ERA5 CAPE',
    step: 'шаг 1 ч',
    horizon: '48 ч',
    danger: 4,
    legend: [
      { color: '#12324f', label: '0' },
      { color: '#1f6f8b', label: '250' },
      { color: '#2ecc71', label: '750' },
      { color: '#f1c40f', label: '1500' },
      { color: '#e67e22', label: '2500' },
      { color: '#e74c3c', label: '3500' },
      { color: '#a93226', label: '4000+' },
    ],
  },
  {
    id: 'precip',
    n: 3,
    title: 'Накопление осадков',
    short: 'Осадки',
    unit: 'мм',
    icon: 'CloudRain',
    desc: 'Суммарные осадки за 6–12 ч',
    source: 'ERA5 / CHIRPS',
    step: 'шаг 6 ч',
    horizon: '3–4 сут',
    danger: 5,
    legend: [
      { color: '#0d3b66', label: '1' },
      { color: '#2a9d8f', label: '5' },
      { color: '#43aa8b', label: '10' },
      { color: '#90be6d', label: '20' },
      { color: '#f9c74f', label: '40' },
      { color: '#f8961e', label: '70' },
      { color: '#f3722c', label: '100' },
      { color: '#d62828', label: '150+' },
    ],
  },
  {
    id: 'tornado',
    n: 4,
    title: 'Риск смерча',
    short: 'Смерчи',
    unit: 'индекс',
    icon: 'Tornado',
    desc: 'Оценка вероятности торнадо по SCP',
    source: 'ERA5 + алгоритм SCP',
    step: 'шаг 3 ч',
    horizon: '48 ч',
    danger: 3,
    legend: [
      { color: '#264653', label: 'нет' },
      { color: '#2a9d8f', label: 'низк.' },
      { color: '#e9c46a', label: 'уме­р.' },
      { color: '#f4a261', label: 'выс.' },
      { color: '#e76f51', label: 'экстр.' },
      { color: '#9d0208', label: 'крит.' },
    ],
  },
  {
    id: 'hail',
    n: 5,
    title: 'Диаметр града',
    short: 'Град',
    unit: 'мм',
    icon: 'CloudHail',
    desc: 'Расчётный максимальный диаметр града',
    source: 'ERA5 микрофизика',
    step: 'шаг 3 ч',
    horizon: '48 ч',
    danger: 4,
    legend: [
      { color: '#1a3a5c', label: '0' },
      { color: '#4895ef', label: '10' },
      { color: '#4cc9f0', label: '25' },
      { color: '#80ed99', label: '50' },
      { color: '#ffd60a', label: '75' },
      { color: '#fb8500', label: '100' },
      { color: '#dc2f02', label: '125' },
      { color: '#9d0208', label: '150' },
    ],
  },
  {
    id: 'shear',
    n: 6,
    title: 'Сдвиги ветра на высотах',
    short: 'Сдвиг ветра',
    unit: 'м/с',
    icon: 'Wind',
    desc: 'Векторный сдвиг ветра 0–6 км',
    source: 'ERA5 (850/500 гПа)',
    step: 'шаг 3 ч',
    horizon: '48 ч',
    danger: 4,
    legend: [
      { color: '#22577a', label: '0' },
      { color: '#38a3a5', label: '5' },
      { color: '#57cc99', label: '10' },
      { color: '#80ed99', label: '15' },
      { color: '#c7f9cc', label: '20' },
      { color: '#ffd166', label: '25' },
      { color: '#ef476f', label: '30+' },
    ],
  },
];

export interface AlertItem {
  id: string;
  layer: string;
  region: string;
  value: string;
  level: 'warning' | 'danger';
  time: string;
  place: string;
}

export const ALERTS: AlertItem[] = [
  { id: 'a1', layer: 'Молнии (CAPE)', region: 'ЮФО', value: '3820 Дж/кг', level: 'danger', time: '14:00', place: 'Волгоградская обл.' },
  { id: 'a2', layer: 'Град', region: 'СКФО', value: '95 мм', level: 'danger', time: '15:00', place: 'Ставропольский край' },
  { id: 'a3', layer: 'Осадки', region: 'ЦФО', value: '112 мм / 12ч', level: 'warning', time: '18:00', place: 'Тульская обл.' },
  { id: 'a4', layer: 'Сдвиг ветра', region: 'УФО', value: '28 м/с', level: 'warning', time: '12:00', place: 'Свердловская обл.' },
  { id: 'a5', layer: 'Риск смерча', region: 'ЮФО', value: 'высокий', level: 'danger', time: '16:00', place: 'Ростовская обл.' },
];