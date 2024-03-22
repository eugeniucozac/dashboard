import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import ReportGroupSearchUsers from './ReportGroupSearchUsers';
import { ReportGroupSearchUsersView } from './ReportGroupSearchUsers.view';

describe('PAGES › ReportGroupSearchUsers', () => {
  describe('@render', () => {
    const props = {
      searchVal: 'a',
      groupId: '1',
    };
    it('renders without crashing', () => {
      // arrange
      render(<ReportGroupSearchUsers {...props} />);
    });
  });
});

describe('PAGES › ReportGroupSearchUsersView', () => {
  describe('@render', () => {
    const props = {
      userList: [
        {
          id: 1122,
          firstName: 'Anindita',
          middleName: null,
          lastName: 'De',
          fullName: 'Anindita De',
          emailId: 'anindita.de@ardonaghspecialty.com',
          isSystemUser: true,
          password: null,
          role: 'BROKER',
          contactPhone: '',
          sourceSystemId: 4,
          offices: [],
          departmentIds: [21, 1, 2, 3, 4, 5],
          isAdmin: true,
          programmesUserId: null,
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          enabled: true,
          broker: true,
          cobroker: false,
          username: 'anindita.de@ardonaghspecialty.com',
          isReportAdmin: true,
          reportgroupId: 2,
          hasAccess: false,
        },
        {
          id: 968,
          firstName: 'Anthony',
          middleName: null,
          lastName: 'Spice',
          fullName: 'Anthony Spice',
          emailId: 'anthonyspice@priceforbes.com',
          isSystemUser: true,
          password: null,
          role: 'BROKER',
          contactPhone: null,
          sourceSystemId: 4,
          offices: [],
          departmentIds: [21],
          isAdmin: false,
          programmesUserId: '6061a027e55e76097c139eba',
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          enabled: true,
          broker: true,
          cobroker: false,
          username: 'anthonyspice@priceforbes.com',
          isReportAdmin: true,
          reportgroupId: 2,
          hasAccess: false,
        },
      ],
      handleAddUser: jest.fn(),
    };

    it('should render table', () => {
      // arrange
      const { getByText, queryAllByTestId } = render(<ReportGroupSearchUsersView {...props} />);

      // assert
      expect(getByText('admin.fullName')).toBeInTheDocument();
      expect(getByText('admin.emailAddress')).toBeInTheDocument();
      expect(getByText('app.addUser')).toBeInTheDocument();
      expect(getByText('Anindita De')).toBeInTheDocument();
      expect(getByText('anthonyspice@priceforbes.com')).toBeInTheDocument();
      expect(queryAllByTestId('user-hasAccess')[0].querySelector('svg')).toBeInTheDocument();
    });
  });
});
