import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiCard } from './KpiCard';

describe('KpiCard Component', () => {
  it('should render the title and value correctly', () => {
    render(<KpiCard title="Test Metric" value="42" />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should display prefix and suffix elements when provided', () => {
    render(
      <KpiCard
        title="Speed"
        value="100"
        prefix={<span data-testid="prefix-test">🔋</span>}
        suffix={<span data-testid="suffix-test">Mbps</span>}
      />,
    );

    expect(screen.getByTestId('prefix-test')).toBeInTheDocument();
    expect(screen.getByTestId('prefix-test')).toHaveTextContent('🔋');
    expect(screen.getByTestId('suffix-test')).toBeInTheDocument();
    expect(screen.getByTestId('suffix-test')).toHaveTextContent('Mbps');
  });

  it('should apply correct color to value text', () => {
    render(<KpiCard title="Colored" value="99" valueColor="rgb(255, 0, 0)" />);

    const valueElement = screen.getByText('99');
    expect(valueElement).toHaveStyle('color: rgb(255, 0, 0)');
  });
});
