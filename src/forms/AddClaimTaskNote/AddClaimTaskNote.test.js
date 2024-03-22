import React from 'react';
import { render, screen, getFormHidden, getFormTextarea } from 'tests';
import AddClaimTaskNote from './AddClaimTaskNote';

describe('FORMS › AddClaimTaskNote', () => {
  const props = {
    taskObj: {
      processRef: 100,
      taskRef: 200,
      taskType: 'Type A',
    },
    setIsDirty: () => {},
    confirmHandler: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      render(<AddClaimTaskNote {...props} />);

      // assert
      expect(screen.getByTestId('form-addClaimTaskNote')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<AddClaimTaskNote {...props} />);

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.save')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container } = render(<AddClaimTaskNote {...props} />);

      // assert
      expect(container.querySelector(getFormHidden('claimRef'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('taskId'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('taskType'))).toBeInTheDocument();

      expect(screen.getByText('claims.notes.addNoteFields.details.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('details'))).toBeInTheDocument();
    });

    it('renders the read-only data', () => {
      // arrange
      render(<AddClaimTaskNote {...props} />);

      // assert
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
      expect(screen.getByText('Type A')).toBeInTheDocument();
    });
  });
});
