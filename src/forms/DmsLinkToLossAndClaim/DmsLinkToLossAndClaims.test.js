import React from 'react';
import { render, screen } from 'tests';
import DmsLinkToLossAndClaimView from './DmsLinkToLossAndClaim.view';
import DmsLinkToLossAndClaim from './DmsLinkToLossAndClaim';

const props = {
    docData: {},
    resetToDefaultValues: () => {}
};
describe('FORMS › DmsLinkToLossAndClaimView', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<DmsLinkToLossAndClaim {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      render(<DmsLinkToLossAndClaim {...props} />);

      // assert
      expect(screen.getByTestId('form-link-to-loss-and-claim')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      render(<DmsLinkToLossAndClaim {...props} />);

      // assert
      expect(screen.queryByText('app.link')).toBeInTheDocument();
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
    });
  });
});
