export const STATUS = {
  excellent: {
    color: 'success',
    label: 'Идеально',
  },
  good: {
    color: 'processing',
    label: 'Стабильно',
  },
  warning: {
    color: 'warning',
    label: 'Требует внимания',
  },
};

export const SLA_COLOR_RULES = [
  { check: (sla: number) => sla >= 99.9, color: 'var(--color-success)' },
  { check: (sla: number) => sla >= 99.8, color: 'var(--color-warning)' },
  { check: (_sla: number) => true, color: 'var(--color-error)' },
];
