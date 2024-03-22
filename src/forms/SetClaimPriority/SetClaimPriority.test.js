import React from 'react';
import { render, screen, getFormAutocompleteMui } from 'tests';
import SetClaimPriority from './SetClaimPriority';

const componentProps = {
  claim: {
    claimID: '123',
  },
  claims: {
    priorities: [
      {
        id: '1',
        name: null,
        description: 'High',
      },
      {
        id: '2',
        name: null,
        description: 'Low',
      },
      {
        id: '3',
        name: null,
        description: 'Medium',
      },
    ],
  },
};

describe('FORMS › SetClaimPriority', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<SetClaimPriority {...componentProps} />);

      // assert
      expect(container).toBeInTheDocument();
    });
  });

  describe('Claim Priority Modal Window', () => {
    it('Set Claim Priority Popup Window', () => {
      // arrange
      render(<SetClaimPriority {...componentProps} />);

      //assert
      expect(screen.getByTestId('form-set-claim-priority')).toBeInTheDocument();
    });

    it('Priority Exit Button', () => {
      // arrange
      render(<SetClaimPriority {...componentProps} />);

      //assert
      expect(screen.getByText('app.exit')).toBeInTheDocument();
    });

    it('Priority Save Button', () => {
      // arrange
      render(<SetClaimPriority {...componentProps} />);

      //assert
      expect(screen.getByText('app.save')).toBeInTheDocument();
    });
  });

  describe('Claim Priority Options', () => {
    it('Claim Priority Form Select', () => {
      // arrange
      const { container } = render(<SetClaimPriority {...componentProps} />);

      //assert
      expect(container.querySelector(getFormAutocompleteMui('priority'))).toBeInTheDocument();
    });
  });
});
