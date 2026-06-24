import { Flex, Spin, Typography } from 'antd';
import type { FC } from 'react';
import styles from './Sppiner.module.scss';

interface SpinnerProps {
  loading: boolean;
  tip?: string;
}

export const Spinner: FC<SpinnerProps> = ({ loading, tip }) => {
  if (!loading) return null;

  return (
    <Flex align="center" justify="center" gap={16} className={styles.spinnerWrapper}>
      <Spin size="large" />
      <Typography.Text>{tip}</Typography.Text>
    </Flex>
  );
};
