import { Form, notification, type TablePaginationConfig } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '@/app/providers/store';
import {
  useAddNodeMutation,
  useDeleteNodeMutation,
  usePingNodeMutation,
  useRebootNodeMutation,
  useStreamTopologyQuery,
  useUpdateNodeMutation,
} from '@/shared/api';
import type { AddNodePayload, DeviceData } from '@/shared/libs';
import { makeDeviceColumns } from '../makeDeviceColumns';

export const useDevices = () => {
  const { data } = useStreamTopologyQuery();
  const isEditMode = useAppSelector((state) => state.ui.isEditMode);

  const [pingNode] = usePingNodeMutation();
  const [rebootNode] = useRebootNodeMutation();
  const [deleteNode] = useDeleteNodeMutation();
  const [addNode] = useAddNodeMutation();
  const [updateNode] = useUpdateNodeMutation();

  const [editingDevice, setEditingDevice] = useState<DeviceData | null>(null);

  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [pingingNodeId, setPingingNodeId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [form] = Form.useForm();

  const nodes = useMemo(() => data?.nodes || [], [data]);

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        node.label.toLowerCase().includes(searchText.toLowerCase()) ||
        node.ip.includes(searchText) ||
        node.vendor?.toLowerCase().includes(searchText.toLowerCase()) ||
        node.model?.toLowerCase().includes(searchText.toLowerCase()) ||
        node.version?.toLowerCase().includes(searchText.toLowerCase());

      const matchesType = selectedType === 'all' || node.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || node.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [nodes, searchText, selectedType, selectedStatus]);

  const handlePing = useCallback(
    async (nodeId: string, nodeLabel: string) => {
      setPingingNodeId(nodeId);
      try {
        const response = await pingNode({ nodeId }).unwrap();
        notification.success({
          message: 'Тест связи (Ping)',
          description: `Устройство ${nodeLabel} доступно. Задержка: ${response.latency} ms`,
          placement: 'bottomRight',
        });
      } catch (_err) {
        notification.error({
          message: 'Тест связи (Ping)',
          description: `Превышено время ожидания ответа для ${nodeLabel}.`,
          placement: 'bottomRight',
        });
      } finally {
        setPingingNodeId(null);
      }
    },
    [pingNode],
  );

  const handleReboot = useCallback(
    async (nodeId: string, nodeLabel: string) => {
      try {
        await rebootNode({ nodeId }).unwrap();
        notification.info({
          message: 'Удалённая команда',
          description: `Запущен процесс перезапуска устройства ${nodeLabel}`,
          placement: 'bottomRight',
        });
      } catch (_err) {
        notification.error({
          message: 'Ошибка команды',
          description: `Не удалось перезапустить устройство ${nodeLabel}`,
          placement: 'bottomRight',
        });
      }
    },
    [rebootNode],
  );

  const handleDelete = useCallback(
    async (nodeId: string, nodeLabel: string) => {
      try {
        await deleteNode({ nodeId }).unwrap();
        notification.warning({
          message: 'Удаление устройства',
          description: `Устройство ${nodeLabel} удалено из топологии сети`,
          placement: 'bottomRight',
        });
      } catch (_err) {
        notification.error({
          message: 'Ошибка удаления',
          description: `Не удалось удалить устройство ${nodeLabel}`,
          placement: 'bottomRight',
        });
      }
    },
    [deleteNode],
  );

  const handleBulkReboot = async () => {
    if (selectedRowKeys.length === 0) return;
    notification.info({
      message: 'Групповой перезапуск',
      description: `Запущен процесс перезапуска для ${selectedRowKeys.length} устройств`,
      placement: 'bottomRight',
    });
    try {
      await Promise.all(
        selectedRowKeys.map((nodeId) => rebootNode({ nodeId: nodeId as string }).unwrap()),
      );
      setSelectedRowKeys([]);
    } catch (_err) {
      notification.error({
        message: 'Ошибка групповой операции',
        description: 'При перезапуске некоторых устройств произошла ошибка',
        placement: 'bottomRight',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) return;
    notification.warning({
      message: 'Групповое удаление',
      description: `Удаление ${selectedRowKeys.length} устройств из топологии сети`,
      placement: 'bottomRight',
    });
    try {
      await Promise.all(
        selectedRowKeys.map((nodeId) => deleteNode({ nodeId: nodeId as string }).unwrap()),
      );
      setSelectedRowKeys([]);
    } catch (_err) {
      notification.error({
        message: 'Ошибка группового удаления',
        description: 'При удалении некоторых устройств произошла ошибка',
        placement: 'bottomRight',
      });
    }
  };

  const handleAddNodeSubmit = async (values: AddNodePayload) => {
    try {
      await addNode(values).unwrap();
      notification.success({
        message: 'Устройство добавлено',
        description: `Устройство ${values.label} успешно добавлено`,
        placement: 'bottomRight',
      });
      setIsAddModalOpen(false);
      form.resetFields();
    } catch (_err) {
      notification.error({
        message: 'Ошибка добавления',
        description: 'Не удалось добавить новое устройство',
        placement: 'bottomRight',
      });
    }
  };

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    if (pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  }, []);

  const handleEdit = useCallback((device: DeviceData) => {
    setEditingDevice(device);
  }, []);

  const handleEditSubmit = async (values: {
    label: string;
    ip: string;
    mac: string;
    vendor: string;
    model: string;
    version: string;
  }) => {
    if (!editingDevice) return;
    try {
      await updateNode({ nodeId: editingDevice.id, ...values }).unwrap();
      notification.success({
        message: 'Параметры изменены',
        description: `Параметры устройства ${values.label} успешно сохранены`,
        placement: 'bottomRight',
      });
      setEditingDevice(null);
    } catch (_err) {
      notification.error({
        message: 'Ошибка сохранения',
        description: 'Не удалось сохранить параметры устройства',
        placement: 'bottomRight',
      });
    }
  };

  const columns = useMemo(
    () =>
      makeDeviceColumns({
        pingingNodeId,
        isEditMode,
        handlePing,
        handleReboot,
        handleDelete,
        handleEdit,
      }),
    [pingingNodeId, isEditMode, handlePing, handleReboot, handleDelete, handleEdit],
  );

  return {
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
  };
};
