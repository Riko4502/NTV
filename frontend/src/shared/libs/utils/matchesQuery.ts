import type { NodeBase } from '../types';

export const matchesQuery = (node: NodeBase, searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  const label = node.data?.label?.toLowerCase() ?? '';
  const ip = node.data?.ip ?? '';
  return label.includes(query) || ip.includes(query);
};
