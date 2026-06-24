import { Flex, Typography } from 'antd';
import type { FC, ReactNode } from 'react';
import styles from './EmptyState.module.scss';

interface EmptyState {
  icon: ReactNode;
  title: string;
  description?: string;
}

export const EmptyState: FC<EmptyState> = ({ icon, title, description }) => {
  return (
    <Flex align="center" justify="center" className={styles.container}>
      <Flex vertical align="center" gap="12px">
        <Typography.Text>{icon}</Typography.Text>
        <Typography.Text className={styles.title}>{title}</Typography.Text>
        <Typography.Text>{description}</Typography.Text>
      </Flex>
    </Flex>
  );
};
