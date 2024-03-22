import React from 'react';
import { render, waitFor } from 'tests';
import { Market } from './Market';
import fetchMock from 'fetch-mock';

describe('PAGES › Market', () => {
  const list = [
    { id: 1, name: 'Foo' },
    { id: 2, name: 'Bar' },
  ];

  beforeEach(() => {
    localStorage.clear();
    fetchMock.get('glob:*/api/marketParent/all', { body: { status: 'success', data: { content: list } } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.restore();
  });

  const initialState = {
    marketParent: {
      listAll: {
        items: [],
      },
      selected: { id: 1, name: 'Foo' },
      placements: [],
    },
  };

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Market />);

      // assert
      // await waitFor(() => expect(document.title).toContain('market.title'));
    });

    it('renders select', async () => {
      // arrange
      const { queryByText } = render(<Market />, { initialState, route: ['/market'] });

      // assert
      expect(queryByText('market.title')).toBeInTheDocument();
    });
  });
});
