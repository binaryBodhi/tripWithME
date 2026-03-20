import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PreviousTrips from '../PreviousTrips';
import * as tripService from '../../services/trip';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock the trip service
vi.mock('../../services/trip', () => ({
  getPreviousTrips: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-123', first_name: 'Test' }
  })
}));


describe('PreviousTrips Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    tripService.getPreviousTrips.mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <ToastProvider>
          <PreviousTrips />
        </ToastProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders empty state when no trips are found', async () => {
    tripService.getPreviousTrips.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <ToastProvider>
          <PreviousTrips />
        </ToastProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/No trips found/i)).toBeInTheDocument();
    });
  });

  it('renders trips when data is fetched', async () => {
    const mockTrips = [
      {
        id: '1',
        from_location: 'New York',
        to_location: 'Boston',
        departure_date: new Date().toISOString(),
        status: 'completed',
        creator_name: 'John Doe',
        passengers: []
      }
    ];
    tripService.getPreviousTrips.mockResolvedValue({ data: mockTrips });
    
    render(
      <MemoryRouter>
        <ToastProvider>
          <PreviousTrips />
        </ToastProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/New York/i)).toBeInTheDocument();
      expect(screen.getByText(/Boston/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });
});
