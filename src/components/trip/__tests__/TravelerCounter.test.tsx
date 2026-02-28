import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TravelerCounter from '../TravelerCounter';

describe('TravelerCounter', () => {
  const defaultProps = {
    adults: 2,
    children: 0,
    onAdultsChange: vi.fn(),
    onChildrenChange: vi.fn(),
  };

  it('renders with default values', () => {
    render(<TravelerCounter {...defaultProps} />);
    expect(screen.getByText('Adults')).toBeInTheDocument();
    expect(screen.getByText('Children')).toBeInTheDocument();
    expect(screen.getByText('2 travelers')).toBeInTheDocument();
  });

  it('displays correct adult count', () => {
    render(<TravelerCounter {...defaultProps} adults={3} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('3 travelers')).toBeInTheDocument();
  });

  it('calls onAdultsChange when incrementing adults', () => {
    const onAdultsChange = vi.fn();
    render(<TravelerCounter {...defaultProps} onAdultsChange={onAdultsChange} />);
    const plusButtons = screen.getAllByRole('button');
    // Second button is the adults plus button
    fireEvent.click(plusButtons[1]);
    expect(onAdultsChange).toHaveBeenCalledWith(3);
  });

  it('calls onAdultsChange when decrementing adults', () => {
    const onAdultsChange = vi.fn();
    render(<TravelerCounter {...defaultProps} onAdultsChange={onAdultsChange} />);
    const minusButtons = screen.getAllByRole('button');
    // First button is the adults minus button
    fireEvent.click(minusButtons[0]);
    expect(onAdultsChange).toHaveBeenCalledWith(1);
  });

  it('disables decrement when adults is at minimum (1)', () => {
    render(<TravelerCounter {...defaultProps} adults={1} />);
    const minusButtons = screen.getAllByRole('button');
    expect(minusButtons[0]).toBeDisabled();
  });

  it('disables decrement when children is 0', () => {
    render(<TravelerCounter {...defaultProps} children={0} />);
    const buttons = screen.getAllByRole('button');
    // Third button is children minus
    expect(buttons[2]).toBeDisabled();
  });

  it('shows correct total travelers', () => {
    render(<TravelerCounter {...defaultProps} adults={3} children={2} />);
    expect(screen.getByText('5 travelers')).toBeInTheDocument();
  });
});
