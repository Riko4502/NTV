import { Button, Divider, Drawer } from 'antd';
import { CheckCircle2 } from 'lucide-react';
import { type FC, useCallback, useMemo } from 'react';
import { sendWsMessage, useRecoverAllMutation, useStreamTopologyQuery } from '@/shared/api';
import { DeviceScenarioItem } from './components/DeviceScenarioItem';
import { LinkScenarioItem } from './components/LinkScenarioItem';
import styles from './SimulatorPanel.module.scss';

interface SimulatorPanelProps {
  open: boolean;
  onClose: () => void;
}

export const SimulatorPanel: FC<SimulatorPanelProps> = ({ open, onClose }) => {
  const { data } = useStreamTopologyQuery();
  const [recoverAll] = useRecoverAllMutation();
  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  const onlineNodes = useMemo(() => nodes.filter((n) => n.status !== 'offline'), [nodes]);
  const activeEdges = useMemo(() => edges.filter((e) => e.status !== 'inactive'), [edges]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of nodes) {
      map.set(node.id, node.label);
    }
    return map;
  }, [nodes]);

  const handleTriggerDdos = useCallback((nodeId: string) => {
    sendWsMessage('trigger-ddos', { nodeId });
  }, []);

  const handleTriggerOverheat = useCallback((nodeId: string) => {
    sendWsMessage('trigger-overheat', { nodeId });
  }, []);

  const handleTriggerLatency = useCallback((edgeId: string) => {
    sendWsMessage('trigger-latency', { edgeId });
  }, []);

  const handleRecoverAll = useCallback(async () => {
    try {
      await recoverAll().unwrap();
    } catch (err) {
      console.error('Failed to recover all:', err);
    }
  }, [recoverAll]);

  return (
    <Drawer
      title="Симулятор Сетевых Инцидентов"
      placement="right"
      onClose={onClose}
      open={open}
      size={360}
      classNames={{
        body: styles.drawerBody,
        header: styles.drawerHeader,
      }}
    >
      <Button
        type="primary"
        variant="solid"
        icon={<CheckCircle2 size={16} />}
        onClick={handleRecoverAll}
      >
        Восстановить всё в норму
      </Button>

      <Divider className={styles.divider} />

      <h4 className={styles.sectionHeader}>Сценарии аварий на Устройствах</h4>

      <div className={styles.listContainer}>
        {onlineNodes.map((node) => (
          <DeviceScenarioItem
            key={node.id}
            node={node}
            onTriggerDdos={handleTriggerDdos}
            onTriggerOverheat={handleTriggerOverheat}
          />
        ))}
      </div>

      <Divider className={styles.divider} />

      <h4 className={styles.sectionHeader}>Сценарии на Линиях связи</h4>

      <div className={styles.listContainer}>
        {activeEdges.map((edge) => {
          const sourceLabel = nodeMap.get(edge.source) || edge.source;
          const targetLabel = nodeMap.get(edge.target) || edge.target;

          return (
            <LinkScenarioItem
              key={edge.id}
              edge={edge}
              sourceLabel={sourceLabel}
              targetLabel={targetLabel}
              onTriggerLatency={handleTriggerLatency}
            />
          );
        })}
      </div>
    </Drawer>
  );
};
