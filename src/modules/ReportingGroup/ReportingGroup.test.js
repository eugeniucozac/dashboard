import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import ReportingGroup from './ReportingGroup';
import { ReportingGroupView } from './ReportingGroup.view';

describe('PAGES › ReportingGroup', () => {
  describe('@render', () => {
    const initialState = {
      reportGroupList: {
        items: [],
        itemsTotal: 0,
        page: 1,
        pageSize: 10,
        pageTotal: 0,
        sortBy: 'name',
        sortDirection: 'asc',
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
      render(<ReportingGroup />);
    });
    it('renders reporting group layout', () => {
      // arrange
      const { getByTestId, getByText } = render(<ReportingGroup />, { initialState });

      // assert
      expect(getByText('reportingReport.title')).toBeInTheDocument();
      expect(getByText('reportingReport.description')).toBeInTheDocument();
      expect(getByTestId('reporting')).toBeInTheDocument();
    });
  });
});

describe('PAGES › ReportingGroupView', () => {
  describe('@render', () => {
    const props = {
      groupTitle: 'BAS',
      groupId: '1',
      list: [
        {
          description: 'The quick brown fox jumps over the lazy dog !!',
          id: 22,
          powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
          powerbiReportUrl:
            'https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlfX0%3d',
          reportgroupId: 35,
          title: 'February BOX Analysis',
        },
        {
          description: 'The quick brown fox jumps over the lazy dog',
          id: 27,
          powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
          powerbiReportUrl:
            'https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlfX0%3d',
          reportgroupId: 35,
          title: 'March BOX Analysis',
        },
        {
          description: 'f6bfd646-b718-44dc-a378-b73e6b528204',
          id: 25,
          powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
          powerbiReportUrl:
            'https://app.powerbi.com/reportEmbed?reportId=f6bfd646-b718-44dc-a378-b73e6b528204&groupId=be8908da-da25-452e-b220-163f52476cdd&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLU5PUlRILUNFTlRSQUwtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7Im1vZGVybkVtYmVkIjp0cnVlfX0%3d',
          reportgroupId: 35,
          title: 'Test',
        },
      ],

      breadcrumbs: [
        { active: false, label: 'Reporting', link: '/reporting', name: 'report-group' },
        { active: true, label: 'BAS', link: '/reporting/38', name: 'report' },
      ],
      handleClickRow: jest.fn(),
      handleAdd: jest.fn(),
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      isReportAdmin: true,
    };

    it('should render table', () => {
      // arrange
      const { getByText, queryAllByTestId } = render(<ReportingGroupView {...props} />);

      // assert

      expect(getByText('February BOX Analysis')).toBeInTheDocument();
      expect(getByText('The quick brown fox jumps over the lazy dog')).toBeInTheDocument();
      expect(queryAllByTestId('reporting-isReportAdmin')[0].querySelector('svg')).toBeInTheDocument();
    });
  });
});
