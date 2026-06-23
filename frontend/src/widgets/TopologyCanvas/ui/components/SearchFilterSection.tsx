import { EyeInvisibleOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select, Tooltip } from 'antd';
import type { FC } from 'react';
import {
  setHeatmapMetric,
  setSearchQuery,
  toggleHideClients,
  useAppDispatch,
  useAppSelector,
} from '@/app/providers/store';
import { HEATMAP_METRICS } from '../constants';

export const SearchFilterSection: FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const hideClients = useAppSelector((state) => state.ui.hideClients);
  const heatmapMetric = useAppSelector((state) => state.ui.heatmapMetric);

  return (
    <>
      <Input
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
        allowClear
        style={{
          width: '140px',
          marginRight: '4px',
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--border-color)',
        }}
      />

      <Tooltip title={hideClients ? 'Показать клиентов' : 'Скрыть клиентов'}>
        <Button
          onClick={() => dispatch(toggleHideClients())}
          type={hideClients ? 'primary' : 'default'}
          icon={hideClients ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          style={{ fontSize: '0.8rem', height: '32px' }}
        >
          Клиенты
        </Button>
      </Tooltip>

      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Теплокарта:</span>
      <Select
        value={heatmapMetric}
        onChange={(val) => dispatch(setHeatmapMetric(val))}
        style={{ width: '110px', height: '32px' }}
        options={HEATMAP_METRICS}
      />
    </>
  );
};
