import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, within } from 'tests';
import AdvancedSearch from './AdvancedSearch';

describe('COMPONENTS › AdvancedSearch', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AdvancedSearch />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the grid columns', () => {
      // arrange
      const { getByTestId } = render(<AdvancedSearch />);

      // assert
      expect(getByTestId('advanced-search-box-left')).toBeInTheDocument();
      expect(getByTestId('advanced-search-box-right')).toBeInTheDocument();
    });

    it('renders the category lists', () => {
      // arrange
      const results = {
        foo: { items: [1] },
        bar: { items: [1] },
        clients: { items: [1] },
        clientOfficeParents: { items: [1] },
        markets: { items: [1] },
        policies: { items: [1] },
        biz: { items: [1] },
        insureds: { items: [1] },
        departments: { items: [1] },
        buz: { items: [1] },
      };

      const { queryByText, getByText } = render(<AdvancedSearch />, { initialState: { search: { results } } });

      // assert
      expect(queryByText('advancedSearch.categories.foo')).not.toBeInTheDocument();
      expect(queryByText('advancedSearch.categories.bar')).not.toBeInTheDocument();
      expect(getByText('advancedSearch.categories.clients')).toBeInTheDocument();
      expect(getByText('advancedSearch.categories.clientOfficeParents')).toBeInTheDocument();
      expect(getByText('advancedSearch.categories.markets')).toBeInTheDocument();
      expect(getByText('advancedSearch.categories.policies')).toBeInTheDocument();
      expect(queryByText('advancedSearch.categories.biz')).not.toBeInTheDocument();
      expect(queryByText('advancedSearch.categories.insureds')).toBeInTheDocument();
      expect(queryByText('advancedSearch.categories.departments')).toBeInTheDocument();
      expect(queryByText('advancedSearch.categories.buz')).not.toBeInTheDocument();
    });

    it('renders "no results" if category list is missing or empty', () => {
      // arrange
      const results = {
        clients: null,
        clientOfficeParents: undefined,
        markets: {},
        policies: { items: null },
        insureds: { items: [] },
        departments: { items: [1] },
      };

      const { getByTestId } = render(<AdvancedSearch />, { initialState: { search: { results } } });

      // assert
      expect(within(getByTestId('advanced-search-group-clients')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-clientOfficeParents')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-markets')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-policies')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-insureds')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-departments')).getByText('advancedSearch.noResult')).toBeInTheDocument();
    });

    it('renders "see all" link if there is more items in total than returned by endpoint', () => {
      // arrange
      const results = {
        clients: { items: [], total: 0 },
        clientOfficeParents: { items: [], total: 0 },
        markets: { items: [{ id: 1, name: 'foo' }], total: 1 },
        policies: { items: [{ id: 1, name: 'foo' }], total: 5 },
        insureds: {
          items: [
            { id: 1, name: 'foo' },
            { id: 1, name: 'foo' },
            { id: 1, name: 'foo' },
          ],
          total: 3,
        },
        departments: {
          items: [
            { id: 1, name: 'foo' },
            { id: 1, name: 'foo' },
          ],
          total: 1,
        },
      };

      const { getByTestId } = render(<AdvancedSearch />, { initialState: { search: { results } } });

      // assert
      expect(within(getByTestId('advanced-search-group-clients')).queryByText('app.seeAll')).not.toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-clientOfficeParents')).queryByText('app.seeAll')).not.toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-markets')).queryByText('app.seeAll')).not.toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-policies')).getByText('app.seeAll')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-insureds')).queryByText('app.seeAll')).not.toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-departments')).queryByText('app.seeAll')).not.toBeInTheDocument();
    });

    it('renders the result items', () => {
      // arrange
      const results = {
        clients: { items: [] },
        clientOfficeParents: { items: [] },
        markets: { items: [{ id: 1 }] },
        policies: { items: [{ name: 'foo' }] },
        insureds: {
          items: [
            { id: 1, name: 'foo' },
            { id: 2, name: 'bar' },
          ],
        },
        departments: { items: [{ id: 1 }, { name: 'bar' }, { id: 3, name: 'tic' }, { id: 4, name: 'tac' }, { id: 5, name: 'toe' }] },
      };

      const { getByTestId } = render(<AdvancedSearch />, { initialState: { search: { results } } });

      // assert
      expect(within(getByTestId('advanced-search-group-clients')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-markets')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-policies')).queryByText('foo')).not.toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-policies')).getByText('advancedSearch.noResult')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-insureds')).getByText('foo')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-insureds')).getByText('bar')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-departments')).queryByText('bar')).not.toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-departments')).getByText('tic')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-departments')).getByText('tac')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-departments')).getByText('toe')).toBeInTheDocument();
    });

    it('renders the search query in bold', () => {
      // arrange
      const search = {
        resultsTerm: 'bar',
        results: {
          clients: { items: [{ id: 1, name: 'clientbar' }] },
          clientOfficeParents: { items: [{ id: 1, name: 'client office parent bar' }] },
          markets: { items: [{ id: 1, name: 'bar market' }] },
          policies: { items: [{ id: 1, name: 'policy barbar text' }] },
          insureds: {
            items: [
              { id: 1, name: 'foo' },
              { id: 2, name: 'qwertybar' },
            ],
          },
          departments: {
            items: [
              { id: 1, name: 'bar' },
              { id: 2, name: 'foobar' },
              { id: 3, name: 'foobarbar' },
              { id: 4, name: 'foobarbarqwe' },
              { id: 5, name: 'barbar' },
            ],
          },
        },
      };

      const { getByTestId } = render(<AdvancedSearch />, { initialState: { search } });

      // assert
      expect(within(getByTestId('advanced-search-group-clients')).getByText('client')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-clients').querySelector('strong')).getByText('bar')).toBeInTheDocument();

      expect(within(getByTestId('advanced-search-group-clientOfficeParents')).getByText('client office parent')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-clientOfficeParents').querySelector('strong')).getByText('bar')).toBeInTheDocument();

      expect(within(getByTestId('advanced-search-group-markets')).getByText('market')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-markets').querySelector('strong')).getByText('bar')).toBeInTheDocument();

      expect(within(getByTestId('advanced-search-group-policies')).getByText('policy text')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-policies').querySelectorAll('strong')[0]).getByText('bar')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-policies').querySelectorAll('strong')[1]).getByText('bar')).toBeInTheDocument();

      expect(within(getByTestId('advanced-search-group-insureds')).getByText('foo')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-insureds')).getByText('qwerty')).toBeInTheDocument();
      expect(within(getByTestId('advanced-search-group-insureds').querySelector('strong')).getByText('bar')).toBeInTheDocument();

      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(1) strong')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(2)')).getByText('foo')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(2) strong')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(3)')).getByText('foo')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(3) strong:nth-child(1)')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(3) strong:nth-child(2)')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(4)')).getByText('fooqwe')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(4) strong:nth-child(1)')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(4) strong:nth-child(2)')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(5) strong:nth-child(1)')).getByText('bar')
      ).toBeInTheDocument();
      expect(
        within(getByTestId('advanced-search-group-departments').querySelector('ul a:nth-child(5) strong:nth-child(2)')).getByText('bar')
      ).toBeInTheDocument();
    });

    it("renders an error message if there's an error", () => {
      // arrange
      const { getByText } = render(<AdvancedSearch />, { initialState: { search: { error: 'Boooo something went wrong' } } });

      // assert
      expect(getByText('Boooo something went wrong')).toBeInTheDocument();
    });

    it("doesn't render the results if there's an error", () => {
      // arrange
      const search = {
        results: {
          departments: {
            items: [{ id: 1, name: 'foo' }],
          },
        },
        error: 'Boooo something went wrong',
      };

      const { queryByTestId, getByText } = render(<AdvancedSearch />, { initialState: { search } });

      // assert
      expect(queryByTestId('advanced-search-group-departments')).not.toBeInTheDocument();
      expect(getByText('Boooo something went wrong')).toBeInTheDocument();
    });

    // TODO added on 24/11/2020: test
    // it('renders the "see all" link if there\'s more total results than the items returned', () => {})

    it('renders links with href if the result type is supported', () => {
      // arrange
      const search = {
        resultsTerm: 'dept',
        results: {
          clients: {
            total: 1,
            items: [{ id: 1, name: 'client 1' }],
          },
          clientOfficeParents: {
            total: 2,
            items: [
              { id: 1, name: 'clientOfficeParent 1' },
              { id: 2, name: 'clientOfficeParent 2' },
            ],
          },
          departments: {
            total: 3,
            items: [
              { id: 1, name: 'department one' },
              { id: 2, name: 'department two' },
              { id: 3, name: 'department three' },
            ],
          },
          insureds: {
            total: 4,
            items: [
              { id: 1, name: 'insured 1' },
              { id: 2, name: 'insured 2' },
              { id: 3, name: 'insured 3' },
              { id: 4, name: 'insured 4' },
            ],
          },
          markets: {
            total: 3,
            items: [
              { id: 1, name: 'market 1' },
              { id: 2, name: 'market 2' },
              { id: 3, name: 'market 3' },
            ],
          },
          policies: {
            total: 2,
            items: [
              { id: 1, name: 'policy 1' },
              { id: 2, name: 'policy 2' },
            ],
          },
        },
      };

      const { getByTestId } = render(<AdvancedSearch />, { initialState: { search } });

      // assert
      expect(getByTestId('advanced-search-group-clients').querySelectorAll('ul > a').length).toBe(0);
      expect(getByTestId('advanced-search-group-clients').querySelectorAll('ul > div').length).toBe(1);

      expect(getByTestId('advanced-search-group-clientOfficeParents').querySelectorAll('ul > a').length).toBe(2);
      expect(getByTestId('advanced-search-group-clientOfficeParents').querySelectorAll('ul > div').length).toBe(0);

      expect(getByTestId('advanced-search-group-departments').querySelectorAll('ul > a').length).toBe(3);
      expect(getByTestId('advanced-search-group-departments').querySelectorAll('ul > div').length).toBe(0);

      expect(getByTestId('advanced-search-group-insureds').querySelectorAll('ul > a').length).toBe(0);
      expect(getByTestId('advanced-search-group-insureds').querySelectorAll('ul > div').length).toBe(4);

      expect(getByTestId('advanced-search-group-markets').querySelectorAll('ul > a').length).toBe(0);
      expect(getByTestId('advanced-search-group-markets').querySelectorAll('ul > div').length).toBe(3);

      expect(getByTestId('advanced-search-group-policies').querySelectorAll('ul > a').length).toBe(2);
      expect(getByTestId('advanced-search-group-policies').querySelectorAll('ul > div').length).toBe(0);
    });
  });
});
