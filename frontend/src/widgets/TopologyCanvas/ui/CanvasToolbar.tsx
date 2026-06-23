import { Flex } from 'antd';
import type { FC } from 'react';
import type { ConnectionEdgeDto, DeviceData, LayoutDirection } from '@/shared/libs';
import styles from '../TopologyCanvas.module.scss';
import { BackupSection } from './components/BackupSection';
import { EditSection } from './components/EditSection';
import { LayoutSection } from './components/LayoutSection';
import { SearchFilterSection } from './components/SearchFilterSection';

interface CanvasToolbarProps {
  onOpenAddNode: () => void;
  onApplyLayout: (direction: LayoutDirection) => void;
  onFitView: () => void;
  nodesData: DeviceData[];
  edgesData: ConnectionEdgeDto[];
}

export const CanvasToolbar: FC<CanvasToolbarProps> = ({
  onOpenAddNode,
  onApplyLayout,
  onFitView,
  nodesData,
  edgesData,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      gap={8}
      className={styles.glassPanel}
      style={{ flexWrap: 'wrap', padding: '8px 12px' }}
    >
      <SearchFilterSection />

      <div
        style={{
          width: '1px',
          height: '20px',
          background: 'var(--border-color)',
          margin: '0 4px',
        }}
      />

      <EditSection onOpenAddNode={onOpenAddNode} />
      <LayoutSection onApplyLayout={onApplyLayout} onFitView={onFitView} />
      <BackupSection nodesData={nodesData} edgesData={edgesData} />
    </Flex>
  );
};
