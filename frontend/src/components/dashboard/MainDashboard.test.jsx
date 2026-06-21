import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MainDashboard from './MainDashboard';
import axiosClient from '../../api/axiosClient';

const mockNavigate = jest.fn();

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { firstName: 'Admin' } }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../api/axiosClient', () => ({
  get: jest.fn(),
}));

describe('MainDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to task detail when Open Task is clicked', async () => {
    axiosClient.get
      .mockResolvedValueOnce({ data: { data: [{ id: 'wf-1' }] } })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'task-123',
              title: 'Review payroll',
              dueDate: '2026-07-01',
            },
          ],
        },
      });

    render(<MainDashboard />);

    await waitFor(() => screen.getByText('Open Task'));
    fireEvent.click(screen.getByText('Open Task'));

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/task-123');
  });
});
