import React from 'react';
import { render, getFormAutocomplete, getFormHidden } from 'tests';
import EditTripBrokers from './EditTripBrokers';

describe('FORMS › EditTripBrokers', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditTripBrokers {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<EditTripBrokers {...props} />);

      // assert
      expect(getByTestId('form-editTripBrokers')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<EditTripBrokers {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText } = render(<EditTripBrokers {...props} />);

      // assert
      expect(getByText('form.brokers.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('users'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('id'))).toBeInTheDocument();
    });
  });
});
