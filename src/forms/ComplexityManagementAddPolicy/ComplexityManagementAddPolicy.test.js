import React from 'react';
import { render, screen } from 'tests';
import ComplexityManagementAddPolicy from './ComplexityManagementAddPolicy';

describe('FORMS › ComplexityManagementAddPolicy', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ComplexityManagementAddPolicy />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<ComplexityManagementAddPolicy />);

      // assert
      expect(screen.getByTestId('addComplexPolicyModal')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<ComplexityManagementAddPolicy />);

      // assert
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders the search text field', () => {
      // arrange
      render(<ComplexityManagementAddPolicy />);

      //assert
      expect(screen.getByTestId('search-field')).toBeInTheDocument();
    });
  });
});
