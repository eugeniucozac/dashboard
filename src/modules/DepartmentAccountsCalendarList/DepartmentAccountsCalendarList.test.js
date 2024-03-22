import React from 'react';
import { render, waitForElementToBeRemoved } from 'tests';
import DepartmentAccountsCalendarList from './DepartmentAccountsCalendarList';
import fetchMock from 'fetch-mock';
import * as utils from 'utils';

describe('MODULES › DepartmentAccountsCalendarList', () => {
  describe('@render', () => {
    beforeEach(() => {
      fetchMock.get('glob:*/api/placement/department/*/calendar*', {
        body: {
          status: 'success',
          data: [
            {
              id: 1,
              statusId: 1,
              inceptionDate: '2021-04-01',
              departmentId: 1,
              newRenewalBusinessId: 1,
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
            },
          ],
        },
      });
    });

    afterEach(() => {
      fetchMock.restore();
    });

    const monthDetails = utils.date.today();
    const defaultProps = {
      rows: [],
      sort: {},
      pagination: {},
      monthDetails: monthDetails,
      handlers: {
        handleChangePage: () => {},
        handleChangeRowsPerPage: () => {},
        handleClickRow: () => {},
      },
    };

    it('renders the list items', async () => {
      // arrange
      const props = {
        ...defaultProps,
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

      const { getByTestId } = render(<DepartmentAccountsCalendarList {...props} />, { initialState });

      await waitForElementToBeRemoved(() => getByTestId('department-accounts-list-loading'));

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

      // assert
      expect(getByTestId('summary-placement-1')).toBeInTheDocument();
    });
  });
});
