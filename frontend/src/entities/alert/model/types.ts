import type { AlertType } from '@/shared/libs';

export interface NetworkAlertData {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  severity: AlertType;
  message: string;
  acknowledged: boolean;
}
