import { Background, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { type FC, useMemo, useState } from 'react';
import '@xyflow/react/dist/style.css';

import { useAppSelector } from '@/app/providers/store';
import { ConnectionEdge } from '@/entities/connection';
import { DeviceNode } from '@/entities/device';
import { matchesQuery } from '@/shared/libs/utils';
import { Spinner } from '@/shared/ui';
import { useTopologySync } from './hooks/useTopologySync';
import styles from './TopologyCanvas.module.scss';
import { AddEdgeModal } from './ui/AddEdgeModal';
import { AddNodeModal } from './ui/AddNodeModal';
import { CanvasToolbar } from './ui/CanvasToolbar';
import { SimulatorPanel } from './ui/SimulatorPanel';

// Register custom components outside to avoid re-renders
const nodeTypes = {
  router: DeviceNode,
  switch: DeviceNode,
  server: DeviceNode,
  client: DeviceNode,
  firewall: DeviceNode,
};

const edgeTypes = {
  active: ConnectionEdge,
  inactive: ConnectionEdge,
  congested: ConnectionEdge,
};

const CanvasInner: FC = () => {
  const {
    data,
    isLoading,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onConnect,
    connectModalData,
    handleConnectSubmit,
    handleConnectClose,
    handleInteractionStart,
    handleInteractionEnd,
    applyLayout,
    fitView,
  } = useTopologySync();

  const [simulatorOpen, setSimulatorOpen] = useState(false);

  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const theme = useAppSelector((state) => state.ui.theme);
  const hideClients = useAppSelector((state) => state.ui.hideClients);
  const gridColor = theme === 'dark' ? '#333' : '#cbd5e1';

  // Modal open state
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);

  // Filter nodes by search query and type
  const filteredNodes = useMemo(() => {
    let result = nodes;
    if (hideClients) {
      result = nodes.filter((node) => node.data?.type !== 'client');
    }
    if (!searchQuery) return result;
    return result.map((node) => ({
      ...node,
      style: {
        ...node.style,
        opacity: matchesQuery(node, searchQuery) ? 1 : 0.25,
        transition: 'opacity 0.3s',
      },
    }));
  }, [nodes, searchQuery, hideClients]);

  // Filter edges connected to hidden client nodes
  const filteredEdges = useMemo(() => {
    if (!hideClients) return edges;
    const clientNodeIds = nodes
      .filter((node) => node.data?.type === 'client')
      .map((node) => node.id);
    return edges.filter(
      (edge) => !clientNodeIds.includes(edge.source) && !clientNodeIds.includes(edge.target),
    );
  }, [edges, nodes, hideClients]);

  if (isLoading || !data || !data.nodes.length) {
    return <Spinner loading={true} tip="Инициализация сетевого холста..." />;
  }

  return (
    <div className={styles.canvasContainer}>
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeDragStart={handleInteractionStart}
        onNodeDragStop={handleInteractionEnd}
        onMoveStart={handleInteractionStart}
        onMoveEnd={handleInteractionEnd}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color={gridColor} gap={24} size={2} />
      </ReactFlow>

      <CanvasToolbar
        onOpenAddNode={() => setIsAddNodeOpen(true)}
        onApplyLayout={applyLayout}
        onFitView={() => fitView({ padding: 0.1, duration: 600 })}
        nodesData={data.nodes}
        edgesData={data.edges}
        setSimulatorOpen={setSimulatorOpen}
      />

      <AddNodeModal open={isAddNodeOpen} onClose={() => setIsAddNodeOpen(false)} />

      {connectModalData && (
        <AddEdgeModal
          open={!!connectModalData}
          onClose={handleConnectClose}
          onSubmit={handleConnectSubmit}
          sourceLabel={connectModalData.sourceLabel}
          targetLabel={connectModalData.targetLabel}
        />
      )}

      {/* Network incident simulator panel */}
      <SimulatorPanel open={simulatorOpen} onClose={() => setSimulatorOpen(false)} />
    </div>
  );
};

export const TopologyCanvas: FC = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);

export default TopologyCanvas;
