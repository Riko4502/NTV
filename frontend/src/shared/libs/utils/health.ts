export const getHealthColor = (health: number): string => {
  if (health > 85) return 'var(--color-success)';
  if (health > 60) return 'var(--color-warning)';
  return 'var(--color-error)';
};

export const getSeverityColor = (value: number): string => {
  if (value > 80) return 'var(--color-error)';
  if (value > 60) return 'var(--color-warning)';
  return 'var(--color-success)';
};
