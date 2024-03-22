import React from 'react';
import { render, screen, getFormTextarea } from 'tests';
import AddEditClaimRefNotes from './AddEditClaimRefNotes';

describe('FORMS › AddEditClaimRefNotes', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddEditClaimRefNotes />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<AddEditClaimRefNotes />);

      // assert
      expect(screen.getByTestId('form-add-edit-claim-notes')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<AddEditClaimRefNotes />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<AddEditClaimRefNotes />);

      // assert
      expect(container.querySelector(getFormTextarea('notesDescription'))).toBeInTheDocument();
    });
  });
});
