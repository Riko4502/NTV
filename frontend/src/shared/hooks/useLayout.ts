import dagre from 'dagre';
import type { EdgeBase } from '@/entities/connection/model/types';
import type { LayoutDirection, NodeBase } from '@/shared/libs';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export const useLayout = () => {
  const getLayoutedElements = (
    nodes: NodeBase[],
    edges: EdgeBase[],
    direction: LayoutDirection = 'TB',
  ) => {
    // Reset graph
    dagreGraph.setGraph({ rankdir: direction, ranksep: 90, nodesep: 60 });

    // Remove old nodes/edges to prevent duplicates/leaks
    dagreGraph.nodes().forEach((n) => {
      dagreGraph.removeNode(n);
    });

    // Set up layout structures
    nodes.forEach((node) => {
      // Width and height matches custom-node styling class dimensions
      dagreGraph.setNode(node.id, { width: 160, height: 130 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        position: {
          // Center coordinate correction
          x: nodeWithPosition.x - 80,
          y: nodeWithPosition.y - 65,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  };

  return { getLayoutedElements };
};
