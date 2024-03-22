import React from 'react';
import { render, getFormText } from 'tests';
import ConfirmClaimSubmission from './ConfirmClaimSubmission';

describe('FORMS › ConfirmClaimSubmission', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ConfirmClaimSubmission {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    // it('renders the form', () => {
    //   // arrange
    //   const { getByTestId } = render(<ConfirmClaimSubmission {...props} />);

    //   // assert
    //   expect(getByTestId('form-confirmDecline')).toBeInTheDocument();
    // });

    // it('renders the form buttons', () => {
    //   // arrange
    //   const { queryByText } = render(<ConfirmClaimSubmission {...props} />);

    //   // assert
    //   expect(queryByText('app.cancel')).toBeInTheDocument();
    //   expect(queryByText('risks.decline')).toBeInTheDocument();
    // });

    // it('renders the form inputs', () => {
    //   // arrange
    //   const { container, getByLabelText } = render(<ConfirmClaimSubmission {...props} />);

    //   // assert
    //   expect(getByLabelText('form.declineConfirm.label')).toBeInTheDocument();
    //   expect(container.querySelector(getFormText('declineConfirm'))).toBeInTheDocument();
    // });
  });
});
