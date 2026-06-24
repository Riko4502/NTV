import { Button, Card, Flex } from 'antd';
import { Flame, ShieldAlert } from 'lucide-react';
import { type FC, memo } from 'react';
import type { NodeDto } from '@/entities/device/model/types';
import styles from '../SimulatorPanel.module.scss';

interface DeviceScenarioItemProps {
  node: NodeDto;
  onTriggerDdos: (nodeId: string) => void;
  onTriggerOverheat: (nodeId: string) => void;
}

export const DeviceScenarioItem: FC<DeviceScenarioItemProps> = memo(
  ({ node, onTriggerDdos, onTriggerOverheat }) => {
    return (
      <Card size="small" className={styles.card}>
        <div className={styles.nodeTitle}>
          {node.label} <span className={styles.nodeIp}>({node.ip})</span>
        </div>

        <Flex gap="8px">
          <Button
            size="small"
            danger
            icon={<ShieldAlert size={12} />}
            onClick={() => onTriggerDdos(node.id)}
            className={styles.triggerBtn}
          >
            DDoS атака
          </Button>
          <Button
            size="small"
            icon={<Flame size={12} />}
            onClick={() => onTriggerOverheat(node.id)}
            className={styles.overheatBtn}
          >
            Перегрев
          </Button>
        </Flex>
      </Card>
    );
  },
);

DeviceScenarioItem.displayName = 'DeviceScenarioItem';
