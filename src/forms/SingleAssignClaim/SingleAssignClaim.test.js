import React from 'react';
import { render, screen, getFormAutocompleteMui, getFormTextarea } from 'tests';
import SingleAssignClaim from './SingleAssignClaim';

describe('FORMS › SingleAssignClaim', () => {
  const props = {
    handleClose: () => {},
    setIsDirty: () => {},
  };

  const stateWithAssignedUsers = {
    claims: {
      claimsAssignedToUsers: {
        type: 'bulkAssignClaims',
        items: [1, 2, 3],
        loaded: true,
      },
    },
  };

  const stateWithoutAssignedUsers = {
    claims: {
      claimsAssignedToUsers: {
        items: [],
        loaded: false,
      },
    },
  };

  describe('@render', () => {
    describe('if the data is not ready', () => {
      it('renders the loader', () => {
        // arrange
        render(<SingleAssignClaim {...props} />, { initialState: stateWithoutAssignedUsers });

        // assert
        expect(screen.getByTestId('loader')).toBeInTheDocument();
      });

      it("doesn't render the form", () => {
        // arrange
        render(<SingleAssignClaim {...props} />, { initialState: stateWithoutAssignedUsers });

        // assert
        expect(screen.queryByTestId('form-bulk-assign-claim')).not.toBeInTheDocument();
      });
    });

    describe('if data is ready', () => {
      it('renders the form', () => {
        // arrange
        render(<SingleAssignClaim {...props} />, { initialState: stateWithAssignedUsers });

        // assert
        expect(screen.getByTestId('form-bulk-assign-claim')).toBeInTheDocument();
      });

      it('renders the form buttons', () => {
        // arrange
        render(<SingleAssignClaim {...props} />, { initialState: stateWithAssignedUsers });

        // assert
        expect(screen.queryByText('app.cancel')).toBeInTheDocument();
        expect(screen.queryByText('app.assign')).toBeInTheDocument();
      });

      it('renders the form fields', () => {
        // arrange
        const { container } = render(<SingleAssignClaim {...props} />, { initialState: stateWithAssignedUsers });

        // assert

        expect(screen.getByLabelText('claims.processing.bulkAssign.fields.assignTo.label *')).toBeInTheDocument();
        expect(container.querySelector(getFormAutocompleteMui('assignTo'))).toBeInTheDocument();

        expect(screen.getByLabelText('claims.processing.bulkAssign.fields.notes.label *')).toBeInTheDocument();
        expect(container.querySelector(getFormTextarea('notes'))).toBeInTheDocument();
      });
    });
  });
});
