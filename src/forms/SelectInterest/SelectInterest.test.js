import React from 'react';
import { render, screen } from 'tests';
import SelectInterest from './SelectInterest';

const renderSelectInterest = (props, renderOptions) => {
  const componentProps = {
    ...props,
  };

  render(<SelectInterest {...componentProps} />);

  return {
    componentProps,
  };
};

describe('MODULES › SelectInterest', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      renderSelectInterest();

      // assert
      expect(screen.getByText('claims.claimInformation.selectInterestFromTheList')).toBeInTheDocument();
    });

    it('renders the Row labels', () => {
      // arrange
      renderSelectInterest();

      // assert
      expect(screen.getByText('claims.claimInformation.code')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.rate')).toBeInTheDocument();
      expect(screen.getByText('claims.claimInformation.description')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      renderSelectInterest();

      // assert
      expect(screen.queryByText('app.cancel')).toBeInTheDocument();
      expect(screen.queryByText('app.ok')).toBeInTheDocument();
    });
  });
});
