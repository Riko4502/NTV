import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Select } from 'antd';
import type { FC } from 'react';
import { DEVICE_STATUS_OPTIONS, DEVICE_TYPE_OPTIONS } from '../constants';
import styles from '../DevicesPage.module.scss';

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
    <Flex className={styles.filterHeader}>
      <Flex className={styles.inputsWrapper}>
        <Input
          placeholder="Поиск по имени или IP..."
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          prefix={<SearchOutlined className={styles.searchIcon} />}
          className={styles.searchInput}
          allowClear
        />

        <Select
          value={selectedType}
          onChange={onTypeChange}
          className={styles.selectInput}
          options={DEVICE_TYPE_OPTIONS}
        />

        <Select
          value={selectedStatus}
          onChange={onStatusChange}
          className={styles.selectInput}
          options={DEVICE_STATUS_OPTIONS}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          className={styles.actionBtn}
          onClick={onAddClick}
        >
          Добавить устройство
        </Button>
      </Flex>

      {!!selectedCount && (
        <Flex gap="8px" align="center" className={styles.selectedBadge}>
          <span className={styles.selectedCount}>Выбрано: {selectedCount}</span>
          <Button size="small" onClick={onBulkReboot} className={styles.bulkBtn}>
            Перезапустить
          </Button>
          <Button size="small" danger onClick={onBulkDelete} className={styles.bulkBtn}>
            Удалить
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
