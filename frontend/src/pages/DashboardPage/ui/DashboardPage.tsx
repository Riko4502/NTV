import { Drawer, Layout } from 'antd';
import type React from 'react';
import { useCallback } from 'react';
import { selectNode, toggleAlerts, useAppDispatch, useAppSelector } from '@/app/providers/store';
import { useStreamTopologyQuery } from '@/shared/api';
import { AlertsPanel } from '@/widgets/AlertsPanel';
import { DeviceDetails } from '@/widgets/DeviceDetails';
import { TopologyCanvas } from '@/widgets/TopologyCanvas';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAlertsOpen = useAppSelector((state) => state.ui.isAlertsOpen);
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const { data } = useStreamTopologyQuery();

  const selectedNode = data?.nodes.find((n) => n.id === selectedNodeId);

  const handleToggleAlerts = useCallback(() => {
    dispatch(toggleAlerts());
  }, [dispatch]);

  const handleDeselectNode = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  return (
    <Layout style={{ height: '100%', background: 'transparent' }}>
      <Layout.Content style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <TopologyCanvas />
      </Layout.Content>

      <Drawer
        placement="left"
        title="Лог событий и сбоев"
        mask={false}
        onClose={handleToggleAlerts}
        open={isAlertsOpen}
        size={480}
        styles={{ body: { padding: 0 } }}
        style={{ background: 'var(--bg-panel)', borderRight: '1px solid var(--border-color)' }}
      >
        <AlertsPanel />
      </Drawer>
      <Drawer
        mask={false}
        onClose={handleDeselectNode}
        open={!!selectedNodeId}
        size={340}
        styles={{ body: { padding: 0 } }}
        style={{ background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-color)' }}
      >
        {selectedNode && <DeviceDetails {...selectedNode} />}
      </Drawer>
    </Layout>
  );
};

export default DashboardPage;
