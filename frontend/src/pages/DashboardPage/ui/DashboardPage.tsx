import { Drawer, Layout } from 'antd';
import { type FC, useCallback } from 'react';
import { selectEdge, selectNode, useAppDispatch, useAppSelector } from '@/app/providers/store';
import { useStreamTopologyQuery } from '@/shared/api';
import { DeviceDetails } from '@/widgets/DeviceDetails';
import { EdgeDetails } from '@/widgets/EdgeDetails';
import { TopologyCanvas } from '@/widgets/TopologyCanvas';
import styles from './DashboardPage.module.scss';

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
    <Layout className={styles.pageLayout}>
      <Layout.Content className={styles.contentWrapper}>
        <TopologyCanvas />
      </Layout.Content>
      <Drawer
        mask={false}
        onClose={handleClose}
        open={isOpen}
        size={340}
        title={selectedNodeId ? 'Информация об узле' : 'Информация о соединении'}
        classNames={{ body: styles.drawerBody }}
        className={styles.drawer}
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
