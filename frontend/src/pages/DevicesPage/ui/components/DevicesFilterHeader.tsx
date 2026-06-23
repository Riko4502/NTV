import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Select } from 'antd';
import type { FC } from 'react';
import { DEVICE_STATUS_OPTIONS, DEVICE_TYPE_OPTIONS } from '../constants';

interface DevicesFilterHeaderProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onAddClick: () => void;
  selectedCount: number;
  onBulkReboot: () => void;
  onBulkDelete: () => void;
}

export const DevicesFilterHeader: FC<DevicesFilterHeaderProps> = ({
  searchText,
  onSearchTextChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  onAddClick,
  selectedCount,
  onBulkReboot,
  onBulkDelete,
}) => {
  return (
    <Flex
      style={{
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Flex style={{ flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <Input
          placeholder="Поиск по имени или IP..."
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
          style={{ width: '220px', height: '32px' }}
          allowClear
        />

        <Select
          value={selectedType}
          onChange={onTypeChange}
          style={{ width: '150px', height: '32px' }}
          options={DEVICE_TYPE_OPTIONS}
        />

        <Select
          value={selectedStatus}
          onChange={onStatusChange}
          style={{ width: '150px', height: '32px' }}
          options={DEVICE_STATUS_OPTIONS}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ height: '32px' }}
          onClick={onAddClick}
        >
          Добавить устройство
        </Button>
      </Flex>

      {selectedCount > 0 && (
        <Flex
          gap="8px"
          align="center"
          style={{
            backgroundColor: 'var(--bg-panel)',
            padding: '4px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Выбрано: {selectedCount}
          </span>
          <Button size="small" onClick={onBulkReboot} style={{ fontSize: '0.8rem' }}>
            Перезапустить
          </Button>
          <Button size="small" danger onClick={onBulkDelete} style={{ fontSize: '0.8rem' }}>
            Удалить
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
