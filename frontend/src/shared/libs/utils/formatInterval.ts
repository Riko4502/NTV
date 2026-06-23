export const formatInterval = (ms: number): string => {
  const seconds = ms / 1000;

  if (seconds >= 60) {
    const minutes = seconds / 60;
    return `${minutes} мин.`;
  }

  return `${seconds} сек.`;
};
