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
  setSimulatorOpen: (open: boolean) => void;
}

export const CanvasToolbar: FC<CanvasToolbarProps> = ({
  onOpenAddNode,
  onApplyLayout,
  onFitView,
  nodesData,
  edgesData,
  setSimulatorOpen,
}) => {
  return (
    <Flex
      justify="center"
      align="center"
      gap={8}
      className={`${styles.glassPanel} ${styles.toolbarWrapper}`}
    >
      <SearchFilterSection />

      <div className={styles.toolbarDivider} />

      <EditSection onOpenAddNode={onOpenAddNode} />
      <LayoutSection
        onApplyLayout={onApplyLayout}
        onFitView={onFitView}
        setSimulatorOpen={setSimulatorOpen}
      />
      <BackupSection nodesData={nodesData} edgesData={edgesData} />
    </Flex>
  );
};
