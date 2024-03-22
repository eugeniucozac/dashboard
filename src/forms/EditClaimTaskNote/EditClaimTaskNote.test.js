import React from 'react';
import { render, screen, getFormHidden, getFormTextarea } from 'tests';
import EditClaimTaskNote from './EditClaimTaskNote';

describe('FORMS › EditClaimTaskNote', () => {
  const props = {
    noteObj: {
      createdDate: 2000,
      createdByName: 'John',
      updatedDate: 2001,
      updatedByName: 'Jane',
    },
    setIsDirty: () => {},
    confirmHandler: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      render(<EditClaimTaskNote {...props} />);

      // assert
      expect(screen.getByTestId('form-editClaimTaskNote')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<EditClaimTaskNote {...props} />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<EditClaimTaskNote {...props} />);

      // assert
      expect(screen.getByText('claims.notes.editNoteFields.details.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('details'))).toBeInTheDocument();
    });

    it('renders the read-only data', () => {
      // arrange
      render(<EditClaimTaskNote {...props} />);

      // assert
      expect(screen.getByText('claims.notes.editNoteFields.createdDate.label')).toBeInTheDocument();
      expect(screen.getByText('format.date(2000)')).toBeInTheDocument();
      expect(screen.getByText('claims.notes.editNoteFields.createdByName.label')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('claims.notes.editNoteFields.updatedDate.label')).toBeInTheDocument();
      expect(screen.getByText('format.date(2001)')).toBeInTheDocument();
      expect(screen.getByText('claims.notes.editNoteFields.updatedByName.label')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });
});
