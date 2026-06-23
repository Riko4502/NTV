import type {
  Connection,
  EdgeMouseHandler,
  NodeMouseHandler,
  OnEdgesChange,
  OnNodesChange,
} from '@xyflow/react';
import { applyEdgeChanges, applyNodeChanges, MarkerType, useReactFlow } from '@xyflow/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { selectEdge, selectNode, useAppDispatch, useAppSelector } from '@/app/providers/store';
import type { TopologyState } from '@/shared/api';
import { sendWsMessage, useStreamTopologyQuery } from '@/shared/api';
import { useLayout } from '@/shared/hooks';
import type { EdgeBase, LayoutDirection, NodeBase } from '@/shared/libs';
import type { TopologyConnectModalState } from '../models';

export const useTopologySync = () => {
  const dispatch = useAppDispatch();
  const isInteractingRef = useRef(false);
  const latestDataRef = useRef<TopologyState | undefined>(undefined);
  const prevNodeCountRef = useRef(0);
  const prevEdgeCountRef = useRef(0);

  const { data, isLoading } = useStreamTopologyQuery();
  const { getLayoutedElements } = useLayout();
  const { setCenter, getNode, fitView } = useReactFlow();

  const selectedNodeId = useAppSelector((state) => state.ui.selectedNodeId);
  const layoutDirection = useAppSelector((state) => state.ui.layoutDirection);

  const [nodes, setNodes] = useState<NodeBase[]>([]);
  const [edges, setEdges] = useState<EdgeBase[]>([]);
  const [connectModalData, setConnectModalData] = useState<TopologyConnectModalState | null>(null);

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

  useEffect(() => {
    if (data?.nodes.length && !nodes.length) {
      applyLayout(layoutDirection);
    }
  }, [data, applyLayout, layoutDirection, nodes.length]);

  useEffect(() => {
    if (!data) return;
    const nodeCount = data.nodes.length;
    const edgeCount = data.edges.length;
    if (
      nodes.length > 0 &&
      (nodeCount !== prevNodeCountRef.current || edgeCount !== prevEdgeCountRef.current)
    ) {
      prevNodeCountRef.current = nodeCount;
      prevEdgeCountRef.current = edgeCount;
      setTimeout(() => applyLayout(layoutDirection), 100);
    }
  }, [data, nodes.length, layoutDirection, applyLayout]);

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

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

  useEffect(() => {
    if (!data) return;
    if (isInteractingRef.current) return;
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

  const onNodesChange: OnNodesChange<NodeBase> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange<EdgeBase> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onNodeClick: NodeMouseHandler<NodeBase> = (_event, node) => {
    dispatch(selectNode(node.id));
  };

  const onEdgeClick: EdgeMouseHandler<EdgeBase> = (_event, edge) => {
    dispatch(selectEdge(edge.id));
  };

  const onPaneClick = () => {
    dispatch(selectNode(null));
  };

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target) {
      const srcNode = latestDataRef.current?.nodes.find((n) => n.id === connection.source);
      const tgtNode = latestDataRef.current?.nodes.find((n) => n.id === connection.target);

      setConnectModalData({
        source: connection.source,
        target: connection.target,
        sourceLabel: srcNode?.label || connection.source,
        targetLabel: tgtNode?.label || connection.target,
      });
    }
  }, []);

  const handleConnectSubmit = useCallback(
    (bandwidth: number) => {
      if (connectModalData) {
        sendWsMessage('connect-nodes', {
          source: connectModalData.source,
          target: connectModalData.target,
          bandwidth,
        });
        setConnectModalData(null);
      }
    },
    [connectModalData],
  );

  const handleConnectClose = useCallback(() => {
    setConnectModalData(null);
  }, []);

  useEffect(() => {
    if (selectedNodeId) {
      const node = getNode(selectedNodeId);
      if (node) {
        setCenter(node.position.x + 80, node.position.y + 65, { zoom: 1.25, duration: 800 });
      }
    }
  }, [selectedNodeId, getNode, setCenter]);

  return {
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
  };
};
