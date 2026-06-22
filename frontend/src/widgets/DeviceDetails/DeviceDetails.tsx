import {
  CloseOutlined,
  LoadingOutlined,
  PoweroffOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card } from 'antd';
import { Cpu, HardDrive, Radio, Thermometer } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { Area, AreaSeries, AreaSparklineChart, Gradient, Line } from 'reaviz';
import { selectNode, useAppDispatch } from '@/app/providers/store';
import { registerWsCallback, sendWsMessage } from '@/shared/api';
import type { DeviceData, DeviceType, Status } from '@/shared/libs';
import styles from './DeviceDetails.module.scss';

const DEVICE_LABLE: Record<DeviceType, string> = {
  router: 'Маршрутизатор',
  switch: 'Коммутатор',
  server: 'Сервер',
  client: 'Хост',
  firewall: 'Межсетевой экран',
};

const STATUS_COLOR: Record<Status, string> = {
  online: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  offline: 'var(--color-offline)',
};

type DeviceDetailsProps = DeviceData;

export const DeviceDetails: FC<DeviceDetailsProps> = (props) => {
  const dispatch = useAppDispatch();

  const { id, label, ip, mac, type, status, cpu, ram, temp, traffic } = props;

  // States for Ping Action
  const [isPinging, setIsPinging] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  // Maintain telemetry history for rendering SVG sparklines
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [ramHistory, setRamHistory] = useState<number[]>([]);
  const [tempHistory, setTempHistory] = useState<number[]>([]);

  // Feed history with new metrics when data changes
  useEffect(() => {
    if (status === 'offline') return;

    setCpuHistory((prev) => {
      const next = [...prev, cpu];
      // keep last 15 readings
      return next.slice(-15);
    });
    setRamHistory((prev) => {
      const next = [...prev, ram];
      return next.slice(-15);
    });
    setTempHistory((prev) => {
      const next = [...prev, temp];
      return next.slice(-15);
    });
  }, [cpu, ram, temp, status]);

  // Handle Ping command
  const handlePing = () => {
    if (status === 'offline') return;

    setIsPinging(true);
    setPingLatency(null);

    const startTime = performance.now();
    const correlationId = `${id}-${Date.now()}`;

    // Send ping command
    sendWsMessage('ping-node', { nodeId: id, timestamp: correlationId });

    // Listen for pong response
    const cleanup = registerWsCallback((msg) => {
      const payload = msg.payload as { timestamp?: string } | undefined;
      if (msg.type === 'pong' && payload?.timestamp === correlationId) {
        const endTime = performance.now();
        setPingLatency(Math.round(endTime - startTime));
        setIsPinging(false);
        cleanup();
      }
    });

    // Timeout safety
    setTimeout(() => {
      cleanup();
      setIsPinging((pinging) => {
        if (pinging) {
          setIsPinging(false);
          setPingLatency(-1); // denotes timeout
        }
        return false;
      });
    }, 4000);
  };

  // Handle Reboot command
  const handleReboot = () => {
    sendWsMessage('reboot-node', { nodeId: id });
  };

  // Convert plain number[] history to reaviz ChartShallowDataShape[]
  const toChartData = (history: number[]) => history.map((val, idx) => ({ key: idx, data: val }));

  const isOffline = status === 'offline';
  const statusColor = STATUS_COLOR[status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className={styles.panelHeader}>
        <span>ИНФОРМАЦИЯ ОБ УЗЛЕ</span>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => dispatch(selectNode(null))}
          style={{ color: 'var(--text-muted)', padding: '4px' }}
        />
      </div>

      <div className={styles.panelBody}>
        {/* Basic Meta Details */}
        <Card
          size="small"
          style={{
            borderLeft: `4px solid ${statusColor}`,
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            borderRadius: '8px',
          }}
          styles={{ body: { padding: '16px' } }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              marginBottom: '4px',
              lineHeight: 1.2,
            }}
          >
            {label}
          </h2>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            {DEVICE_LABLE[type] || 'Неизвестно'}
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>IP:</span>
              <span>{ip}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>MAC:</span>
              <span>{mac}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Статус:</span>
              <span
                style={{
                  color: statusColor,
                  fontWeight: 'bold',
                }}
              >
                {status}
              </span>
            </div>
          </div>
        </Card>

        {/* Real-time Telemetry Charts */}
        {!isOffline ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* CPU Chart */}
            <Card
              size="small"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
              }}
              styles={{ body: { padding: '12px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <Cpu size={14} style={{ color: 'var(--color-primary)' }} />
                  <span>Нагрузка на Процессор (CPU)</span>
                </div>
                <span
                  style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)' }}
                >
                  {cpu}%
                </span>
              </div>
              <AreaSparklineChart
                height={64}
                data={toChartData(cpuHistory)}
                series={
                  <AreaSeries
                    colorScheme={['var(--color-primary)']}
                    line={<Line strokeWidth={2} />}
                    area={<Area gradient={<Gradient />} />}
                    symbols={null}
                    tooltip={undefined}
                  />
                }
              />
            </Card>

            {/* RAM Chart */}
            <Card
              size="small"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
              }}
              styles={{ body: { padding: '12px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <HardDrive size={14} style={{ color: 'var(--color-success)' }} />
                  <span>Оперативная память (RAM)</span>
                </div>
                <span
                  style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-success)' }}
                >
                  {ram}%
                </span>
              </div>
              <AreaSparklineChart
                height={64}
                data={toChartData(ramHistory)}
                series={
                  <AreaSeries
                    colorScheme={['var(--color-success)']}
                    line={<Line strokeWidth={2} />}
                    area={<Area gradient={<Gradient />} />}
                    symbols={null}
                    tooltip={undefined}
                  />
                }
              />
            </Card>

            {/* Temp Chart */}
            <Card
              size="small"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
              }}
              styles={{ body: { padding: '12px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  <Thermometer size={14} style={{ color: 'var(--color-warning)' }} />
                  <span>Температура ядра</span>
                </div>
                <span
                  style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-warning)' }}
                >
                  {temp}°C
                </span>
              </div>
              <AreaSparklineChart
                height={64}
                data={toChartData(tempHistory)}
                series={
                  <AreaSeries
                    colorScheme={['var(--color-warning)']}
                    line={<Line strokeWidth={2} />}
                    area={<Area gradient={<Gradient />} />}
                    symbols={null}
                    tooltip={undefined}
                  />
                }
              />
            </Card>

            {/* Network Traffic Info */}
            <Card
              size="small"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '8px',
              }}
              styles={{
                body: {
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Radio size={14} style={{ color: 'var(--color-success)' }} />
                <span>Использование трафика</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                {traffic} Mbps
              </span>
            </Card>
          </div>
        ) : (
          <Alert
            message="Устройство отключено"
            description="Устройство отключено от питания. Телеметрическая статистика недоступна."
            type="error"
            showIcon
            icon={<WarningOutlined />}
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              borderColor: 'rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
            }}
          />
        )}

        {/* Operational Actions */}
        <Card
          size="small"
          title={
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Удалённые Команды (NOC Actions)
            </span>
          }
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            borderRadius: '8px',
            marginTop: 'auto',
          }}
          styles={{
            body: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Ping Device Button */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button
                onClick={handlePing}
                disabled={isOffline}
                loading={isPinging}
                type="primary"
                icon={!isPinging && <ThunderboltOutlined />}
                style={{
                  flex: 1,
                  height: '36px',
                  fontSize: '0.8rem',
                }}
              >
                {isPinging ? 'Отправка...' : 'Тест связи (Ping)'}
              </Button>

              {/* RTT display */}
              {pingLatency !== null && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'monospace',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    color: pingLatency === -1 ? 'var(--color-error)' : 'var(--color-success)',
                    minWidth: '70px',
                    textAlign: 'center',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {pingLatency === -1 ? 'Таймаут' : `${pingLatency} ms`}
                </div>
              )}
            </div>

            {/* Reboot Device Button */}
            <Button
              onClick={handleReboot}
              danger={!isOffline}
              type={isOffline ? 'default' : 'primary'}
              icon={isOffline ? <LoadingOutlined /> : <PoweroffOutlined />}
              style={{
                height: '36px',
                fontSize: '0.8rem',
                backgroundColor: isOffline ? 'rgba(16, 185, 129, 0.1)' : undefined,
                color: isOffline ? 'var(--color-success)' : undefined,
                borderColor: isOffline ? 'rgba(16, 185, 129, 0.3)' : undefined,
              }}
            >
              {isOffline ? 'Инициализация запуска...' : 'Перезапустить устройство'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeviceDetails;
