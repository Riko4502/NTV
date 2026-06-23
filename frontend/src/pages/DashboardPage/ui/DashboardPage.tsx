import { Drawer, Layout } from 'antd';
import { type FC, useCallback } from 'react';
import { selectEdge, selectNode, useAppDispatch, useAppSelector } from '@/app/providers/store';
import { useStreamTopologyQuery } from '@/shared/api';
import { DeviceDetails } from '@/widgets/DeviceDetails';
import { EdgeDetails } from '@/widgets/EdgeDetails';
import { TopologyCanvas } from '@/widgets/TopologyCanvas';

export const DashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const selectedEdgeId = useAppSelector((state) => state.ui.selectedEdgeId);
  const { data } = useStreamTopologyQuery();

  const selectedNode = data?.nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = data?.edges.find((e) => e.id === selectedEdgeId);

  const handleClose = useCallback(() => {
    if (selectedNodeId) dispatch(selectNode(null));
    if (selectedEdgeId) dispatch(selectEdge(null));
  }, [dispatch, selectedNodeId, selectedEdgeId]);

  const isOpen = !!selectedNodeId || !!selectedEdgeId;

  return (
    <Layout style={{ height: '100%', background: 'transparent' }}>
      <Layout.Content style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
        <TopologyCanvas />
      </Layout.Content>
      <Drawer
        mask={false}
        onClose={handleClose}
        open={isOpen}
        size={340}
        title={selectedNodeId ? 'Информация об узле' : 'Информация о соединении'}
        styles={{ body: { padding: 0 } }}
        style={{ background: 'var(--bg-panel)', borderLeft: '1px solid var(--border-color)' }}
      >
        {selectedNode && <DeviceDetails {...selectedNode} />}
        {selectedEdge && data && (
          <EdgeDetails edge={selectedEdge} nodes={data.nodes} onClose={handleClose} />
        )}
      </Drawer>
    </Layout>
  );
};

export default DashboardPage;
