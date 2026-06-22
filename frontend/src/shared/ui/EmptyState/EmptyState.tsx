import { Flex, Typography } from 'antd';
import type { FC, ReactNode } from 'react';

interface EmptyState {
  icon: ReactNode;
  title: string;
  description?: string;
}

export const EmptyState: FC<EmptyState> = ({ icon, title, description }) => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        color: 'var(--text-muted)',
        padding: '24px',
        textAlign: 'center',
        height: '100%',
      }}
    >
      <Flex flex="column" align="center" gap="12px">
        <Typography.Text>{icon}</Typography.Text>
        <Typography.Text style={{ fontSize: '0.9rem' }}>{title}</Typography.Text>
        <Typography.Text>{description}</Typography.Text>
      </Flex>
    </Flex>
  );
};
