import React from 'react';

// app
import { render, getFormText, getFormTextarea } from 'tests';
import ReportGroupExtendedAddEdit from './ReportGroupExtendedAddEdit';

describe('FORMS › ReportGroupExtendedAddEdit', () => {
  const propsToCreateReportGroup = {
    handleClose: () => {},
    report: { name: 'Test Report Creation', description: 'This is a new report group description creation' },
    isEditReportGroup: false,
  };

  const propsToEditReportGroup = {
    handleClose: () => {},
    report: { name: 'Test Report Edit', description: 'This is a new report group description edit' },
    isEditReportGroup: true,
  };

  describe('@render', () => {
    it('renders without crashing for create report group', () => {
      // arrange
      const { container } = render(<ReportGroupExtendedAddEdit {...propsToCreateReportGroup} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders without crashing for edit report group', () => {
      // arrange
      const { container } = render(<ReportGroupExtendedAddEdit {...propsToEditReportGroup} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form for create report group', () => {
      // arrange
      const { getByTestId } = render(<ReportGroupExtendedAddEdit {...propsToCreateReportGroup} />);

      // assert
      expect(getByTestId('form-report-group-extended-add-edit')).toBeInTheDocument();
    });

    it('renders the form for edit report group', () => {
      // arrange
      const { getByTestId } = render(<ReportGroupExtendedAddEdit {...propsToEditReportGroup} />);

      // assert
      expect(getByTestId('form-report-group-extended-add-edit')).toBeInTheDocument();
    });

    it('renders the form buttons for create report group', () => {
      // arrange
      const { queryByText } = render(<ReportGroupExtendedAddEdit {...propsToCreateReportGroup} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form buttons for edit report group', () => {
      // arrange
      const { queryByText } = render(<ReportGroupExtendedAddEdit {...propsToEditReportGroup} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs for create report group', () => {
      // arrange
      const { container, getByLabelText } = render(<ReportGroupExtendedAddEdit {...propsToCreateReportGroup} />);

      // assert
      expect(getByLabelText('reportingExtended.reportingGroup.reportGroupName.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('reportingExtended.reportingGroup.description')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
    });

    it('renders the form inputs for edit report group', () => {
      // arrange
      const { container, getByLabelText } = render(<ReportGroupExtendedAddEdit {...propsToEditReportGroup} />);

      // assert
      expect(getByLabelText('reportingExtended.reportingGroup.reportGroupName.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('reportingExtended.reportingGroup.description')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
    });
  });
});
