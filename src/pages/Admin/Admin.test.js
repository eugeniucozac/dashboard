import React from 'react';

// app
import { render, waitFor } from 'tests';
import Admin from './Admin';

describe('PAGES › Admin', () => {
  const initialState = {
    admin: {
      userList: {
        items: [
          { id: 1, fullName: 'Foo', emailId: 'foo@test.com', departmentIds: [1, 2], offices: [], role: 'BROKER', isAdmin: true },
          {
            id: 2,
            fullName: 'Bar',
            emailId: 'bar@test.com',
            departmentIds: [3],
            offices: [
              { id: 1, name: 'Office 1' },
              { id: 2, name: 'Office 2' },
            ],
            role: 'COBROKER',
            isAdmin: false,
          },
        ],
      },
    },
    user: {
      departmentIds: [1, 2, 3],
    },
    referenceData: {
      departments: [
        { id: 1, name: 'Department 1' },
        { id: 2, name: 'Department 2' },
        { id: 3, name: 'Department 3' },
      ],
    },
  };

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Admin />);

      // assert
      await waitFor(() => expect(document.title).toContain('admin.title'));
    });

    it('renders correct icon and title', () => {
      // arrange
      const { getAllByText, getByTestId } = render(<Admin />);

      // assert
      expect(getAllByText('admin.title')).toHaveLength(2);
      expect(getByTestId('page-header-admin-icon')).toBeInTheDocument();
    });

    it('renders the list of users', () => {
      // arrange
      const { getByText, queryAllByTestId, getAllByText } = render(<Admin />, { initialState });

      // assert
      expect(getByText('admin.fullName')).toBeInTheDocument();
      expect(getByText('admin.emailAddress')).toBeInTheDocument();
      expect(getByText('admin.department_plural')).toBeInTheDocument();
      expect(getAllByText('admin.office_plural')).toHaveLength(2);
      expect(getByText('admin.role')).toBeInTheDocument();
      expect(getAllByText('admin.title')).toHaveLength(2);

      expect(getByText('Foo')).toBeInTheDocument();
      expect(getByText('foo@test.com')).toBeInTheDocument();
      expect(getByText('Department 1, Department 2')).toBeInTheDocument();
      expect(getByText('app.broker')).toBeInTheDocument();
      expect(queryAllByTestId('user-isAdmin')[0].querySelector('svg')).toBeInTheDocument();

      expect(getByText('Bar')).toBeInTheDocument();
      expect(getByText('bar@test.com')).toBeInTheDocument();
      expect(getByText('Department 3')).toBeInTheDocument();
      expect(getByText('Office 1, Office 2')).toBeInTheDocument();
      expect(getByText('app.cobroker')).toBeInTheDocument();
      expect(queryAllByTestId('user-isAdmin')[1].querySelector('svg')).not.toBeInTheDocument();
    });
  });
});
