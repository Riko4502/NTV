import { Button, Card, Divider, Drawer, Flex } from 'antd';
import { CheckCircle2, Flame, ShieldAlert, Zap } from 'lucide-react';
import type { FC } from 'react';
import { sendWsMessage, useStreamTopologyQuery } from '@/shared/api';

interface SimulatorPanelProps {
  open: boolean;
  onClose: () => void;
}

export const SimulatorPanel: FC<SimulatorPanelProps> = ({ open, onClose }) => {
  const { data } = useStreamTopologyQuery();
  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  // Filter online nodes
  const onlineNodes = nodes.filter((n) => n.status !== 'offline');
  const activeEdges = edges.filter((e) => e.status !== 'inactive');

  const handleTriggerDdos = (nodeId: string) => {
    sendWsMessage('trigger-ddos', { nodeId });
  };

  const handleTriggerOverheat = (nodeId: string) => {
    sendWsMessage('trigger-overheat', { nodeId });
  };

  const handleTriggerLatency = (edgeId: string) => {
    sendWsMessage('trigger-latency', { edgeId });
  };

  const handleRecoverAll = () => {
    sendWsMessage('recover-all');
  };

  return (
    <Drawer
      title="Симулятор Сетевых Инцидентов"
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
      styles={{
        body: {
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: 'var(--bg-panel)',
        },
        header: {
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-color)',
        },
      }}
    >
      <Button
        type="primary"
        icon={<CheckCircle2 size={16} />}
        onClick={handleRecoverAll}
        style={{
          width: '100%',
          height: '40px',
          background: 'var(--color-success)',
          borderColor: 'var(--color-success)',
          fontWeight: 600,
          boxShadow: '0 4px 12px var(--color-success-glow)',
        }}
      >
        Восстановить всё в норму
      </Button>

      <Divider style={{ margin: '8px 0', borderColor: 'var(--border-color)' }} />

      <h4
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: 0,
        }}
      >
        Сценарии аварий на Устройствах
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
        {onlineNodes.map((node) => (
          <Card
            key={node.id}
            size="small"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            styles={{ body: { padding: '12px' } }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '8px',
                color: 'var(--text-primary)',
              }}
            >
              {node.label}{' '}
              <span
                style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}
              >
                ({node.ip})
              </span>
            </div>

            <Flex gap="8px">
              <Button
                size="small"
                danger
                icon={<ShieldAlert size={12} />}
                onClick={() => handleTriggerDdos(node.id)}
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                DDoS атака
              </Button>
              <Button
                size="small"
                icon={<Flame size={12} />}
                onClick={() => handleTriggerOverheat(node.id)}
                style={{
                  flex: 1,
                  fontSize: '0.75rem',
                  borderColor: '#d46b08',
                  color: '#d46b08',
                  background: 'rgba(212, 107, 8, 0.08)',
                }}
              >
                Перегрев
              </Button>
            </Flex>
          </Card>
        ))}
      </div>

      <Divider style={{ margin: '8px 0', borderColor: 'var(--border-color)' }} />

      <h4
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: 0,
        }}
      >
        Сценарии на Линиях связи
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
        {activeEdges.map((edge) => {
          const src = nodes.find((n) => n.id === edge.source)?.label || edge.source;
          const tgt = nodes.find((n) => n.id === edge.target)?.label || edge.target;

          return (
            <Card
              key={edge.id}
              size="small"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              styles={{ body: { padding: '12px' } }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                }}
              >
                {src} ── {tgt}
              </div>

              <Button
                size="small"
                danger
                icon={<Zap size={12} />}
                onClick={() => handleTriggerLatency(edge.id)}
                style={{ width: '100%', fontSize: '0.75rem' }}
              >
                Задержка (Latency Spike)
              </Button>
            </Card>
          );
        })}
      </div>
    </Drawer>
  );
};
