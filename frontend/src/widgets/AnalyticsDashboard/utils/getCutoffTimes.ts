import type { Dayjs } from 'dayjs';

const PREDEFINED_PERIODS: Record<string, number> = {
  '1m': 1,
  '3m': 3,
  '5m': 5,
};

const getPredefinedCutoff = (period: string, now: number) => {
  const minutes = PREDEFINED_PERIODS[period];
  return minutes ? now - minutes * 60 * 1000 : 0;
};

// Вспомогательная функция для расчёта временных фильтров при выборе периода
export const getCutoffTimes = (
  timePeriod: string,
  customDateRange: [Dayjs | null, Dayjs | null] | null,
) => {
  const now = Date.now();

  if (timePeriod === 'custom' && customDateRange?.[0] && customDateRange?.[1]) {
    return {
      cutoffMs: customDateRange[0].valueOf(),
      endCutoffMs: customDateRange[1].valueOf(),
    };
  }

  return {
    cutoffMs: getPredefinedCutoff(timePeriod, now),
    endCutoffMs: 0,
  };
};
