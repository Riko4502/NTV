import { Button, Form, Modal, Select } from 'antd';
import type { FC } from 'react';
import styles from './AddEdgeModal.module.scss';
import { SPEED_OPTIONS } from './constants';

interface AddEdgeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bandwidth: number) => void;
  sourceLabel: string;
  targetLabel: string;
}

export const AddEdgeModal: FC<AddEdgeModalProps> = ({
  open,
  onClose,
  onSubmit,
  sourceLabel,
  targetLabel,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: { bandwidth: number }) => {
    onSubmit(values.bandwidth);
    form.resetFields();
  };

  return (
    <Modal
      title="Создать сетевое соединение"
      open={open}
      onCancel={onClose}
      footer={null}
      className={styles.modal}
      classNames={{
        body: styles.modalBody,
      }}
    >
      <div className={styles.description}>
        Установка связи между узлами: <strong>{sourceLabel}</strong> и{' '}
        <strong>{targetLabel}</strong>
      </div>

      <Form form={form} layout="vertical" initialValues={{ bandwidth: 1 }} onFinish={handleFinish}>
        <Form.Item
          name="bandwidth"
          label="Тип линии / Пропускная способность"
          rules={[{ required: true }]}
        >
          <Select options={SPEED_OPTIONS} />
        </Form.Item>

        <Form.Item className={styles.formFooter}>
          <Button className={styles.cancelBtn} onClick={onClose}>
            Отмена
          </Button>
          <Button type="primary" htmlType="submit">
            Создать канал
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AddEdgeModal;
