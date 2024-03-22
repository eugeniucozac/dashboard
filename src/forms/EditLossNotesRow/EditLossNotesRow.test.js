import React from 'react';
import { render, screen, getFormTextarea, getFormHidden } from 'tests';
import EditLossNotesRow from './EditLossNotesRow';

describe('FORMS › AddEditClaimRefNotes', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditLossNotesRow />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<EditLossNotesRow />);

      // assert
      expect(screen.getByTestId('edit-loss-notes')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<EditLossNotesRow />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<EditLossNotesRow />);

      // assert
      expect(container.querySelector(getFormTextarea('notesDescription'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('caseIncidentNotesID'))).toBeInTheDocument();
    });
  });
});
