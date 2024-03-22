import React from 'react';
import ResetForm from './ResetForm';
import { render } from 'tests';

describe('COMPONENTS › ResetForm', () => {
  const defaultProps = {
    resetFlag: null,
    resetForm: jest.fn(),
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ResetForm />);
    });
    it('does not call resetForm if resetFlag has not been passed', () => {
      // arrange
      render(<ResetForm {...defaultProps} />);

      // Assert
      expect(defaultProps.resetForm).not.toHaveBeenCalled();
    });
    it('calls resetForm if resetFlag is updated', () => {
      // arrange
      render(<ResetForm {...defaultProps} resetFlag="foo" />);

      // Assert
      expect(defaultProps.resetForm).toHaveBeenCalledTimes(1);
    });
  });
});
