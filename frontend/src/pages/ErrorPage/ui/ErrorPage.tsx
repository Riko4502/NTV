import { ArrowLeftOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { CSSProperties, FC } from 'react';
import { useState } from 'react';
import { ERROR_CONFIGS } from './constants';
import styles from './ErrorPage.module.scss';

interface ErrorPageProps {
  code?: string;
  message?: string;
  error?: Error | null;
}

export const ErrorPage: FC<ErrorPageProps> = ({ code = '404', error }) => {
  const [showStack, setShowStack] = useState(false);

  const errorCode = code === '403' || code === '500' ? code : '404';
  const config = ERROR_CONFIGS[errorCode];
  const IconComponent = config.icon;

  const glowColor = `var(--color-${config.colorScheme})`;
  const glowBg = `var(--color-${config.colorScheme}-glow)`;

  const stack =
    (error as unknown as { stack?: string; reason?: string })?.stack ||
    (error as unknown as { reason?: string })?.reason ||
    null;

  return (
    <div
      className={styles.errorPageWrapper}
      style={
        {
          '--glow-color': glowColor,
          '--glow-bg': glowBg,
          '--glow-border': config.glowBorder,
          '--glow-shadow': config.glowShadow,
        } as CSSProperties
      }
    >
      <div className={`${styles.errorCard} glass-panel`}>
        <div className={styles.iconWrapper}>
          <IconComponent />
        </div>
        <h1 className={styles.errorCode}>{code}</h1>
        <h2 className={styles.errorTitle}>{config.title}</h2>
        <p className={styles.errorDesc}>{config.description}</p>

        <div className={styles.btnGroup}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/';
              }
            }}
            className={styles.backBtn}
            size="large"
          >
            Назад
          </Button>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => {
              window.location.href = '/';
            }}
            className={styles.homeBtn}
            size="large"
          >
            На главную
          </Button>
        </div>

        {code === '500' && stack && (
          <div className={styles.stackTrace}>
            <button
              type="button"
              className={styles.stackHeader}
              onClick={() => setShowStack(!showStack)}
            >
              <InfoCircleOutlined />
              <span>{showStack ? 'Скрыть технические детали' : 'Показать технические детали'}</span>
            </button>
            {showStack && <pre className={styles.stackContent}>{stack}</pre>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
