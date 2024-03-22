import React from 'react';

// app
import { render } from 'tests';
import ReportsExtendedAddEdit from './ReportsExtendedAddEdit';

describe('FORMS › ReportsExtendedAddEdit', () => {
  const props = {
    report: {
      description: 'This is a dummy report for PP or Claims!',
      powerbiReportId: 'f6bfd646-b718-44dc-a378-b73e6b528204',
      reportgroupId: '38',
      title: 'Dummy Report title',
    },
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ReportsExtendedAddEdit {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<ReportsExtendedAddEdit {...props} />);

      // assert
      expect(getByTestId('form-add-report')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<ReportsExtendedAddEdit {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });
  });
});
