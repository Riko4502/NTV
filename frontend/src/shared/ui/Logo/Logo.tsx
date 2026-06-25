import { Flex } from 'antd';
import cn from 'classnames';
import { Activity } from 'lucide-react';
import type { FC } from 'react';
import styles from './Logo.module.scss';

type Size = 'small' | 'medium' | 'large';

type SizeMap<T> = Record<Size, T>;

interface LogoProps {
  title?: string;
  size?: Size;
  isAnimated?: boolean;
  className?: string;
}

const sizeClassMap: SizeMap<string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

const iconSizeMap: SizeMap<number> = {
  small: 18,
  medium: 24,
  large: 32,
};

export const Logo: FC<LogoProps> = ({ className, title, size = 'medium', isAnimated = false }) => {
  const iconSize = iconSizeMap[size];

  const paddingClass = sizeClassMap[size];

  const animationClass = isAnimated ? styles.logoAnimation : '';

  return (
    <>
      <Flex
        align="center"
        justify="center"
        className={cn(styles.logoWrapper, paddingClass, animationClass, className)}
      >
        <Activity size={iconSize} />
      </Flex>
      {title && (
        <span data-testid="header-title" className={styles.logoText}>
          {title}
        </span>
      )}
    </>
  );
};
