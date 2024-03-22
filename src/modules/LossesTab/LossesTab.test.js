import React from 'react';
import { render, screen } from 'tests';
import LossesTab from './LossesTab';


describe('MODULES › LossesTab', () => {
    describe('@render', () => {
      it('renders without crashing', () => {
        // arrange
        render(<LossesTab />);
  
        // assert
        expect(screen.getByTestId('losses-tab')).toBeInTheDocument();
      });

      it('renders table search field', () => {
        // arrange
        render(<LossesTab />);
  
        // assert
        expect(screen.getByTestId('form-search')).toBeInTheDocument();
        expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
      });

      it('renders losses search table', () => {
        // arrange
        render(<LossesTab />);
  
        // assert
        expect(screen.getByTestId('losses-search-table')).toBeInTheDocument();
        expect(screen.getByTestId('losses-table')).toBeInTheDocument();
      });


    });
});  