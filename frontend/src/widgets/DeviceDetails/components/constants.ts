import type { ActionType, AddRuleFormData, ProtocolType, SeverityType } from '@/shared/libs';
import type { Option } from '@/shared/libs/types/types';
import type { FirewallTabType } from '../model';

export const FIREWALL_TAB_OPTIONS: Option<FirewallTabType>[] = [
  { label: 'Таблица', value: 'table' },
  { label: 'Конфигурация', value: 'config' },
];

export const RULE_PROTOCOL_OPTIONS: Option<ProtocolType>[] = [
  { label: 'TCP', value: 'TCP' },
  { label: 'UDP', value: 'UDP' },
  { label: 'ICMP', value: 'ICMP' },
  { label: 'ANY', value: 'ANY' },
];

export const RULE_ACTION_OPTIONS: Option<ActionType>[] = [
  { label: 'Разрешить', value: 'ALLOW' },
  { label: 'Запретить', value: 'DENY' },
];

export const INITIAL_ADD_FORM_VALUES: AddRuleFormData = {
  name: '',
  source: 'Any',
  destination: 'Any',
  port: 'Any',
  protocol: 'TCP',
  action: 'DENY',
};

export const SEVERITY_COLORS: Record<SeverityType, string> = {
  high: 'error',
  medium: 'warning',
  low: 'blue',
};

export const SEVERITY_LABELS: Record<SeverityType, string> = {
  high: 'Критический',
  medium: 'Средний',
  low: 'Низкий',
};
