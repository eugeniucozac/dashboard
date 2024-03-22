import React from 'react';
import { render, waitFor } from 'tests';
import { fireEvent } from '../../tests';

import MarketingMarketsBulk from './MarketingMarketsBulk';

describe('MODULES › MarketingMarketsBulk', () => {
  const initialState = {
    referenceData: {
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
    },
    department: {
      markets: {
        items: [],
      },
    },
    placement: {
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
          },
          {
            id: 2,
            amount: 2000,
            excess: 20,
            businessTypeId: 2,
            isoCurrencyCode: 'CAD',
            notes: 'layer 2',
            statusId: 2,
          },
        ],
      },
      selectedMarkets: [],

      list: {
        items: [],
        itemsTotal: 0,
        page: 1,
        pageSize: 10,
        pageTotal: 0,
        query: '',
      },
      sort: {
        by: 'inceptionDate',
        type: 'date',
        direction: 'asc',
      },

      bulk: {
        type: '',
        items: [],
      },
      bulkItems: {
        layers: [],
        layerMarkets: [],
      },
      bulkItemsMarketingMarkets: {
        marketingMarkets: [],
      },
      loadingSelected: false,
      showBulkSelect: false,
    },
    user: {
      role: 'BROKER',
      departmentIds: [1, 2, 3],
      auth: {
        accessToken: 'abc123',
      },
    },
  };
  const underwriters = [
    { id: 1, firstName: 'John', lastName: 'Johnson', emailId: 'jj@abc.com' },
    { id: 2, firstName: 'Steve', lastName: 'Stevenson', emailId: 'ss@abc.com' },
    { id: 3, firstName: 'Mark', lastName: '', emailId: 'm@abc.com' },
    { id: 4, firstName: 'Frank', lastName: 'Frankenson', emailId: 'ff@abc.com' },
  ];
  const markets = [
    { id: 1, statusId: 1, market: { id: 10, edgeName: 'market10', statusId: 1, capacityTypeId: 1 }, underwriter: null },
    { id: 2, statusId: 2, market: { id: 20, edgeName: 'market20', statusId: 2, capacityTypeId: 1 }, underwriter: underwriters[1] },
    { id: 3, statusId: 3, market: { id: 30, edgeName: 'market30', statusId: 3, capacityTypeId: 2 }, underwriter: underwriters[2] },
    { id: 4, statusId: null, market: { id: 40, edgeName: 'market40', statusId: null, capacityTypeId: 2 }, underwriter: underwriters[3] },
    { id: 5, statusId: null, market: { id: 50, edgeName: 'market50', capacityTypeId: null }, underwriters: null },
  ];
  describe('@rendering buttons', () => {
    it('renders the buttons when the toggle is clicked', async () => {
      // arrange

      const { getByTestId } = render(<MarketingMarketsBulk markets={markets} />, { initialState });

      const btnSwitch = getByTestId('switch-selector').querySelector('input');
      await waitFor(() => expect(getByTestId('switch-selector')).toBeInTheDocument());

      // act

      fireEvent.click(btnSwitch);
      fireEvent.change(btnSwitch, { target: { value: true } });

      // assert

      expect(btnSwitch.checked).toEqual(true);
      expect(getByTestId('btn-select-all')).toBeInTheDocument();
      expect(getByTestId('btn-clear-all')).toBeInTheDocument();
    });
  });
});
