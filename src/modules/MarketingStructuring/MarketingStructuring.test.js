import React from 'react';
import { useParams } from 'react-router';
import { render, waitFor } from 'tests';
import fetchMock from 'fetch-mock';
import MarketingStructuring from './MarketingStructuring';
import { fireEvent } from '../../tests';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('MODULES › MarketingStructuring', () => {
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

  beforeEach(() => {
    useParams.mockReturnValue({ id: 123, slug: 'one' });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders nothing if not passed a placementId', () => {
      // arrange
      const { container } = render(<MarketingStructuring />, { initialState });

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the business class tabs', async () => {
      // arrange
      const { getByTestId, getByText, queryByText } = render(<MarketingStructuring placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('tabs-mui')).toBeInTheDocument());

      // assert
      expect(getByText('All Risk')).toBeInTheDocument();
      expect(getByText('Earthquake')).toBeInTheDocument();
      expect(queryByText('Wind & Fire')).not.toBeInTheDocument();
    });

    it('renders the layer tables', async () => {
      // arrange
      const { queryByTestId, getByTestId } = render(<MarketingStructuring placementId={123} />, { initialState });
      await waitFor(() => expect(getByTestId('tabs-mui')).toBeInTheDocument());

      // assert
      expect(getByTestId('layer-table-1')).toBeInTheDocument();
      expect(queryByTestId('layer-table-2')).not.toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('renders the correct layer tables after clicking on business class tabs', async () => {
      // arrange
      const { queryByTestId, getByTestId, getAllByTestId } = render(<MarketingStructuring placementId={123} />, { initialState });
      const tabs = getAllByTestId('tabs-mui-item');
      await waitFor(() => expect(getByTestId('tabs-mui')).toBeInTheDocument());

      // act
      fireEvent.click(tabs[1]);

      // assert
      await waitFor(() => getByTestId('layer-table-2'));
      expect(queryByTestId('layer-table-1')).not.toBeInTheDocument();
      expect(getByTestId('layer-table-2')).toBeInTheDocument();
    });
  });
  describe('@rendering buttons', () => {
    it('renders the buttons when the toggle is clicked', async () => {
      // arrange

      const { getByTestId } = render(<MarketingStructuring placementId={123} />, { initialState });

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
