import { Background, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { type FC, useMemo, useState } from 'react';
import '@xyflow/react/dist/style.css';

import { useAppSelector } from '@/app/providers/store';
import { ConnectionEdge } from '@/entities/connection';
import { DeviceNode } from '@/entities/device';
import { matchesQuery } from '@/shared/libs/utils';
import { Spinner } from '@/shared/ui';
import { useTopologySync } from './hooks/useTopologySync';
import { AddNodeModal } from './ui/AddNodeModal';
import { CanvasToolbar } from './ui/CanvasToolbar';

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
    handleInteractionStart,
    handleInteractionEnd,
    applyLayout,
    fitView,
  } = useTopologySync();

  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const theme = useAppSelector((state) => state.ui.theme);
  const gridColor = theme === 'dark' ? '#333' : '#cbd5e1';

  // Modal open state
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);

  // Filter nodes by search query
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;
    return nodes.map((node) => ({
      ...node,
      style: {
        ...node.style,
        opacity: matchesQuery(node, searchQuery) ? 1 : 0.25,
        transition: 'opacity 0.3s',
      },
    }));
  }, [nodes, searchQuery]);

  if (isLoading || !data || data.nodes.length === 0) {
    return <Spinner loading={true} tip="Инициализация сетевого холста..." />;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={filteredNodes}
        edges={edges}
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

      {/* Floating Canvas Controls Toolbar overlay */}
      <CanvasToolbar
        onOpenAddNode={() => setIsAddNodeOpen(true)}
        onApplyLayout={applyLayout}
        onFitView={() => fitView({ padding: 0.1, duration: 600 })}
      />

      {/* Add Node Modal */}
      <AddNodeModal open={isAddNodeOpen} onClose={() => setIsAddNodeOpen(false)} />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const TopologyCanvas: FC = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);

export default TopologyCanvas;
