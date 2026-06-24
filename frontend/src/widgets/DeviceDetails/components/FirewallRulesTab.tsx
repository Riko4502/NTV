import { message } from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  useAddFirewallRuleMutation,
  useDeleteFirewallRuleMutation,
  useToggleFirewallRuleMutation,
} from '@/shared/api';
import type { AddRuleFormData, FirewallRule } from '@/shared/libs';
import styles from '../DeviceDetails.module.scss';
import type { FirewallTabType } from '../model';
import { AddRuleModal } from './AddRuleModal';
import { FirewallConfigView } from './FirewallConfigView';
import { FirewallRulesHeader } from './FirewallRulesHeader';
import { FirewallRulesTable } from './FirewallRulesTable';
import { makeFirewallRuleTabColumns } from './makeFirewallRuleTabColumns';

interface FirewallRulesTabProps {
  nodeId: string;
  vendor?: string;
  rules?: FirewallRule[];
  isOffline: boolean;
  firewallConfig?: string;
}

export const FirewallRulesTab: FC<FirewallRulesTabProps> = ({
  nodeId,
  vendor = 'Generic',
  rules = [],
  isOffline,
  firewallConfig = '# Правила фильтрации отсутствуют',
}) => {
  const [viewMode, setViewMode] = useState<FirewallTabType>('table');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [addRule, { isLoading: isAdding }] = useAddFirewallRuleMutation();
  const [deleteRule] = useDeleteFirewallRuleMutation();
  const [toggleRule] = useToggleFirewallRuleMutation();

  const handleAddFinish = async (values: AddRuleFormData) => {
    try {
      await addRule({ nodeId, ...values }).unwrap();
      message.success('Правило успешно добавлено');
      setIsAddOpen(false);
    } catch {
      message.error('Не удалось добавить правило');
    }
  };

  const handleDeleteRule = useCallback(
    async (ruleId: string) => {
      try {
        await deleteRule({ nodeId, ruleId }).unwrap();
        message.warning('Правило удалено');
      } catch {
        message.error('Не удалось удалить правило');
      }
    },
    [deleteRule, nodeId],
  );

  const handleToggleRule = useCallback(
    async (ruleId: string) => {
      try {
        await toggleRule({ nodeId, ruleId }).unwrap();
      } catch {
        message.error('Не удалось изменить статус правила');
      }
    },
    [toggleRule, nodeId],
  );

  const handleViewModeChange = (val: 'table' | 'config') => {
    setViewMode(val);
  };

  const handleAddClick = () => {
    setIsAddOpen(true);
  };

  const handleAddCancel = () => {
    setIsAddOpen(false);
  };

  const columns = useMemo(
    () =>
      makeFirewallRuleTabColumns({
        handleDeleteRule,
        handleToggleRule,
        isOffline,
      }),
    [handleDeleteRule, handleToggleRule, isOffline],
  );

  return (
    <div className={styles.tabContainer}>
      <FirewallRulesHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onAddClick={handleAddClick}
        isOffline={isOffline}
      />

      {viewMode === 'table' ? (
        <FirewallRulesTable rules={rules} columns={columns} />
      ) : (
        <FirewallConfigView vendor={vendor} firewallConfig={firewallConfig} />
      )}

      <AddRuleModal
        open={isAddOpen}
        onCancel={handleAddCancel}
        onFinish={handleAddFinish}
        confirmLoading={isAdding}
      />
    </div>
  );
};
