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
import styles from '../../TopologyCanvas.module.scss';
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
        prefix={<SearchOutlined className={styles.searchIcon} />}
        allowClear
        className={styles.searchInput}
      />

      <Tooltip title={hideClients ? 'Показать клиентов' : 'Скрыть клиентов'}>
        <Button
          onClick={() => dispatch(toggleHideClients())}
          type={hideClients ? 'primary' : 'default'}
          icon={hideClients ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          className={styles.toolbarBtn}
        >
          Клиенты
        </Button>
      </Tooltip>

      <span className={styles.label}>Теплокарта:</span>
      <Select
        value={heatmapMetric}
        onChange={(val) => dispatch(setHeatmapMetric(val))}
        className={styles.select}
        options={HEATMAP_METRICS}
      />
    </>
  );
};
