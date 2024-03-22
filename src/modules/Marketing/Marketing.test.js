import React from 'react';
import { useParams } from 'react-router';
import { render, fireEvent } from 'tests';
import Marketing from './Marketing';
import fetchMock from 'fetch-mock';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('MODULES › Marketing', () => {
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
          { id: 1, code: 'Quoted' },
          { id: 2, code: 'Declined' },
        ],
      },
      capacityTypes: [
        { id: 7, name: 'London', color: 'red' },
        { id: 8, name: 'Europe', color: 'green' },
        { id: 9, name: 'Bermuda', color: 'blue' },
        { id: 10, name: 'Wordlwide', color: 'orange' },
        { id: 11, name: 'America', color: 'yellow' },
      ],
    },
    user: {
      id: 'joe',
      role: 'BROKER',
    },
  };

  describe('@render', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    describe('empty', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ id: null });
      });

      afterEach(() => {
        fetchMock.restore();
      });

      it('renders nothing if not passed a placement ID', () => {
        // arrange
        const { container } = render(<Marketing />, { initialState });

        // expect
        expect(container).toBeEmptyDOMElement();
      });
    });

    describe('with placement ID', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ id: 123 });
      });

      afterEach(() => {
        fetchMock.restore();
      });

      it('renders the 3 section buttons', () => {
        // arrange
        const { getByTestId, getByText } = render(<Marketing />, { initialState });

        // expect
        expect(getByTestId('toggle-button-group-marketing')).toBeInTheDocument();
        expect(getByText('placement.marketing.sections.markets')).toBeInTheDocument();
        expect(getByText('placement.marketing.sections.structuring')).toBeInTheDocument();
        expect(getByText('placement.marketing.sections.mudmap')).toBeInTheDocument();
      });
    });
  });

  describe('@actions', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
      useParams.mockReturnValue({ id: 123 });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('renders the correct marketing content when switching section', () => {
      // arrange
      const { queryByTestId, getByTestId, getByText, queryByText } = render(<Marketing />, { initialState });
      const btnMarkets = getByText('placement.marketing.sections.markets');
      const btnStructuring = getByText('placement.marketing.sections.structuring');
      const btnMudmap = getByText('placement.marketing.sections.mudmap');

      // act
      fireEvent.click(btnMarkets);

      // expect
      expect(getByTestId('placement-marketing-markets')).toBeInTheDocument();
      expect(queryByTestId('placement-marketing-structuring')).not.toBeInTheDocument();
      expect(queryByTestId('placement-marketing-mudmap')).not.toBeInTheDocument();
      expect(getByText('placement.marketing.addMarket')).toBeInTheDocument();
      expect(queryByText('placement.marketing.addLayer')).not.toBeInTheDocument();

      // act
      fireEvent.click(btnStructuring);

      // expect
      expect(queryByTestId('placement-marketing-markets')).not.toBeInTheDocument();
      expect(getByTestId('placement-marketing-structuring')).toBeInTheDocument();
      expect(queryByTestId('placement-marketing-mudmap')).not.toBeInTheDocument();
      expect(queryByText('placement.marketing.addMarket')).not.toBeInTheDocument();
      expect(getByText('placement.marketing.addLayer')).toBeInTheDocument();

      // act
      fireEvent.click(btnMudmap);

      // expect
      expect(queryByTestId('placement-marketing-markets')).not.toBeInTheDocument();
      expect(queryByTestId('placement-marketing-structuring')).not.toBeInTheDocument();
      expect(getByTestId('placement-marketing-mudmap')).toBeInTheDocument();
      expect(queryByText('placement.marketing.addMarket')).not.toBeInTheDocument();
      expect(queryByText('placement.marketing.addLayer')).not.toBeInTheDocument();
    });
  });
});
