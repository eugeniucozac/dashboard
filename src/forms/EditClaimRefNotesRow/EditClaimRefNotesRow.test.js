import React from 'react';
import { render, screen, getFormTextarea, getFormHidden } from 'tests';
import EditClaimRefNotesRow from './EditClaimRefNotesRow';

describe('FORMS › AddEditClaimRefNotes', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditClaimRefNotesRow />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<EditClaimRefNotesRow />);

      // assert
      expect(screen.getByTestId('edit-claimref-notes')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<EditClaimRefNotesRow />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<EditClaimRefNotesRow />);

      // assert
      expect(container.querySelector(getFormTextarea('notesDescription'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('caseIncidentNotesID'))).toBeInTheDocument();
    });
  });
});
