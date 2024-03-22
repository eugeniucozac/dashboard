import React from 'react';
import { render, waitFor, fireEvent } from 'tests/index';
import QuoteBindAggregate from './QuoteBindAggregate';
import fetchMock from 'fetch-mock';

describe('PAGES › QuoteBindAdmin', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/facilities*', {
      body: {
        content: [
          {
            brokerCode: 'B0507',
            capacity: 20000000,
            carrierId: '61430f624e840262963a7e88',
            clientId: '614312af4e840262963a7e8a',
            commissionRates: {
              brokerCommissionRate: 7.5,
              clientCommissionRate: 20,
            },
            createdAt: '2021-10-04T13:17:43.334',
            createdBy: 'Anindita De',
            documentRules: null,
            id: '1',
            liveFrom: '2021-10-03T23:00:00',
            liveTo: '2022-10-03T23:00:00',
            name: 'Abc Test',
            notifiedUsers: [{ name: 'Anindita De', email: 'ani@test.com' }],
            permissionToBindGroups: ['BROKER', 'UNDERWRITER'],
            permissionToDismissIssuesGroups: ['BROKER'],
            preBind: false,
            pricerCode: 'BEAZLEY_CARGO_V1',
            productCode: 'NASCO_GENERAL',
            quoteValidDays: 365,
          },
        ],
      },
    });
    fetchMock.get(`glob:*/api/v1/facilities/1/aggregate-limits*`, {
      body: {
        aggregateFieldLimits: [
          {
            fieldName: 'limitState',
            label: 'State',
            qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
            valueLimits: [
              { fieldValue: 'ALABAMA', facilityLimit: 10000000, boundQuotesLimit: 1262998, alertRate: 80, label: 'Alabama' },
              { fieldValue: 'ALASKA', facilityLimit: 10000000, boundQuotesLimit: 1534694, alertRate: 80, label: 'Alaska' },
            ],
          },
          {
            fieldName: 'limitCountry',
            label: 'Country',
            qualifier: 'com.priceforbes.edge.programmes.model.products.windhail.USState',
            valueLimits: [
              { alertRate: 10, boundQuotesLimit: 167173, facilityLimit: 200000, fieldValue: 'UK', label: 'United Kingdom' },
              { alertRate: 50, boundQuotesLimit: 200000, facilityLimit: 6000000, fieldValue: 'US', label: 'United State' },
            ],
          },
        ],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders limit graphs', async () => {
      // arrange
      const { getByTestId, container } = render(<QuoteBindAggregate />);

      expect(container).toBeInTheDocument();
      expect(getByTestId('layout-main')).toBeInTheDocument();
      expect(getByTestId('products-aggregate')).toBeInTheDocument();
      await waitFor(() => expect(getByTestId('breadcrumb-products-aggregate-breadcrumbs')).toBeInTheDocument());
      await waitFor(() => expect(getByTestId('select-facilities-popover-ellipsis')).toBeInTheDocument());
      // await waitFor(() => expect(getByTestId('products-aggregate-limits-title')).toBeInTheDocument());
    });
  });
});
