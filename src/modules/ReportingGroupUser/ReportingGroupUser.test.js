import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import ReportingGroupUser from './ReportingGroupUser';
import { ReportingGroupUserView } from './ReportingGroupUser.view';

describe('PAGES › ReportingGroup', () => {
  describe('@render', () => {
    const initialState = {
      reportGroupList: {
        items: [],
        itemsTotal: 0,
        page: 1,
        pageSize: 10,
        pageTotal: 0,
        sortBy: 'lastUpdateDate',
        sortDirection: 'desc',
      },
      selected: null,
      reportList: {
        items: [],
        reportingGroupUser: [],
        selectedGroup: {},
      },
      report: {},
    };

    it('renders without crashing', () => {
      // arrange
      render(<ReportingGroupUser />);
    });
    it('renders reporting group layout', () => {
      // arrange
      const { getByTestId, getByText } = render(<ReportingGroupUser />, { initialState });

      // assert
      expect(getByTestId('filter-bar')).toBeInTheDocument();
      expect(getByTestId('user-list')).toBeInTheDocument();
    });
  });
});

describe('PAGES › ReportingGroupUserView', () => {
  describe('@render', () => {
    const props = {
      groupTitle: 'BAS',
      groupId: '1',
      list: [
        {
          id: 1108,
          firstName: 'Abcc',
          middleName: null,
          lastName: 'BBBBB',
          fullName: 'David L',
          emailId: 'qapfuser22@gmail.com',
          isSystemUser: true,
          password: null,
          role: 'BROKER',
          contactPhone: '123',
          sourceSystemId: 4,
          offices: [],
          departmentIds: [2, 4, 5],
          isAdmin: false,
          programmesUserId: '605dd96a2e7a6a45fc859ef2',
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          enabled: true,
          broker: true,
          cobroker: false,
          username: 'qapfuser22@gmail.com',
          isReportAdmin: true,
          reportgroupId: 1,
        },
        {
          id: 935,
          firstName: 'Alex',
          middleName: 'Dabell',
          lastName: 'Dabell',
          fullName: 'Alex Dabell',
          emailId: 'alexdabell@priceforbes.com',
          isSystemUser: true,
          password: null,
          role: 'BROKER',
          contactPhone: '',
          sourceSystemId: 4,
          offices: [],
          departmentIds: [21, 3, 2, 4, 5, 7, 8, 18, 19, 9, 11],
          isAdmin: true,
          programmesUserId: null,
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          enabled: true,
          broker: true,
          cobroker: false,
          username: 'alexdabell@priceforbes.com',
          isReportAdmin: true,
          reportgroupId: 1,
        },
      ],
      handleDelete: jest.fn(),
      fields: [],
      actions: [],
      popoverActions: [],
      searchVal: '',
      handlers: {
        handleBack: jest.fn(),
      },
      isBack: true,
    };

    it('should render table', () => {
      // arrange
      const { getByText, queryAllByTestId } = render(<ReportingGroupUserView {...props} />);

      // assert

      expect(getByText('David L')).toBeInTheDocument();
      expect(getByText('qapfuser22@gmail.com')).toBeInTheDocument();
      expect(getByText('Alex Dabell')).toBeInTheDocument();
      expect(getByText('alexdabell@priceforbes.com')).toBeInTheDocument();
      expect(queryAllByTestId('user-menu')[0].querySelector('svg')).toBeInTheDocument();
    });
  });
});
