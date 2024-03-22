import React from 'react';
import { render, screen, getFormSelect } from 'tests';
import SetClaimsTaskSelection from './SetClaimsTaskSelection';

const componentProps = {
  claim: {
    processID: '123',
  },
  claims: {
    tasks: [
      {
        taskListID: 3,
        processTypeID: 8,
        taskCode: 'InterimAdvice',
        taskLabel: 'Action Interim Advice',
        actionListValues: null,
      },
      {
        taskListID: 5,
        processTypeID: 8,
        taskCode: 'AdviceAndSettlement',
        taskLabel: 'Action Interim Advice / Settlement',
        actionListValues: null,
      },
      {
        taskListID: 9,
        processTypeID: 8,
        taskCode: 'ReviewClosure',
        taskLabel: 'Review File for Closure in GXB and Edge',
        actionListValues: null,
      },
    ],
  },
};

describe('FORMS › SetClaimsTaskSelection', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<SetClaimsTaskSelection {...componentProps} />);

      // assert
      expect(container).toBeInTheDocument();
    });
  });

  describe('Claim task selection Modal Window', () => {
    it('Set Claim task selection Popup Window', () => {
      // arrange
      render(<SetClaimsTaskSelection {...componentProps} />);

      //assert
      expect(screen.getByTestId('form-set-claim-task-selection')).toBeInTheDocument();
    });

    it('Task selection Exit Button', () => {
      // arrange
      render(<SetClaimsTaskSelection {...componentProps} />);

      //assert
      expect(screen.getByText('app.exit')).toBeInTheDocument();
    });

    it('Task selection Save Button', () => {
      // arrange
      render(<SetClaimsTaskSelection {...componentProps} />);

      //assert
      expect(screen.getByText('app.save')).toBeInTheDocument();
    });
  });

  describe('Claim task selection Options', () => {
    it('Claim task selection Form Select', () => {
      // arrange
      const { container } = render(<SetClaimsTaskSelection {...componentProps} />);

      //assert
      expect(container.querySelector(getFormSelect('taskSelection'))).toBeInTheDocument();
    });
  });
});
