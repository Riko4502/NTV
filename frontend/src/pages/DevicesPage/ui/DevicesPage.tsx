import { Layout, Table } from 'antd';
import type { FC } from 'react';
import { EditDeviceModal } from '@/widgets/DeviceDetails/components/EditDeviceModal';
import { AddDeviceModal } from './components/AddDeviceModal';
import { DevicesFilterHeader } from './components/DevicesFilterHeader';
import styles from './DevicesPage.module.scss';
import { useDevices } from './hooks/useDevices';

export const DevicesPage: FC = () => {
  const {
    filteredNodes,
    selectedRowKeys,
    setSelectedRowKeys,
    searchText,
    setSearchText,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    pageSize,
    isAddModalOpen,
    setIsAddModalOpen,
    form,
    columns,
    handleBulkReboot,
    handleBulkDelete,
    handleAddNodeSubmit,
    handleTableChange,
    editingDevice,
    setEditingDevice,
    handleEditSubmit,
  } = useDevices();

  return (
    <Layout className={styles.pageLayout}>
      <DevicesFilterHeader
        searchText={searchText}
        onSearchTextChange={setSearchText}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onAddClick={() => setIsAddModalOpen(true)}
        selectedCount={selectedRowKeys.length}
        onBulkReboot={handleBulkReboot}
        onBulkDelete={handleBulkDelete}
      />

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        dataSource={filteredNodes}
        columns={columns}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{ pageSize }}
        className={styles.table}
      />

      <AddDeviceModal
        isOpen={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        form={form}
        onFinish={handleAddNodeSubmit}
      />

      {editingDevice && (
        <EditDeviceModal
          isOpen={!!editingDevice}
          onCancel={() => setEditingDevice(null)}
          device={editingDevice}
          onFinish={handleEditSubmit}
        />
      )}
    </Layout>
  );
};

export default DevicesPage;
