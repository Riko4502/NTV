export const SEVERITY_TAGS = {
  critical: { color: 'error', label: 'Критический' },
  warning: { color: 'warning', label: 'Предупреждение' },
  info: { color: 'processing', label: 'Информация' },
};

export const ALERT_SEVERITY_OPTIONS = [
  { value: 'all', label: 'Все уровни' },
  { value: 'critical', label: 'Критические' },
  { value: 'warning', label: 'Предупреждения' },
  { value: 'info', label: 'Информационные' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'new', label: 'Новые' },
  { value: 'ack', label: 'Подтвержденные' },
];
