import React from 'react';
import { render, getFormAutocompleteMui, getFormHidden } from 'tests';
import AddPlacementLayerMarket from './AddPlacementLayerMarket';

describe('FORMS › AddPlacementLayerMarket', () => {
  const props = {
    layer: {},
    placementMarkets: [],
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddPlacementLayerMarket {...props} />);

      // assert
      expect(getByTestId('form-add-placement-layer-market')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddPlacementLayerMarket {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.saveClose')).toBeInTheDocument();
      expect(queryByText('app.saveEdit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<AddPlacementLayerMarket {...props} />);

      // assert
      expect(container.querySelector(getFormHidden('placementlayerId'))).toBeInTheDocument();

      expect(getByText('market.fields.market', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('market'))).toBeInTheDocument();
    });
  });
});
