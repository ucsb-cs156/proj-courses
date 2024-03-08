import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { QueryClient, QueryClientProvider } from 'react-query';
import AddToScheduleModal from 'main/components/PersonalSchedules/AddToScheduleModal';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

describe('AddToScheduleModal', () => {
  let mockOnAdd;

  beforeEach(() => {
    mockOnAdd = jest.fn();
  });

  test('renders without crashing', () => {
    render(
        <QueryClientProvider client={queryClient}>
          <AddToScheduleModal onAdd={mockOnAdd} />
        </QueryClientProvider>
      );
  });

  test('opens and closes the modal', async () => {
    const { getByText, queryByText } = render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal onAdd={mockOnAdd} />
        </Router>
      </QueryClientProvider>
    );
  
    fireEvent.click(getByText('Add'));

    expect(getByText('Add to Schedule')).toBeInTheDocument();

    fireEvent.click(getByText('Close'));

    await waitFor(() => {
      expect(queryByText('Add to Schedule')).not.toBeInTheDocument();
    });
  });

  test('calls onAdd when save is clicked', () => {
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <AddToScheduleModal onAdd={mockOnAdd} />
        </Router>
      </QueryClientProvider>
    );

    fireEvent.click(getByText('Add'));
    fireEvent.click(getByText('Save Changes'));

    expect(mockOnAdd).toHaveBeenCalled();
  });
});