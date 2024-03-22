import React from 'react';
import fetchMock from 'fetch-mock';
import { render, waitFor } from 'tests';
import { PortfolioMap } from './PortfolioMap';

describe('MODULES › PortfolioMap', () => {
  const defaultProps = {
    parent: {
      placements: [
        {
          id: 1,
          inceptionDate: '2018-01-01',
          policies: [{ policyPremiums: [{ originalGrossAmount100PctUSD: 1000 }] }],
          departmentId: 21,
          insureds: [{ id: 11, name: 'Foo account' }],
        },
        {
          id: 2,
          inceptionDate: '2019-01-01',
          policies: [{ policyPremiums: [{ originalGrossAmount100PctUSD: 1000 }] }],
          departmentId: 3,
          insureds: [{ id: 22, name: 'Bar account' }],
        },
        {
          id: 3,
          inceptionDate: '2020-01-01',
          policies: [{ policyPremiums: [{ originalGrossAmount100PctUSD: 1000 }] }],
          departmentId: 21,
          insureds: [{ id: 33, name: 'Baz account' }],
        },
        {
          id: 4,
          inceptionDate: '2021-01-01',
          policies: [{ policyPremiums: [{ originalGrossAmount100PctUSD: 1000 }] }],
          departmentId: 21,
          insureds: [{ id: 33, name: 'Baz account' }],
        },
      ],
      selected: {
        id: 5,
      },
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<PortfolioMap {...defaultProps} />);
    });
  });

  describe('@actions', () => {
    beforeEach(() => {
      fetchMock.get('glob:*summary*', {
        body: {
          status: 'success',
          data: locations,
        },
      });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    const locations = [
      {
        lng: -97,
        lat: 35,
        locationsFound: 10,
        address: 'United States',
        placements: [
          { placementId: '1', tiv: 1000 },
          { placementId: '3', tiv: 3000 },
          { placementId: '4', tiv: 4000 },
        ],
      },
      {
        lng: 7,
        lat: 4,
        locationsFound: 2,
        placements: [{ placementId: '3', tiv: 300 }],
      },
    ];

    it('renders map component with geolocation', async () => {
      // arrange
      const { getByText, queryByText } = render(<PortfolioMap {...defaultProps} />);
      await waitFor(() => getByText('client.accountsKey'));

      // assert
      expect(getByText('client.accountsKey')).toBeInTheDocument();
      expect(getByText('Foo account')).toBeInTheDocument();
      expect(queryByText('Bar account')).not.toBeInTheDocument();
      expect(getByText('Baz account')).toBeInTheDocument();
    });
  });
});
