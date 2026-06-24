import { WarningOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { Cpu, HardDrive, Thermometer } from 'lucide-react';
import type { FC } from 'react';
import { useAppSelector } from '@/app/providers/store';
import type { DeviceData } from '@/shared/libs';
import { DeviceActionsCard } from './components/DeviceActionsCard';
import { DeviceMetaCard } from './components/DeviceMetaCard';
import { DeviceMetricChartCard } from './components/DeviceMetricChartCard';
import { DeviceTrafficCard } from './components/DeviceTrafficCard';
import styles from './DeviceDetails.module.scss';
import { useDeviceActions } from './hooks/useDeviceActions';
import { useDeviceTelemetryHistory } from './hooks/useDeviceTelemetryHistory';

type DeviceDetailsProps = DeviceData;

export const DeviceDetails: FC<DeviceDetailsProps> = (props) => {
  const { id, status, cpu, ram, temp, traffic } = props;
  const isEditMode = useAppSelector((state) => state.ui.isEditMode);

  const { cpuHistory, ramHistory, tempHistory } = useDeviceTelemetryHistory({
    cpu,
    ram,
    temp,
    status,
  });

  const { isPinging, pingLatency, pingHistory, handlePing, handleReboot, handleDelete } =
    useDeviceActions(id, status);

  const isOffline = status === 'offline';

  return (
    <div className={styles.detailsRoot}>
      <div className={styles.panelBody}>
        <DeviceMetaCard {...props} />
        {!isOffline ? (
          <div className={styles.metricsContainer}>
            <DeviceMetricChartCard
              title="Нагрузка на Процессор (CPU)"
              value={cpu}
              history={cpuHistory}
              color="primary"
              icon={Cpu}
            />

            <DeviceMetricChartCard
              title="Оперативная память (RAM)"
              value={ram}
              history={ramHistory}
              color="success"
              icon={HardDrive}
            />

            <DeviceMetricChartCard
              title="Температура ядра"
              value={temp}
              history={tempHistory}
              color="warning"
              icon={Thermometer}
              suffix="°C"
            />

            <DeviceTrafficCard traffic={traffic} />
          </div>
        ) : (
          <Alert
            title="Устройство отключено"
            description="Устройство отключено от питания. Телеметрическая статистика недоступна."
            type="error"
            showIcon
            icon={<WarningOutlined />}
            className={styles.offlineAlert}
          />
        )}

        <DeviceActionsCard
          isOffline={isOffline}
          isEditMode={isEditMode}
          isPinging={isPinging}
          pingLatency={pingLatency}
          pingHistory={pingHistory}
          onPing={handlePing}
          onReboot={handleReboot}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default DeviceDetails;
