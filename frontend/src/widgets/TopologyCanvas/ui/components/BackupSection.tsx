import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import { type FC, useRef } from 'react';
import { useSetTopologyMutation } from '@/shared/api';
import type { ConnectionEdgeDto, DeviceData } from '@/shared/libs';
import { FILE_OPERATIONS } from '../constants';

interface BackupSectionProps {
  nodesData: DeviceData[];
  edgesData: ConnectionEdgeDto[];
}

export const BackupSection: FC<BackupSectionProps> = ({ nodesData, edgesData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setTopology] = useSetTopologyMutation();

  const handleExport = () => {
    const exportData = {
      nodes: nodesData,
      edges: edgesData,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = 'topology.json';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          await setTopology(parsed).unwrap();
        } else {
          alert('Неверный формат файла топологии.');
        }
      } catch (err) {
        alert(`Ошибка при разборе JSON: ${err}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const items: MenuProps['items'] = FILE_OPERATIONS.map((item) => {
    return {
      ...item,
      icon: <item.icon style={{ color: 'var(--text-secondary)' }} />,
      onClick: item.key === 'export-json' ? handleExport : handleImportClick,
    };
  });

  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']}>
        <Button
          icon={<EllipsisOutlined size={20} />}
          style={{ fontSize: '0.8rem', height: '32px' }}
        />
      </Dropdown>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        style={{ display: 'none' }}
      />
    </>
  );
};
