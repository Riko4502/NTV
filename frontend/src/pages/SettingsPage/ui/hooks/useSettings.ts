import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  useGetThresholdsQuery,
  useRecoverAllMutation,
  useUpdateThresholdsMutation,
} from '@/shared/api';

export interface SettingsValues {
  cpuWarning: number;
  cpuCritical: number;
  tempLimit: number;
  ramWarning: number;
  telemetryInterval: number;
  noiseLevel: number;
}

export const useSettings = () => {
  const [form] = Form.useForm<SettingsValues>();
  const [saving, setSaving] = useState(false);
  const [recoverAll] = useRecoverAllMutation();
  const { data: serverThresholds } = useGetThresholdsQuery();
  const [updateThresholds] = useUpdateThresholdsMutation();

  useEffect(() => {
    if (serverThresholds) {
      form.setFieldsValue(serverThresholds);
    } else {
      const saved = localStorage.getItem('noc_thresholds');
      if (saved) {
        try {
          form.setFieldsValue(JSON.parse(saved));
        } catch {
          // Fallback to default
        }
      }
    }
  }, [form, serverThresholds]);

  const handleFinish = async (values: SettingsValues) => {
    setSaving(true);
    try {
      localStorage.setItem('noc_thresholds', JSON.stringify(values));
      await updateThresholds({
        cpuWarning: Number(values.cpuWarning),
        cpuCritical: Number(values.cpuCritical),
        tempLimit: Number(values.tempLimit),
        ramWarning: Number(values.ramWarning),
        telemetryInterval: Number(values.telemetryInterval),
        noiseLevel: Number(values.noiseLevel),
      }).unwrap();
      message.success('Конфигурация NOC успешно сохранена и применена на сервере!');
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err);
      message.error('Конфигурация сохранена локально, но не удалось синхронизировать с сервером.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSimulation = async () => {
    try {
      await recoverAll().unwrap();
      message.success('Параметры сбоев сброшены. Телеметрия приведена в норму.');
    } catch {
      message.error('Не удалось сбросить параметры сбоев.');
    }
  };

  return {
    form,
    saving,
    handleFinish,
    handleResetSimulation,
  };
};
