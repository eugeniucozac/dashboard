import React from 'react';
import { render, getFormText } from 'tests';
import ConfirmDecline from './ConfirmDecline';

describe('FORMS › ConfirmDecline', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ConfirmDecline {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<ConfirmDecline {...props} />);

      // assert
      expect(getByTestId('form-confirmDecline')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<ConfirmDecline {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('risks.decline')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<ConfirmDecline {...props} />);

      // assert
      expect(getByLabelText('form.declineConfirm.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('declineConfirm'))).toBeInTheDocument();
    });
  });
});
