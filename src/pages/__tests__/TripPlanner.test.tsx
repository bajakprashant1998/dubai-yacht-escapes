import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripPlanner from '../TripPlanner';

// Mock hooks
vi.mock('@/hooks/useTripPlanner', () => ({
  useTripPlanner: () => ({
    generateTrip: vi.fn(),
    isGenerating: false,
    generatedPlan: null,
    tripId: null,
    error: null,
    modifyTrip: vi.fn(),
    loadTrip: vi.fn(),
    reset: vi.fn(),
  }),
}));

vi.mock('@/hooks/useComboAIRules', () => ({
  useMatchCombo: () => ({
    data: null,
    isLoading: false,
  }),
}));

vi.mock('@/hooks/useCurrency', () => ({
  useCurrency: () => ({
    currencies: [],
    selectedCurrency: 'AED',
    setSelectedCurrency: vi.fn(),
    convertPrice: (p: number) => p,
    formatPrice: (p: number) => `AED ${p}`,
    currentCurrency: { currency_symbol: 'AED', currency_code: 'AED', currency_name: 'UAE Dirham', rate_to_aed: 1, margin_percent: 0, is_enabled: true, id: '1', created_at: '', updated_at: '' },
    isLoading: false,
  }),
}));

vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderTripPlanner = () =>
  render(
    <MemoryRouter>
      <TripPlanner />
    </MemoryRouter>
  );

describe('TripPlanner Wizard', () => {
  it('renders step 1 (Dates) initially', () => {
    renderTripPlanner();
    expect(screen.getByText('When are you traveling?')).toBeInTheDocument();
    expect(screen.getByText('Arrival Date')).toBeInTheDocument();
    expect(screen.getByText('Departure Date')).toBeInTheDocument();
  });

  it('shows step indicator with Dates as active', () => {
    renderTripPlanner();
    // The Dates step label should be visible
    expect(screen.getByLabelText('Step 1: Dates')).toBeInTheDocument();
  });

  it('disables Continue button when no dates are selected', () => {
    renderTripPlanner();
    const continueBtn = screen.getByRole('button', { name: /continue/i });
    expect(continueBtn).toBeDisabled();
  });

  it('disables Back button on step 1', () => {
    renderTripPlanner();
    const backBtn = screen.getByRole('button', { name: /back/i });
    expect(backBtn).toBeDisabled();
  });

  it('renders all 5 step indicators', () => {
    renderTripPlanner();
    expect(screen.getByLabelText('Step 1: Dates')).toBeInTheDocument();
    expect(screen.getByLabelText('Step 2: Travelers')).toBeInTheDocument();
    expect(screen.getByLabelText('Step 3: Nationality')).toBeInTheDocument();
    expect(screen.getByLabelText('Step 4: Budget')).toBeInTheDocument();
    expect(screen.getByLabelText('Step 5: Style')).toBeInTheDocument();
  });

  it('shows trust badges', () => {
    renderTripPlanner();
    expect(screen.getByText('AI-Powered Planning')).toBeInTheDocument();
    expect(screen.getByText('Best Price Guaranteed')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });
});
