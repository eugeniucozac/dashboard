import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'tests';

import ConfirmWithComment from './ConfirmWithComment';

describe('COMPONENTS › ConfirmWithComment', () => {
  it('renders with expected text', () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const { container, getByTestId } = render(
      <ConfirmWithComment
        confirmHandler={onConfirm}
        closeHandler={onClose}
        confirmLabel="Ok bro!"
        cancelLabel="No thanks!"
        confirmMessage="How many potatoes do you want?"
      />
    );
    expect(container).toBeInTheDocument();
    expect(getByTestId('cancel-button')).toHaveTextContent('No thanks!');
    expect(getByTestId('confirm-button')).toHaveTextContent('Ok bro!');
    expect(getByTestId('confirm-message')).toHaveTextContent('How many potatoes do you want?');
  });

  it('click handlers correctly registered', () => {
    const onConfirm = jest.fn((x) => console.log('x is ', x));
    const onCancel = jest.fn();
    const onClose = jest.fn();
    const { container } = render(
      <ConfirmWithComment
        confirmHandler={onConfirm}
        cancelHandler={onCancel}
        closeHandler={onClose}
        confirmLabel="Ok bro!"
        cancelLabel="No thanks!"
        confirmMessage="How many potatoes do you want?"
      />
    );
    expect(container).toBeInTheDocument();
    userEvent.click(screen.getByText('No thanks!'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
