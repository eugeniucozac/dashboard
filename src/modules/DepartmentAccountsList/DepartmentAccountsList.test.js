import React from 'react';
import { render, within } from 'tests';
import DepartmentAccountsList from './DepartmentAccountsList';

describe('MODULES › DepartmentAccountsList', () => {
  describe('@render', () => {
    const defaultProps = {
      rows: [],
      sort: {},
      pagination: {},
      handlers: {
        handleChangePage: () => {},
        handleChangeRowsPerPage: () => {},
        handleClickRow: () => {},
      },
    };

    it('renders no list summary if not passed rows props', () => {
      // arrange
      const { container } = render(<DepartmentAccountsList {...defaultProps} />);

      // assert
      expect(container.querySelector('[data-testid^="summary-placement"]')).toBeFalsy();
    });

    it('renders empty pagination if not passed rows & pagination props', () => {
      // arrange
      const { getByTestId } = render(<DepartmentAccountsList />);

      // assert
      expect(getByTestId('pagination')).toBeInTheDocument();
      expect(within(getByTestId('pagination')).getByText('10')).toBeInTheDocument();
      expect(within(getByTestId('pagination')).getByText('0-0 pagination.of 0')).toBeInTheDocument();
    });

    it('renders the list items', () => {
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

      const { getByTestId } = render(<DepartmentAccountsList {...props} />, { initialState });
      const avatarsBrokers = getByTestId(`avatar-group-summary-brokers`);
      const avatarsCobrokers = getByTestId(`avatar-group-summary-cobrokers`);

      // assert
      expect(getByTestId('summary-placement-1')).toBeInTheDocument();
      expect(getByTestId('summary-title')).toHaveTextContent('insured foo, insured bar');
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

    it('renders multiple list items', () => {
      // arrange
      const props = {
        ...defaultProps,
        rows: [
          { id: 1, insureds: [], clients: [], users: [] },
          { id: 2, insureds: [], clients: [], users: [] },
          { id: 3, insureds: [], clients: [], users: [] },
        ],
      };
      const { getByTestId } = render(<DepartmentAccountsList {...props} />);

      // assert
      expect(getByTestId('summary-placement-1')).toBeInTheDocument();
      expect(getByTestId('summary-placement-2')).toBeInTheDocument();
      expect(getByTestId('summary-placement-3')).toBeInTheDocument();
    });
  });
});
