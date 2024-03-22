import React from 'react';

// app
import { render, fireEvent } from 'tests';
import AdminMarkets from './AdminMarkets';

describe('MODULES › AdminMarkets', () => {
  const initialState = {
    marketParent: {
      list: {
        items: [
          {
            id: 1,
            name: 'Market Parent 1',
            logoFileName: 'image-1.png',
            marketParentId: 2,
            markets: [
              { id: 1, name: 'Market 1.1' },
              { id: 2, name: 'Market 1.2' },
            ],
          },
          {
            id: 2,
            name: 'Market Parent 2',
            logoFileName: 'image-2.png',
            marketParentId: 3,
            markets: [{ id: 1, name: 'Market 2.1' }],
          },
        ],
      },
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AdminMarkets />);

      // assert
      expect(container).toBeInTheDocument();
    });
    it('renders the list of markets', () => {
      // arrange
      const { getByText, getByTestId, queryByText } = render(<AdminMarkets />, { initialState });

      // assert
      expect(getByText('admin.market_plural')).toBeInTheDocument();
      expect(getByText('admin.marketParent')).toBeInTheDocument();

      expect(getByText('Market Parent 1')).toBeInTheDocument();
      expect(queryByText('Market 1.1')).not.toBeInTheDocument();
      expect(queryByText('Market 1.2')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByTestId('parent-row-id-1'));

      // assert
      expect(getByText('Market 1.1')).toBeInTheDocument();
      expect(getByText('Market 1.2')).toBeInTheDocument();

      expect(getByText('Market Parent 2')).toBeInTheDocument();
      expect(queryByText('Market 2.1')).not.toBeInTheDocument();

      // act
      fireEvent.click(getByTestId('parent-row-id-2'));

      expect(queryByText('Market 1.1')).not.toBeInTheDocument();
      expect(queryByText('Market 1.2')).not.toBeInTheDocument();
      expect(getByText('Market 2.1')).toBeInTheDocument();
    });
    it('renders the first row open if one marketParent', () => {
      const initialState = {
        marketParent: {
          list: {
            items: [
              {
                id: 1,
                name: 'Market Parent 1',
                logoFileName: 'image-1.png',
                markets: [
                  { id: 1, name: 'Market 1.1' },
                  { id: 2, name: 'Market 1.2' },
                ],
              },
            ],
          },
        },
      };
      // arrange
      const { getByText } = render(<AdminMarkets />, { initialState });

      // assert
      expect(getByText('admin.market_plural')).toBeInTheDocument();
      expect(getByText('admin.marketParent')).toBeInTheDocument();

      expect(getByText('Market Parent 1')).toBeInTheDocument();
      expect(getByText('Market 1.1')).toBeInTheDocument();
      expect(getByText('Market 1.2')).toBeInTheDocument();
    });
    it('renders message if no marketParents', () => {
      const initialState = {
        marketParent: {
          list: {
            items: [],
          },
        },
      };
      // arrange
      const { getByText } = render(<AdminMarkets />, { initialState });

      // assert
      expect(getByText('admin.market_plural')).toBeInTheDocument();
      expect(getByText('admin.marketParent')).toBeInTheDocument();

      expect(getByText('admin.noMarketParents')).toBeInTheDocument();
    });
    it('renders message if no markets', () => {
      const initialState = {
        marketParent: {
          list: {
            items: [
              {
                id: 1,
                name: 'Market Parent 1',
                logoFileName: 'image-1.png',
                markets: [],
              },
            ],
          },
        },
      };
      // arrange
      const { getByText } = render(<AdminMarkets />, { initialState });

      // assert
      expect(getByText('admin.market_plural')).toBeInTheDocument();
      expect(getByText('admin.marketParent')).toBeInTheDocument();

      expect(getByText('Market Parent 1')).toBeInTheDocument();
      expect(getByText('admin.noMarkets')).toBeInTheDocument();
    });
  });
});
