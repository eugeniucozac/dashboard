import React from 'react';
import { render, getFormAutocompleteMui, getFormHidden } from 'tests';
import AddPlacementMarket from './AddPlacementMarket';

describe('FORMS › AddPlacementMarket', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddPlacementMarket {...props} />);

      // assert
      expect(getByTestId('form-add-placement-market')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddPlacementMarket {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.saveEdit')).toBeInTheDocument();
      expect(queryByText('app.saveClose')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText } = render(<AddPlacementMarket {...props} />);

      // assert
      expect(container.querySelector(getFormHidden('placementId'))).toBeInTheDocument();

      expect(getByText('placement.marketing.fields.markets.label', { selector: 'label' })).toBeInTheDocument();
      expect(getByText('placement.marketing.fields.markets.hint')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('markets'))).toBeInTheDocument();
    });
  });
});
