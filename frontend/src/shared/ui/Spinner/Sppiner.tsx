import { Flex, Spin, Typography } from 'antd';
import type { FC } from 'react';

interface SpinnerProps {
  loading: boolean;
  tip?: string;
}

export const Spinner: FC<SpinnerProps> = ({ loading, tip }) => {
  if (!loading) return null;

  return (
    <Flex
      align="center"
      justify="center"
      gap={16}
      style={{
        height: '100%',
        color: 'var(--text-secondary)',
      }}
    >
      <Spin size="large" />
      <Typography.Text>{tip}</Typography.Text>
    </Flex>
  );
};
