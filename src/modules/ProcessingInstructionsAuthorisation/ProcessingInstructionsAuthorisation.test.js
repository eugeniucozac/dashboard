import React from 'react';
import { render, getFormSelect, getFormCheckbox } from 'tests';
import ProcessingInstructionsAuthorisation from './ProcessingInstructionsAuthorisation';

describe('MODULES › ProcessingInstructionsAuthorisation', () => {
  const instruction = {
    id: 1,
    processTypeId: 1,
    checklist: [],
    riskReferences: [1],
    statusId: 1,
  };

  const processingInstructions = {
    usersInRoles: [
      { id: 1, fullName: 'Bob d. Builder', userRole: 'Front-End Contact' },
      { id: 2, fullName: 'Steve Smith', userRole: 'Operations Lead' },
    ],
  };

  const userWithReadOnlyAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read'],
      },
    },
  };

  const userWithFullAccess = {
    id: 1,
    privilege: {
      processingInstructions: {
        processingInstructions: ['read', 'create', 'update', 'delete'],
      },
    },
  };

  const props = {
    instruction,
    handlers: {
      back: () => {},
    },
  };

  describe('@render', () => {
    it('renders the form if users in roles is loaded', () => {
      // arrange
      const initialState = {
        user: userWithFullAccess,
        processingInstructions,
      };
      const { container } = render(<ProcessingInstructionsAuthorisation {...props} />, { initialState });

      // assert
      expect(container.querySelector(getFormSelect('frontEndContact'))).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('authorisedSignatory'))).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('readyToSubmit'))).toBeInTheDocument();
    });

    it("doesn't render the form if users in roles is NOT loaded", () => {
      // arrange
      const initialState = {
        user: userWithFullAccess,
        processingInstructions: {},
      };
      const { container } = render(<ProcessingInstructionsAuthorisation {...props} />, { initialState });

      // assert
      expect(container.querySelector(getFormSelect('frontEndContact'))).not.toBeInTheDocument();
      expect(container.querySelector(getFormSelect('authorisedSignatory'))).not.toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('readyToSubmit'))).not.toBeInTheDocument();
    });

    it("doesn't render the form if instruction is NOT loaded", () => {
      // arrange
      const initialState = {
        user: userWithFullAccess,
        processingInstructions,
      };
      const { container } = render(<ProcessingInstructionsAuthorisation {...props} instruction={null} />, {
        initialState,
      });

      // assert
      expect(container.querySelector(getFormSelect('frontEndContact'))).not.toBeInTheDocument();
      expect(container.querySelector(getFormSelect('authorisedSignatory'))).not.toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('readyToSubmit'))).not.toBeInTheDocument();
    });
  });

  describe('@access', () => {
    describe('read', () => {
      it('renders the form fields disabled', () => {
        // arrange
        const initialState = {
          user: userWithReadOnlyAccess,
          processingInstructions,
        };
        const { container } = render(<ProcessingInstructionsAuthorisation {...props} />, { initialState });

        // assert
        expect(container.querySelector(getFormSelect('frontEndContact')).previousSibling).toHaveAttribute('aria-disabled', 'true');
        expect(container.querySelector(getFormSelect('authorisedSignatory')).previousSibling).toHaveAttribute('aria-disabled', 'true');
      });

      it("doesn't render the ready to submit checkbox", () => {
        // arrange
        const { container } = render(<ProcessingInstructionsAuthorisation {...props} />, {
          initialState: { user: userWithReadOnlyAccess },
        });

        // assert
        expect(container.querySelector(getFormCheckbox('readyToSubmit'))).not.toBeInTheDocument();
      });
    });

    describe('create/update/delete', () => {
      it('renders the form fields enabled', () => {
        // arrange
        const initialState = {
          user: userWithFullAccess,
          processingInstructions,
        };
        const { container } = render(<ProcessingInstructionsAuthorisation {...props} />, { initialState });

        // assert
        expect(container.querySelector(getFormSelect('frontEndContact')).previousSibling).not.toHaveAttribute('aria-disabled', 'true');
        expect(container.querySelector(getFormSelect('authorisedSignatory')).previousSibling).not.toHaveAttribute('aria-disabled', 'true');
        expect(container.querySelector(getFormCheckbox('readyToSubmit'))).toBeEnabled();
      });
    });
  });
});
