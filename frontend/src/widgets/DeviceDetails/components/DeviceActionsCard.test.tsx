import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { sendWsMessage } from '@/shared/api';
import { DeviceActionsCard } from './DeviceActionsCard';

// Mock the shared api module
vi.mock('@/shared/api', () => ({
  sendWsMessage: vi.fn(),
  useStreamTopologyQuery: vi.fn(),
}));

describe('DeviceActionsCard Component', () => {
  const defaultProps = {
    nodeId: 'node-1',
    isOffline: false,
    isEditMode: false,
    isPinging: false,
    pingLatency: null,
    pingHistory: [] as number[],
    onPing: vi.fn(),
    onReboot: vi.fn(),
  };

  it('should render the Card title and buttons', () => {
    render(<DeviceActionsCard {...defaultProps} />);

    expect(screen.getByText('Удалённые Команды')).toBeInTheDocument();
    expect(screen.getByText('Тест связи (Ping)')).toBeInTheDocument();
    expect(screen.getByText('Перезапустить устройство')).toBeInTheDocument();
    expect(screen.queryByText('🗑 Удалить устройство')).not.toBeInTheDocument();
  });

  it('should display pinging status when isPinging is true', () => {
    render(<DeviceActionsCard {...defaultProps} isPinging={true} />);

    expect(screen.getByText('Отправка...')).toBeInTheDocument();
  });

  it('should display ping latency details', () => {
    const { rerender } = render(<DeviceActionsCard {...defaultProps} pingLatency={15} />);
    expect(screen.getByText('15 ms')).toBeInTheDocument();

    rerender(<DeviceActionsCard {...defaultProps} pingLatency={-1} />);
    expect(screen.getByText('Таймаут')).toBeInTheDocument();
  });

  it('should trigger onPing and onReboot callbacks on click', () => {
    const onPingMock = vi.fn();
    const onRebootMock = vi.fn();

    render(<DeviceActionsCard {...defaultProps} onPing={onPingMock} onReboot={onRebootMock} />);

    fireEvent.click(screen.getByText('Тест связи (Ping)'));
    expect(onPingMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Перезапустить устройство'));
    expect(onRebootMock).toHaveBeenCalledTimes(1);
  });

  it('should display ping history dots', () => {
    const pingHistory = [10, 50, 150, -1];
    render(<DeviceActionsCard {...defaultProps} pingHistory={pingHistory} />);

    expect(screen.getByText('История пинг-тестов:')).toBeInTheDocument();

    // There should be 4 dots (tooltips are created by Antd around them)
    // Ant Design's Tooltip wraps the elements. We can check by selecting elements with help cursor or check matching count of tooltips
    // Since we mock or render tooltips, let's verify that the dots are rendered.
    // They are simple divs with borderRadius 50%.
    // In happy-dom/testing-library, they are divs inside the container.
    const container = screen.getByText('История пинг-тестов:').nextSibling;
    expect(container?.childNodes.length).toBe(4);
  });

  it('should display Delete Node Button only in Edit Mode and call sendWsMessage', () => {
    render(<DeviceActionsCard {...defaultProps} isEditMode={true} />);

    const deleteBtn = screen.getByText('🗑 Удалить устройство');
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(sendWsMessage).toHaveBeenCalledWith('delete-node', { id: 'node-1' });
  });

  it('should display initialization status when rebooting (device is offline)', () => {
    render(<DeviceActionsCard {...defaultProps} isOffline={true} />);

    expect(screen.getByText('Инициализация запуска...')).toBeInTheDocument();
    expect(screen.getByText('Тест связи (Ping)').closest('button')).toBeDisabled();
  });
});
