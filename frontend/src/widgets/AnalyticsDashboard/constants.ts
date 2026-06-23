import { Cpu, HardDrive, Radio, Thermometer } from 'lucide-react';



export const PERIOD_CONFIG: Record<string, { minutes: number; stepMs: number }> = {
  '1m': { minutes: 1, stepMs: 10 * 1000 },
  '3m': { minutes: 3, stepMs: 30 * 1000 },
  '5m': { minutes: 5, stepMs: 60 * 1000 },
};

export const PERIOD_MINUTES = {
  '1m': 1,
  '3m': 3,
  '5m': 5,
};

export const palette = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#f43f5e', // rose
  '#06b6d4', // cyan
];

export const METRICS_ITEMS = [
  {
    id: 'cpu',
    icon: Cpu,
    label: 'Нагрузка CPU',
  },
  {
    id: 'ram',
    icon: HardDrive,
    label: 'RAM Память',
  },
  {
    id: 'temp',
    icon: Thermometer,
    label: 'Температура ЦП',
  },
  {
    id: 'traffic',
    icon: Radio,
    label: 'Трафик',
  },
] as const;
