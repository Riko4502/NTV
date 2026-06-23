export type Priority = 'high' | 'medium' | 'low';

export type AlertType = 'critical' | 'warning' | 'info';

export type Alert = 'all' | AlertType;

export type LayoutDirection = 'TB' | 'LR';

export type Status = 'online' | 'warning' | 'error' | 'offline';

export type StatusStyle = { color: string; glow: string; label: string };
