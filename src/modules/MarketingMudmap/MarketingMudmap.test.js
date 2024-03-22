import React from 'react';
import { render, waitFor } from 'tests';
import MarketingMudmap from './MarketingMudmap';

describe('MODULES › MarketingMudmap', () => {
  const refData = {
    departments: [
      {
        id: 1,
        name: 'Property',
        businessTypes: [
          { id: 1, description: 'All Risk' },
          { id: 2, description: 'Earthquake' },
          { id: 3, description: 'Wind & Fire' },
        ],
      },
    ],
    statuses: {
      policy: [
        { id: 1, code: 'Pending' },
        { id: 2, code: 'Not Taken Up' },
      ],
      policyMarketQuote: [
        { id: 1, code: 'Pending' },
        { id: 2, code: 'Quoted' },
        { id: 3, code: 'Declined' },
      ],
    },
  };

  const user = {
    role: 'BROKER',
    departmentIds: [1, 2, 3],
    auth: {
      accessToken: 'abc123',
    },
  };

  const placementWithMudmap = {
    selected: {
      id: 123,
      departmentId: 1,
      layers: [
        {
          id: 1,
          amount: 1000,
          excess: 10,
          businessTypeId: 1,
          isoCurrencyCode: 'USD',
          notes: 'layer 1',
          statusId: null,
          markets: [{ id: 1, premium: 500, writtenLinePercentage: 10, statusId: 2 }],
        },
        {
          id: 2,
          amount: 2000,
          excess: 20,
          businessTypeId: 2,
          isoCurrencyCode: 'CAD',
          notes: 'layer 2',
          statusId: 2,
          markets: [],
        },
      ],
    },
  };

  const placementWithoutMudmap = {
    selected: {
      id: 123,
      departmentId: 1,
      layers: [
        {
          id: 1,
          amount: 1000,
          excess: 10,
          businessTypeId: 1,
          isoCurrencyCode: 'USD',
          notes: 'layer 1',
          statusId: null,
          markets: [],
        },
      ],
    },
  };

  const initialState = {
    user,
    referenceData: refData,
    placement: placementWithMudmap,
  };

  const initialStateWithoutMudmap = {
    user,
    referenceData: refData,
    placement: placementWithoutMudmap,
  };

  describe('@render', () => {
    it('renders nothing if not passed a placementId', () => {
      // arrange
      const { container } = render(<MarketingMudmap />, { initialState });

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the business class tabs', async () => {
      // arrange
      const { getByTestId, getByText, queryByText } = render(<MarketingMudmap placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('tabs-mui')).toBeInTheDocument());

      // assert
      expect(getByText('All Risk')).toBeInTheDocument();
      expect(getByText('Earthquake')).toBeInTheDocument();
      expect(queryByText('Wind & Fire')).not.toBeInTheDocument();
    });

    it('renders the mudmap if it has valid layers/markets', async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<MarketingMudmap placementId={123} />, { initialState });

      // assert
      expect(getByTestId('mudmap')).toBeInTheDocument();
      expect(queryByTestId('empty-placeholder')).not.toBeInTheDocument();
    });

    it("renders Empty placeholder if it doesn't have valid layers/markets", async () => {
      // arrange
      const { getByTestId, queryByTestId } = render(<MarketingMudmap placementId={123} />, { initialState: initialStateWithoutMudmap });

      // assert
      expect(getByTestId('empty-placeholder')).toBeInTheDocument();
      expect(queryByTestId('mudmap')).not.toBeInTheDocument();
    });

    it('renders nothing for cobrokers if mudmap is not visible to cobrokers', async () => {
      // arrange
      const { queryByTestId } = render(<MarketingMudmap placementId={123} />, {
        initialState: {
          ...initialState,
          user: {
            ...initialState.user,
            role: 'COBROKER',
          },
        },
      });

      // assert
      expect(queryByTestId('mudmap')).not.toBeInTheDocument();
    });
  });
});
