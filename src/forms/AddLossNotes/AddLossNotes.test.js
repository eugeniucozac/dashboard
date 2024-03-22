import React from 'react';
import { render, screen, getFormTextarea } from 'tests';
import AddLossNotes from './AddLossNotes';

describe('FORMS › AddLossNotes', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddLossNotes />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<AddLossNotes />);

      // assert
      expect(screen.getByTestId('form-add-loss-notes')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<AddLossNotes />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<AddLossNotes />);

      // assert
      expect(container.querySelector(getFormTextarea('notesDescription'))).toBeInTheDocument();
    });
  });
});
