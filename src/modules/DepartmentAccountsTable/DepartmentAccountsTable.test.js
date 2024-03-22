import React from 'react';
import { render } from 'tests';
import DepartmentAccountsTable from './DepartmentAccountsTable';

describe('MODULES › DepartmentAccountsTable', () => {
  describe('@render', () => {
    const defaultProps = {
      rows: [],
      cols: [],
      sort: {},
      pagination: {},
      handlers: {
        handleChangePage: () => {},
        handleChangeRowsPerPage: () => {},
        handleSort: () => {},
        handleClickRow: (id) => () => {},
        handleDoubleClickRow: (id) => () => {},
        handleNtuClick: () => {},
        handleEditPlacementClick: () => {},
        handleRemovePlacementClick: () => {},
      },
    };

    it('renders the table column headers', () => {
      // arrange
      const props = {
        ...defaultProps,
        cols: [
          { id: 'insureds', label: 'insureds' },
          { id: 'clients', label: 'clients' },
          { id: 'office', label: 'office' },
          { id: 'inceptionDate', label: 'inceptionDate', sort: { type: 'date', direction: 'asc' } },
          { id: 'statusLabel', label: 'statusLabel' },
          { id: 'brokers', label: 'brokers' },
          { id: 'cobrokers', label: 'cobrokers' },
          { id: 'actions' },
        ],
      };

      const { container } = render(<DepartmentAccountsTable {...props} />);
      const tablehead = container.querySelector('table > thead');

      // assert
      expect(tablehead).toBeInTheDocument();
      expect(tablehead.querySelector('th:nth-child(1)')).toHaveTextContent('insureds');
      expect(tablehead.querySelector('th:nth-child(2)')).toHaveTextContent('clients');
      expect(tablehead.querySelector('th:nth-child(3)')).toHaveTextContent('office');
      expect(tablehead.querySelector('th:nth-child(4)')).toHaveTextContent('inceptionDate');
      expect(tablehead.querySelector('th:nth-child(5)')).toHaveTextContent('statusLabel');
      expect(tablehead.querySelector('th:nth-child(6)')).toHaveTextContent('brokers');
      expect(tablehead.querySelector('th:nth-child(7)')).toHaveTextContent('cobrokers');
      expect(tablehead.querySelector('th:nth-child(8)')).not.toHaveTextContent('actions');
    });

    it('renders the table rows', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows: [
          {
            id: 1,
            insureds: [
              { id: 1, name: 'insured foo' },
              { id: 2, name: 'insured bar' },
            ],
            clients: [
              { id: 3, name: 'client abc' },
              { id: 4, name: 'client xyz' },
            ],
            users: [
              { id: 5, firstName: 'Aaron' },
              { id: 6, firstName: 'Bill', role: null },
              { id: 7, firstName: 'Charlie', lastName: 'Charleston', role: '' },
              { id: 8, firstName: 'Dennis', role: 'COBROKER' },
              { id: 9, firstName: 'Eric', role: 'COBROKER' },
              { id: 10, firstName: 'Francis', role: 'BROKER' },
            ],
            inceptionDate: '2020-03-31',
            statusId: 1,
          },
        ],
      };

      const initialState = {
        referenceData: {
          statuses: {
            placement: [
              { id: 1, code: 'Pending' },
              { id: 2, code: 'In Progress' },
              { id: 3, code: 'Expired' },
            ],
          },
        },
      };

      const { getByTestId } = render(<DepartmentAccountsTable {...props} />, { initialState });
      const avatarsBrokers = getByTestId(`avatar-group-brokers`);
      const avatarsCobrokers = getByTestId(`avatar-group-cobrokers`);

      // assert
      expect(getByTestId(`placement.1`)).toBeInTheDocument();
      expect(getByTestId('insured-1')).toHaveTextContent('insured foo, insured bar');
      expect(getByTestId('client-office-1')).toHaveTextContent('client abc');
      expect(getByTestId('client-office-1')).toHaveTextContent('client xyz');
      expect(getByTestId('inceptiondate-1')).toHaveTextContent('format.date(2020-03-31)');
      expect(getByTestId('status-alert')).toHaveTextContent('status.pending');
      expect(avatarsBrokers.children.length).toBe(4);
      expect(avatarsBrokers.querySelector(':nth-child(1)')).toHaveTextContent(/^A$/);
      expect(avatarsBrokers.querySelector(':nth-child(2)')).toHaveTextContent(/^B$/);
      expect(avatarsBrokers.querySelector(':nth-child(3)')).toHaveTextContent(/^CC$/);
      expect(avatarsBrokers.querySelector(':nth-child(4)')).toHaveTextContent(/^F$/);
      expect(avatarsCobrokers.children.length).toBe(2);
      expect(avatarsCobrokers.querySelector(':nth-child(1)')).toHaveTextContent(/^D$/);
      expect(avatarsCobrokers.querySelector(':nth-child(2)')).toHaveTextContent(/^E$/);
    });

    it('renders multiple table rows', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows: [
          { id: 1, insureds: [], clients: [], users: [] },
          { id: 2, insureds: [], clients: [], users: [] },
          { id: 3, insureds: [], clients: [], users: [] },
        ],
      };
      const { getByTestId } = render(<DepartmentAccountsTable {...props} />);

      // assert
      expect(getByTestId(`renewal-list`).children).toHaveLength(3);
    });
  });
});
