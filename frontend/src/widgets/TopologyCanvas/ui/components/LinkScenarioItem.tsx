import { Button, Card } from 'antd';
import { Zap } from 'lucide-react';
import { type FC, memo } from 'react';
import type { ConnectionEdgeDto } from '@/entities/connection/model/types';
import styles from '../SimulatorPanel.module.scss';

interface LinkScenarioItemProps {
  edge: ConnectionEdgeDto;
  sourceLabel: string;
  targetLabel: string;
  onTriggerLatency: (edgeId: string) => void;
}

export const LinkScenarioItem: FC<LinkScenarioItemProps> = memo(
  ({ edge, sourceLabel, targetLabel, onTriggerLatency }) => {
    return (
      <Card size="small" className={styles.card}>
        <div className={styles.edgeTitle}>
          {sourceLabel} ── {targetLabel}
        </div>

        <Button
          danger
          icon={<Zap size={12} />}
          onClick={() => onTriggerLatency(edge.id)}
          className={styles.latencyBtn}
        >
          Задержка (Latency Spike)
        </Button>
      </Card>
    );
  },
);

LinkScenarioItem.displayName = 'LinkScenarioItem';
