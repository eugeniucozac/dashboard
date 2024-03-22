import React from 'react';
import fetchMock from 'fetch-mock';
import { useParams } from 'react-router';
import Opportunity from './Opportunity';
import { render, waitFor } from 'tests';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

describe('PAGES › Opportunity', () => {
  const initialState = {
    trip: {
      selected: {
        title: '',
        visits: [],
        addresses: [],
        loading: false,
        editing: false,
      },
      leads: [
        {
          id: 1,
          geocodeResult: {
            lat: 50,
            lng: 100,
            outputAddress: 'mock output address',
            locationsFound: 1,
          },
        },
      ],
    },
  };

  beforeEach(() => {
    useParams.mockReturnValue({ id: null });
    jest.clearAllMocks();
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Opportunity />);

      // assert
      await waitFor(() => expect(document.title).toContain('opportunity.title'));
    });

    it('render read only mode if no trip is selected', () => {
      // arrange
      const { getByText } = render(<Opportunity />);

      // assert
      expect(getByText('opportunity.summaryHintTitle')).toBeInTheDocument();
    });

    it('renders trip on load', async () => {
      // arrange
      fetchMock.get('*', {
        body: {
          status: 'success',
          data: {
            id: 123,
            title: 'mock title',
            addresses: [],
            visit: [{ id: 123 }],
          },
        },
      });
      const state = { ...initialState };
      useParams.mockReturnValue({ id: 123 });
      const { getByText } = render(<Opportunity />, { initialState: state });

      // assert
      await waitFor(() => getByText('mock title'));
      expect(getByText('mock title')).toBeInTheDocument();
    });

    it('renders list of leads', () => {
      // arrange
      const state = {
        ...initialState,
        trip: {
          selected: {
            visits: [],
            addresses: [],
          },
          leads: [
            { id: 1, client: { id: 1, name: 'lead 1' } },
            { id: 2, client: { id: 1, name: 'lead 2' } },
          ],
        },
      };
      const { getByText } = render(<Opportunity />, { initialState: state });

      // assert
      expect(getByText('lead 1')).toBeInTheDocument();
      expect(getByText('lead 2')).toBeInTheDocument();
    });
  });
});
