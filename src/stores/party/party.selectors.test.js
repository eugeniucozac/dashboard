import {
  selectPartyInsuredsSorted,
  selectPartyInsuredsPagination,
  selectPartyReinsuredsSorted,
  selectPartyClientsSorted,
  selectPartyClientsPagination,
  selectPartyOptions,
} from 'stores';
import config from 'config';

describe('STORES › SELECTORS › party', () => {
  const defaultPagination = {
    page: 0,
    rowsTotal: 0,
    rowsPerPage: config.ui.pagination.default,
  };

  describe('Insureds', () => {
    it('selectPartyInsuredsSorted', () => {
      // assert
      expect(selectPartyInsuredsSorted({})).toEqual([]);
      expect(selectPartyInsuredsSorted({ party: {} })).toEqual([]);
      expect(selectPartyInsuredsSorted({ party: { insureds: {} } })).toEqual([]);
      expect(selectPartyInsuredsSorted({ party: { insureds: { items: [] } } })).toEqual([]);
      expect(
        selectPartyInsuredsSorted({
          party: {
            insureds: {
              items: [
                { id: 1, name: 'BAZ' },
                { id: 2, name: 'FOO' },
                { id: 3, name: 'BAR' },
              ],
            },
          },
        })
      ).toEqual([
        { id: 3, name: 'BAR' },
        { id: 1, name: 'BAZ' },
        { id: 2, name: 'FOO' },
      ]);
    });

    it('selectPartyInsuredsPagination', () => {
      // assert
      expect(selectPartyInsuredsPagination({})).toEqual(defaultPagination);
      expect(selectPartyInsuredsPagination({ party: {} })).toEqual(defaultPagination);
      expect(selectPartyInsuredsPagination({ party: { insureds: {} } })).toEqual(defaultPagination);
      expect(selectPartyInsuredsPagination({ party: { insureds: { foo: [] } } })).toEqual(defaultPagination);
      expect(selectPartyInsuredsPagination({ party: { insureds: { page: 10 } } })).toEqual({ ...defaultPagination, page: 9 });
      expect(selectPartyInsuredsPagination({ party: { insureds: { itemsTotal: 20 } } })).toEqual({ ...defaultPagination, rowsTotal: 20 });
      expect(selectPartyInsuredsPagination({ party: { insureds: { pageSize: 30 } } })).toEqual({ ...defaultPagination, rowsPerPage: 30 });
      expect(selectPartyInsuredsPagination({ party: { insureds: { page: 10, itemsTotal: 20, pageSize: 30 } } })).toEqual({
        page: 9,
        rowsTotal: 20,
        rowsPerPage: 30,
      });
    });
  });

  describe('Reinsureds', () => {
    it('selectPartyReinsuredsSorted', () => {
      // assert
      expect(selectPartyReinsuredsSorted({})).toEqual([]);
      expect(selectPartyReinsuredsSorted({ party: {} })).toEqual([]);
      expect(selectPartyReinsuredsSorted({ party: { reinsureds: {} } })).toEqual([]);
      expect(selectPartyReinsuredsSorted({ party: { reinsureds: { items: [] } } })).toEqual([]);
      expect(
        selectPartyReinsuredsSorted({
          party: {
            reinsureds: {
              items: [
                { id: 1, name: 'BAZ' },
                { id: 2, name: 'FOO' },
                { id: 3, name: 'BAR' },
              ],
            },
          },
        })
      ).toEqual([
        { id: 3, name: 'BAR' },
        { id: 1, name: 'BAZ' },
        { id: 2, name: 'FOO' },
      ]);
    });
  });

  describe('Clients', () => {
    it('selectPartyClientsSorted', () => {
      // assert
      expect(selectPartyClientsSorted({})).toEqual([]);
      expect(selectPartyClientsSorted({ party: {} })).toEqual([]);
      expect(selectPartyClientsSorted({ party: { clients: {} } })).toEqual([]);
      expect(selectPartyClientsSorted({ party: { clients: { items: [] } } })).toEqual([]);
      expect(
        selectPartyClientsSorted({
          party: {
            clients: {
              items: [
                { id: 1, name: 'BAZ' },
                { id: 2, name: 'FOO' },
                { id: 3, name: 'BAR' },
              ],
            },
          },
        })
      ).toEqual([
        { id: 3, name: 'BAR' },
        { id: 1, name: 'BAZ' },
        { id: 2, name: 'FOO' },
      ]);
    });

    it('selectPartyClientsPagination', () => {
      // assert
      expect(selectPartyClientsPagination({})).toEqual(defaultPagination);
      expect(selectPartyClientsPagination({ party: {} })).toEqual(defaultPagination);
      expect(selectPartyClientsPagination({ party: { clients: {} } })).toEqual(defaultPagination);
      expect(selectPartyClientsPagination({ party: { clients: { foo: [] } } })).toEqual(defaultPagination);
      expect(selectPartyClientsPagination({ party: { clients: { page: 10 } } })).toEqual({ ...defaultPagination, page: 9 });
      expect(selectPartyClientsPagination({ party: { clients: { itemsTotal: 20 } } })).toEqual({ ...defaultPagination, rowsTotal: 20 });
      expect(selectPartyClientsPagination({ party: { clients: { pageSize: 30 } } })).toEqual({ ...defaultPagination, rowsPerPage: 30 });
      expect(selectPartyClientsPagination({ party: { clients: { page: 10, itemsTotal: 20, pageSize: 30 } } })).toEqual({
        page: 9,
        rowsTotal: 20,
        rowsPerPage: 30,
      });
    });
  });

  it('selectPartyOptions', () => {
    // arrange
    const emptyOptions = {
      clients: [],
      insureds: [],
      reinsureds: [],
    };

    // assert
    expect(selectPartyOptions({})).toEqual(emptyOptions);
    expect(selectPartyOptions({ party: {} })).toEqual(emptyOptions);
    expect(selectPartyOptions({ party: { clients: {} } })).toEqual(emptyOptions);
    expect(selectPartyOptions({ party: { clients: { items: [] } } })).toEqual(emptyOptions);
    expect(selectPartyOptions({ party: { clients: { items: ['Joe'] } } })).toEqual({ ...emptyOptions, clients: ['Joe'] });
    expect(selectPartyOptions({ party: { clients: { items: ['Joe', 'John'] } } })).toEqual({ ...emptyOptions, clients: ['Joe', 'John'] });

    expect(selectPartyOptions({ party: { insureds: { items: [] } } })).toEqual(emptyOptions);
    expect(selectPartyOptions({ party: { insureds: { items: ['Bob'] } } })).toEqual({ ...emptyOptions, insureds: ['Bob'] });
    expect(selectPartyOptions({ party: { insureds: { items: ['Bob', 'Billy'] } } })).toEqual({
      ...emptyOptions,
      insureds: ['Bob', 'Billy'],
    });

    expect(selectPartyOptions({ party: { reinsureds: { items: [] } } })).toEqual(emptyOptions);
    expect(selectPartyOptions({ party: { reinsureds: { items: ['Bob'] } } })).toEqual({ ...emptyOptions, reinsureds: ['Bob'] });
    expect(selectPartyOptions({ party: { reinsureds: { items: ['Bob', 'Billy'] } } })).toEqual({
      ...emptyOptions,
      reinsureds: ['Bob', 'Billy'],
    });

    expect(selectPartyOptions({ party: { clients: { items: [] }, insureds: { items: [] }, reinsureds: { items: [] } } })).toEqual(
      emptyOptions
    );
    expect(
      selectPartyOptions({ party: { clients: { items: ['Joe'] }, insureds: { items: ['Bob'] }, reinsureds: { items: ['Tim'] } } })
    ).toEqual({ clients: ['Joe'], insureds: ['Bob'], reinsureds: ['Tim'] });
    expect(
      selectPartyOptions({
        party: { clients: { items: ['Joe', 'John'] }, insureds: { items: ['Bob', 'Billy'] }, reinsureds: { items: ['Tim', 'Tom'] } },
      })
    ).toEqual({ clients: ['Joe', 'John'], insureds: ['Bob', 'Billy'], reinsureds: ['Tim', 'Tom'] });
  });
});
