import React from 'react';
import { render, getFormText, getFormTextarea } from 'tests';
import AddReportGroup from './AddReportGroup';

describe('FORMS › AddReportGroup', () => {
  const props = {
    report: {
      description: 'The quick brown fox jumps over the lazy dog!',
      powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
      reportgroupId: '38',
      title: 'March BOX Analysis',
    },
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddReportGroup {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddReportGroup {...props} />);

      // assert
      expect(getByTestId('form-add-reportGroup')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddReportGroup {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
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
          items: [
            {
              description: 'The quick brown fox jumps over the lazy dog!',
              powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
              reportgroupId: '36',
              title: 'February BOX Analysis',
            },
            {
              description: 'The quick brown fox jumps over the lazy dog!',
              powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
              reportgroupId: '37',
              title: 'January BOX Analysis',
            },
          ],
          reportingGroupUser: [],
          selectedGroup: {},
        },
        report: {},
      };
      const { container, getByLabelText } = render(<AddReportGroup {...props} />, { initialState });

      // assert
      expect(getByLabelText('reporting.form.reportName.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('report'))).toBeInTheDocument();

      expect(getByLabelText('reporting.form.reportId.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('reportId'))).toBeInTheDocument();

      expect(getByLabelText('reporting.form.description')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
    });
  });
});
