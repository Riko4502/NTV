import { Drawer, Layout } from 'antd';
import { type FC, useCallback } from 'react';
import { selectNode, useAppDispatch, useAppSelector } from '@/app/providers/store';
import { useStreamTopologyQuery } from '@/shared/api';
import { DeviceDetails } from '@/widgets/DeviceDetails';
import { TopologyCanvas } from '@/widgets/TopologyCanvas';

export const DashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const { data } = useStreamTopologyQuery();

  const selectedNode = data?.nodes.find((n) => n.id === selectedNodeId);

  const handleDeselectNode = useCallback(() => {
    dispatch(selectNode(null));
  }, [dispatch]);

  return (
    <Layout style={{ height: '100%', background: 'transparent' }}>
      <Layout.Content style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <TopologyCanvas />
      </Layout.Content>
      <Drawer
        mask={false}
        onClose={handleDeselectNode}
        open={!!selectedNodeId}
        size={340}
        title="Информация об узле"
        styles={{ body: { padding: 0 } }}
        style={{ background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-color)' }}
      >
        {selectedNode && <DeviceDetails {...selectedNode} />}
      </Drawer>
    </Layout>
  );
};

export default DashboardPage;
