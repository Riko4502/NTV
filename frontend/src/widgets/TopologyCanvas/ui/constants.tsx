import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import type { LayoutDirection } from '@/shared/libs';

export const HEATMAP_METRICS = [
  { label: 'Без карты', value: 'none' },
  { label: 'Нагрузка CPU', value: 'cpu' },
  { label: 'Нагрузка RAM', value: 'ram' },
  { label: 'Темп. ядра', value: 'temp' },
];

export const FILE_OPERATIONS = [
  {
    key: 'export-json',
    label: 'Экспортировать схему в JSON',
    icon: ExportOutlined,
  },
  {
    key: 'import-json',
    label: 'Импортировать схему из JSON',
    icon: ImportOutlined,
  },
];

export interface LayoutDirectionItem {
  value: LayoutDirection;
  label: string;
  icon: typeof ArrowDownOutlined;
}

export const LAYOUT_DIRECTIONS: LayoutDirectionItem[] = [
  {
    value: 'TB',
    label: 'Сверху-Вниз',
    icon: ArrowDownOutlined,
  },
  {
    value: 'LR',
    label: 'Слева-Направо',
    icon: ArrowRightOutlined,
  },
];
