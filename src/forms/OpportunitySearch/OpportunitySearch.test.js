import React from 'react';
import { render, getFormAutocomplete } from 'tests';
import OpportunitySearch from './OpportunitySearch';

describe('FORMS › OpportunitySearch', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<OpportunitySearch {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<OpportunitySearch {...props} />);

      // assert
      expect(getByTestId('form-opportunitySearch')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<OpportunitySearch {...props} />);

      // assert
      expect(container.querySelector(getFormAutocomplete('addresses'))).toBeInTheDocument();
    });
  });
});
