import React from 'react';
import { render, getFormAutocomplete } from 'tests';
import MarketSelection from './MarketSelection';

describe('FORMS › MarketSelection', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<MarketSelection {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<MarketSelection {...props} />);

      // assert
      expect(getByTestId('form-marketSelection')).toBeInTheDocument();
    });

    it('renders nothing if no options have been fetched', () => {
      // arrange
      const { container } = render(<MarketSelection {...props} />);

      // assert
      expect(container.querySelector(getFormAutocomplete('market'))).not.toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const initialState = {
        marketParent: {
          listAll: {
            items: [
              { id: 1, name: 'one' },
              { id: 2, name: 'two' },
            ],
          },
        },
      };
      const { container } = render(<MarketSelection {...props} />, { initialState });

      // assert
      expect(container.querySelector(getFormAutocomplete('market'))).toBeInTheDocument();
    });
  });
});
