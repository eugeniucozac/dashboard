import React from 'react';
import { render, getFormText, getFormTextarea } from 'tests';
import EditReportGroup from './EditReportGroup';

describe('FORMS › EditReportGroup', () => {
  const props = {
    report: {
      title: 'February BOX Analysis',
      description: 'The quick brown fox jumps over the lazy dog !!!',
      powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
    },
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditReportGroup {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });
    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<EditReportGroup {...props} />);

      // assert
      expect(getByTestId('form-edit-reportGroup')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<EditReportGroup {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });
    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<EditReportGroup {...props} />);

      // assert
      expect(getByLabelText('reporting.form.reportName.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('report'))).toBeInTheDocument();

      expect(getByLabelText('reporting.form.powerbiReportId')).toBeInTheDocument();
      expect(container.querySelector(getFormText('powerbiReportId'))).toBeInTheDocument();

      expect(getByLabelText('reporting.form.description')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
    });
  });
});
