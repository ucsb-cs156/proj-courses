import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import PersonalScheduleSelector from 'main/components/PersonalSchedules/PersonalScheduleSelector';
import { useBackend } from 'main/utils/useBackend';

jest.mock('main/utils/useBackend');

describe('PersonalScheduleSelector', () => {
  let setSchedule;
  let setHasSchedules;

  beforeEach(() => {
    setSchedule = jest.fn();
    setHasSchedules = jest.fn();
    useBackend.mockReturnValue({
      data: [{ id: '1', name: 'Test Schedule' }],
      error: null,
      status: 'success',
    });
  });

  it('renders without crashing', () => {
    render(<PersonalScheduleSelector setSchedule={setSchedule} setHasSchedules={setHasSchedules} controlId="test" />);
  });

  it('calls setSchedule and setHasSchedules on mount if schedules are available', async () => {
    render(<PersonalScheduleSelector setSchedule={setSchedule} setHasSchedules={setHasSchedules} controlId="test" />);
    await waitFor(() => expect(setSchedule).toHaveBeenCalledWith('1'));
    expect(setHasSchedules).toHaveBeenCalledWith(true);
  });

  it('calls setSchedule and setHasSchedules on mount if schedules are not available', async () => {
    useBackend.mockReturnValueOnce({
      data: [],
      error: null,
      status: 'success',
    });
    render(<PersonalScheduleSelector setSchedule={setSchedule} setHasSchedules={setHasSchedules} controlId="test" />);
    await waitFor(() => expect(setSchedule).not.toHaveBeenCalled());
    expect(setHasSchedules).toHaveBeenCalledWith(false);
  });

  it('updates schedule state and localStorage on select change', async () => {
    const { getByLabelText } = render(<PersonalScheduleSelector setSchedule={setSchedule} setHasSchedules={setHasSchedules} controlId="test" />);
    const select = getByLabelText('Schedule');
    act(() => {
      fireEvent.change(select, { target: { value: '1' } });
    });
    expect(localStorage.getItem('test')).toBe('1');
    expect(setSchedule).toHaveBeenCalledWith('1');
  });
  
  it('calls the provided onChange function when the select changes', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
        onChange={onChange}
      />
    );
    const select = getByLabelText('Schedule');
    fireEvent.change(select, { target: { value: '1' } });
    expect(onChange).toHaveBeenCalled();
  });
  
  it('does not call onChange if it is null', () => {
    const { getByLabelText } = render(
      <PersonalScheduleSelector
        setSchedule={setSchedule}
        setHasSchedules={setHasSchedules}
        controlId="test"
      />
    );
    const select = getByLabelText('Schedule');
    fireEvent.change(select, { target: { value: '1' } });
    // No assertion necessary as we're just verifying that no error is thrown
  });
});