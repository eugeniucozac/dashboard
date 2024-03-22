import React from 'react';

// app
import { render } from 'tests';
import AdminUser from './AdminUser';

describe('MODULES › AdminUser', () => {
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
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AdminUser />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the table column headers', () => {
      // arrange
      const { getByText } = render(<AdminUser />, { initialState });

      // assert
      expect(getByText('admin.fullName')).toBeInTheDocument();
      expect(getByText('admin.emailAddress')).toBeInTheDocument();
      expect(getByText('admin.department_plural')).toBeInTheDocument();
      expect(getByText('admin.office_plural')).toBeInTheDocument();
      expect(getByText('admin.role')).toBeInTheDocument();
      expect(getByText('admin.title')).toBeInTheDocument();
    });

    it('renders the list of users', () => {
      // arrange
      const { getByText, queryAllByTestId } = render(<AdminUser />, { initialState });

      // assert
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
