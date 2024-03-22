import React from 'react';
import { fireEvent, render } from 'tests';
import OpeningMemoSearch from './OpeningMemoSearch';
import fetchMock from 'fetch-mock';

describe('MODULES › OpeningMemoSearch', () => {
  const responseFilterByTextData = {
    content: [{ id: 1 }, { id: 2 }],
    pagination: { page: 1, pageSize: 5, itemsTotal: 3, pageTotal: 1, query: 'foo bar' },
  };

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<OpeningMemoSearch />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders title', () => {
      // arrange
      const { getByText } = render(<OpeningMemoSearch />);

      // assert
      expect(getByText('placement.openingMemo.search')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('performs search', () => {
      // arrange
      fetchMock.get('glob:*/api/v1/openingMemo*query=foo*', { body: { status: 'success', data: responseFilterByTextData } });
      const initialState = { openingMemo: { id: 1111 }, postSuccess: false };
      const { getByText, container } = render(<OpeningMemoSearch />, { initialState });
      const input = container.querySelector('input');

      // act
      fireEvent.change(input, { target: { value: 'foo' } });

      // assert
      expect(getByText('foo')).toBeInTheDocument();
    });
  });
});
