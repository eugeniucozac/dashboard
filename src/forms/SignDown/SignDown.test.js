import React from 'react';
import { render, getFormNumber, getFormHidden } from 'tests';
import SignDown from './SignDown';

describe('FORMS › SignDown', () => {
  const props = {
    policy: {},
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<SignDown {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<SignDown {...props} />);

      // assert
      expect(getByTestId('form-signDown')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<SignDown {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<SignDown {...props} />);

      // assert
      expect(getByLabelText('placement.form.signDown.label')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('signedDownPercentage'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('policy_id'))).toBeInTheDocument();
    });
  });
});
