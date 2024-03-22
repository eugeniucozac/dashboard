import React from 'react';
import { render } from 'tests';
import AddRiskRefAdvancedSearch from './AddRiskRefAdvancedSearch';

describe('FORMS › AddRiskRefAdvancedSearch', () => {
  const props = {
    fields: [],
    actions: [],
    coulmns: [],
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddRiskRefAdvancedSearch {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the AddRiskRefAdvancedSearch Form', () => {
      // arrange
      const { getByTestId } = render(<AddRiskRefAdvancedSearch {...props} />);

      // assert
      expect(getByTestId('form-addRiskRefAdvancedSearch')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddRiskRefAdvancedSearch {...props} />);

      // assert
      expect(queryByText('processingInstructions.addRiskReference.advancedSearchModalButton')).toBeInTheDocument();
    });
  });
});
