import { Layout, Table } from 'antd';
import type { FC } from 'react';
import { AddDeviceModal } from './components/AddDeviceModal';
import { DevicesFilterHeader } from './components/DevicesFilterHeader';
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
  } = useDevices();

  return (
    <Layout
      style={{ height: '100%', background: 'transparent', padding: '24px', overflowY: 'auto' }}
    >
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
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
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
    </Layout>
  );
};

export default DevicesPage;
