import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import ReportingGroup from './Reporting';
import { ReportingView } from './Reporting.view';

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
        selectedGroup: '',
      },
      report: {},
    };

    it('renders without crashing', () => {
      // arrange
      render(<ReportingGroup />);
    });
    it('renders the list of report groups', () => {
      // arrange
      const { getByTestId, getAllByText } = render(<ReportingGroup />, { initialState });

      // assert
      expect(getAllByText('reporting.title')).toHaveLength(1);

      expect(getByTestId('reporting')).toBeInTheDocument();
      expect(getByTestId('page-header-reporting_header-icon')).toBeInTheDocument();
    });
  });
});

describe('PAGES › ReportingView', () => {
  describe('@render', () => {
    const props = {
      list: [
        {
          id: 1,
          count: 4,
          description: 'The quick brown fox jumps over the lazy dog!!',
          name: 'Hiscox',
        },
        {
          id: 2,
          count: 3,
          description: 'The quick brown fox jumps over the lazy dog!!!',
          name: 'Price Forbes Brokers',
        },
        {
          id: 3,
          count: 5,
          description: 'The quick brown fox jumps over the lazy dog!!!!',
          name: 'BAS',
        },
      ],

      sort: {},

      handleClickRow: jest.fn(),
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      pagination: {
        page: 1,
        pageSize: 5,
        itemsTotal: 3,
      },
      handleChangePage: jest.fn(),
      handleChangeRowsPerPage: jest.fn(),
      isReportAdmin: true,
    };

    it('should render table', () => {
      // arrange
      const { getByText, queryAllByTestId } = render(<ReportingView {...props} />);

      // assert
      expect(getByText('app.reportingGroup')).toBeInTheDocument();
      expect(getByText('Hiscox')).toBeInTheDocument();
      expect(getByText('The quick brown fox jumps over the lazy dog!!')).toBeInTheDocument();
      expect(getByText('4')).toBeInTheDocument();
      expect(queryAllByTestId('reporting-isReportAdmin')[0].querySelector('svg')).toBeInTheDocument();
    });
  });
});
