import React from 'react';
import { render, screen } from 'tests';
import ClaimRefTasks from './ClaimRefTasks';

describe('MODULES › ClaimRefTasks', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ClaimRefTasks />);

      // assert
      expect(screen.getByTestId('tasks-tab')).toBeInTheDocument();
    });

    it('renders table search field', () => {
      // arrange
      render(<ClaimRefTasks />);

      // assert
      expect(screen.getByTestId('form-search')).toBeInTheDocument();
      expect(screen.getByTestId('search-button-go')).toBeInTheDocument();
    });

    it('renders tasks table', () => {
      // arrange
      render(<ClaimRefTasks />);

      // assert
      expect(screen.getByTestId('tasks-table')).toBeInTheDocument();
    });
  });
});
