import React from 'react';
import { render, screen } from 'tests';
import ComplexManagementInsured from './ComplexManagementInsured';

describe('FORMS › ComplexityManagementAddPolicy', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ComplexManagementInsured />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<ComplexManagementInsured />);

      // assert
      expect(screen.getByTestId('addInsuredModal')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<ComplexManagementInsured />);

      // assert
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders the search text field', () => {
      // arrange
      render(<ComplexManagementInsured />);

      //assert
      expect(screen.getByTestId('search-field')).toBeInTheDocument();
    });
  });
});
