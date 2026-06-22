import type {
  EdgeMouseHandler,
  NodeMouseHandler,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';

import { AppstoreOutlined, FullscreenOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip } from 'antd';
import {
  selectEdge,
  selectNode,
  setLayoutDirection,
  useAppDispatch,
  useAppSelector,
} from '@/app/providers/store';
import { ConnectionEdge } from '@/entities/connection';
import { DeviceNode } from '@/entities/device';
import { useStreamTopologyQuery } from '@/shared/api';
import { useLayout } from '@/shared/hooks';
import type { EdgeBase, LayoutDirection, NodeBase } from '@/shared/libs';
import { matchesQuery } from '@/shared/libs/utils';
import { Spinner } from '@/shared/ui';

import styles from './TopologyCanvas.module.scss';

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
  const dispatch = useAppDispatch();

  // Ссылки на взаимодействие для предотвращения сбоев в компоновке, когда пользователь активно взаимодействует с графом
  const isInteractingRef = useRef(false);
  const latestDataRef = useRef<typeof data | null>(null);

  const { data, isLoading } = useStreamTopologyQuery();
  const { getLayoutedElements } = useLayout();
  const { setCenter, getNode, fitView } = useReactFlow();

  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const theme = useAppSelector((state) => state.ui.theme);

  const gridColor = theme === 'dark' ? '#333' : '#cbd5e1';

  // Локальное состояние для узлов и ребер графа React Flow
  const [nodes, setNodes] = useState<NodeBase[]>([]);
  const [edges, setEdges] = useState<EdgeBase[]>([]);

  // Применение компоновки при загрузке узлов/ребер или изменении компоновки
  const applyLayout = useCallback(
    (direction: LayoutDirection) => {
      if (!data) return;

      const initialNodes = data.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        data: n,
        position: { x: 0, y: 0 },
      }));

      const initialEdges = data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.status,
        data: e,
        animated: e.status === 'active' || e.status === 'congested',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color:
            e.status === 'congested'
              ? 'var(--color-error)'
              : e.status === 'active'
                ? 'var(--color-primary)'
                : 'rgba(255,255,255,0.1)',
          width: 12,
          height: 12,
        },
      }));

      const layouted = getLayoutedElements(initialNodes, initialEdges, direction);

      setNodes(layouted.nodes);
      setEdges(layouted.edges);

      setTimeout(() => {
        fitView({ padding: 0.15, duration: 600 });
      }, 50);
    },
    [data, getLayoutedElements, fitView],
  );

  // Первоначальное применение компоновки
  useEffect(() => {
    if (data?.nodes.length && !nodes.length) {
      applyLayout(layoutDirection);
    }
  }, [data, applyLayout, layoutDirection, nodes.length]);

  // Сохранение последней ссылки на данные в фоновом режиме
  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  // Синхронизация телеметрии (сохранение позиций, обновление только данных)
  const syncTelemetry = useCallback(
    (syncData: typeof data) => {
      if (!syncData) return;

      setNodes((prevNodes) => {
        if (!prevNodes.length) return [];

        return prevNodes.map((node) => {
          const fresh = syncData.nodes.find((n) => n.id === node.id);
          if (fresh) {
            return {
              ...node,
              data: fresh,
              className: fresh.id === selectedNodeId ? 'react-flow__node-selected' : '',
            };
          }
          return node;
        });
      });

      setEdges((prevEdges) => {
        if (!prevEdges.length) return [];

        return prevEdges.map((edge) => {
          const fresh = syncData.edges.find((e) => e.id === edge.id);
          if (fresh) {
            return {
              ...edge,
              type: fresh.status,
              data: fresh,
              animated: fresh.status === 'active' || fresh.status === 'congested',
            };
          }
          return edge;
        });
      });
    },
    [selectedNodeId],
  );

  // Real-time telemetry synchronization (keep positions, only update data in-place)
  useEffect(() => {
    if (!data) return;
    if (isInteractingRef.current) return; // Skip updating state during user dragging/panning to prevent stutter

    syncTelemetry(data);
  }, [data, syncTelemetry]);

  const handleInteractionStart = useCallback(() => {
    isInteractingRef.current = true;
  }, []);

  const handleInteractionEnd = useCallback(() => {
    isInteractingRef.current = false;
    if (latestDataRef.current) {
      syncTelemetry(latestDataRef.current);
    }
  }, [syncTelemetry]);

  // Синхронизация изменений узлов от перетаскивания пользователем
  const onNodesChange: OnNodesChange<NodeBase> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  // Синхронизация изменений ребер от перетаскивания пользователем
  const onEdgesChange: OnEdgesChange<EdgeBase> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // Обработка клика на элементе холста
  const onNodeClick: NodeMouseHandler<NodeBase> = (_event, node) => {
    dispatch(selectNode(node.id));
  };

  const onEdgeClick: EdgeMouseHandler<EdgeBase> = (_event, edge) => {
    dispatch(selectEdge(edge.id));
  };

  const onPaneClick = () => {
    dispatch(selectNode(null));
  };

  // Центрирование камеры на результатах поиска или выбранном узле
  useEffect(() => {
    if (selectedNodeId) {
      const node = getNode(selectedNodeId);
      if (node) {
        setCenter(node.position.x + 80, node.position.y + 65, { zoom: 1.25, duration: 800 });
      }
    }
  }, [selectedNodeId, getNode, setCenter]);

  // Фильтрация узлов по поисковому запросу (добавляет визуальное затемнение другим)
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

  if (isLoading) {
    return <Spinner loading={isLoading} tip="Инициализация сетевого холста..." />;
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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color={gridColor} gap={24} size={1} />
        <Controls />
      </ReactFlow>

      {/* Floating Canvas Controls Toolbar overlay */}
      <Flex justify="center" align="center" gap={8} className={styles.glassPanel}>
        {/* Rearrange graph button */}
        <Tooltip title="Сбросить и выровнять топологию">
          <Button
            onClick={() => applyLayout(layoutDirection)}
            icon={<AppstoreOutlined />}
            style={{ fontSize: '0.8rem', height: '32px' }}
          >
            Выровнять
          </Button>
        </Tooltip>

        {/* Change Direction button */}
        <Tooltip title="Сменить направление раскладки">
          <Button
            onClick={() => {
              const nextDir = layoutDirection === 'TB' ? 'LR' : 'TB';
              dispatch(setLayoutDirection(nextDir));
              applyLayout(nextDir);
            }}
            icon={
              <SwapOutlined
                style={{ transform: layoutDirection === 'TB' ? 'rotate(90deg)' : 'none' }}
              />
            }
            style={{ fontSize: '0.8rem', height: '32px' }}
          >
            {layoutDirection === 'TB' ? 'Слева-Направо' : 'Сверху-Вниз'}
          </Button>
        </Tooltip>

        {/* Fit View button */}
        <Tooltip title="Вписать всю сеть в экран">
          <Button
            onClick={() => fitView({ padding: 0.1, duration: 600 })}
            icon={<FullscreenOutlined />}
            style={{ fontSize: '0.8rem', height: '32px' }}
          >
            По размеру
          </Button>
        </Tooltip>
      </Flex>

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
