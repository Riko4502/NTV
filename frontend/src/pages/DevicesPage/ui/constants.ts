export const DEVICE_TYPE_OPTIONS = [
  { value: 'all', label: 'Все типы' },
  { value: 'server', label: 'Серверы' },
  { value: 'router', label: 'Маршрутизаторы' },
  { value: 'switch', label: 'Коммутаторы' },
  { value: 'client', label: 'Клиенты' },
];

export const DEVICE_STATUS_OPTIONS = [
  { value: 'all', label: 'Все статусы' },
  { value: 'online', label: 'В сети' },
  { value: 'offline', label: 'Перезапуск' },
  { value: 'warning', label: 'Предупреждение' },
  { value: 'error', label: 'Сбой' },
];

export const TYPE_TAGS = {
  server: { color: 'purple', label: 'Сервер' },
  router: { color: 'blue', label: 'Маршрутизатор' },
  switch: { color: 'cyan', label: 'Коммутатор' },
  client: { color: 'orange', label: 'Клиент' },
  firewall: { color: 'red', label: 'Межсетевой экран' },
};

export const STATUS_BADGES = {
  online: { color: 'success', label: 'В сети' },
  offline: { color: 'default', label: 'Перезапуск' },
  warning: { color: 'warning', label: 'Предупреждение' },
  error: { color: 'error', label: 'Сбой' },
};

export const DEVICE_TYPE_OPTIONS_EXTENDED = [
  { label: 'Маршрутизатор (Router)', value: 'router' },
  { label: 'Коммутатор (Switch)', value: 'switch' },
  { label: 'Сервер (Server)', value: 'server' },
  { label: 'Межсетевой экран (Firewall)', value: 'firewall' },
  { label: 'Клиент (Client)', value: 'client' },
];
