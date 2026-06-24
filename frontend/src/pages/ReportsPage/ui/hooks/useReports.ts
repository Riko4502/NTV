import { notification } from 'antd';
import { useMemo, useState } from 'react';
import { useStreamTopologyQuery as useApiQuery, useGetMetricsHistoryQuery } from '@/shared/api';

interface MetricPoint {
  cpu: number;
}

interface Node {
  id: string;
  label: string;
  ip: string;
  status: string;
}

const getDowntimeString = (offlineCount: number) => {
  const downtimeSec = offlineCount * 5;
  if (downtimeSec <= 0) return '0 сек';
  if (downtimeSec >= 60) {
    const mins = Math.floor(downtimeSec / 60);
    const secs = downtimeSec % 60;
    return `${mins} мин ${secs} сек`;
  }
  return `${downtimeSec} сек`;
};

const calculateNodeSlaData = (node: Node, history: MetricPoint[]) => {
  let onlineCount = 0;
  let offlineCount = 0;

  if (history.length) {
    for (const pt of history) {
      if (pt.cpu) {
        onlineCount++;
      } else {
        offlineCount++;
      }
    }
  } else {
    if (node.status !== 'offline') {
      onlineCount = 1;
    } else {
      offlineCount = 1;
    }
  }

  const totalCount = onlineCount + offlineCount;
  const rawSla = totalCount ? (onlineCount / totalCount) * 100 : 100;
  const sla = Number(rawSla.toFixed(2));

  let status: 'excellent' | 'good' | 'warning' = 'excellent';
  if (sla < 99.0) {
    status = 'warning';
  } else if (sla < 99.9) {
    status = 'good';
  }

  const downtimeStr = getDowntimeString(offlineCount);

  return {
    key: node.id,
    label: node.label,
    ip: node.ip,
    sla,
    downtime: downtimeStr,
    status,
  };
};

/*
  Hooks для работы с отчетами
*/
export const useReports = () => {
  const { data } = useApiQuery();
  const { data: historyData } = useGetMetricsHistoryQuery(
    {},
    {
      pollingInterval: 3000,
    },
  );
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const activeIncidents = data?.alerts.filter((a) => !a.acknowledged).length || 0;
  const nodes = data?.nodes || [];

  const slaData = useMemo(() => {
    if (!nodes.length) return [];
    return nodes.map((node) => calculateNodeSlaData(node, historyData?.[node.id] || []));
  }, [nodes, historyData]);

  const averageSla = useMemo(() => {
    if (slaData.length === 0) return 100;
    const totalSla = slaData.reduce((acc, item) => acc + item.sla, 0);
    return Number((totalSla / slaData.length).toFixed(2));
  }, [slaData]);

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    setDownloadingCsv(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Device,IP Address,Availability SLA,Downtime\n' +
        slaData
          .map((item) => `"${item.label}","${item.ip}",${item.sla}%,"${item.downtime}"`)
          .join('\n');

      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = encodedUri;
      downloadAnchor.download = `noc_sla_stats_${Date.now()}.csv`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      setDownloadingCsv(false);
      notification.success({
        message: 'Статистика экспортирована',
        description: 'CSV-таблица показателей доступности успешно скачана.',
        placement: 'bottomRight',
      });
    }, 1000);
  };

  return {
    averageSla,
    activeIncidents,
    downloadingPdf: false,
    downloadingCsv,
    handleDownloadPdf,
    handleDownloadCsv,
    slaData,
  };
};
