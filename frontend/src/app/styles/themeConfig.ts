import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';
import type { Theme } from '@/shared/libs';

export const getAntdThemeConfig = (theme: Theme): ThemeConfig => ({
  algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
    fontFamily: 'var(--font-sans)',
  },
  components: {
    Card: {
      colorBgContainer: 'var(--bg-card)',
      colorBorderSecondary: 'var(--border-color)',
    },
    Input: {
      colorBgContainer: 'var(--input-bg)',
      colorBorder: 'var(--border-color)',
    },
  },
});
