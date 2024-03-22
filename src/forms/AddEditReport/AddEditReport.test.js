import React from 'react';
import { render, getFormText, getFormTextarea } from 'tests';
import AddEditReport from './AddEditReport';

describe('FORMS › AddEditReport', () => {
  const props = {
    handleClose: () => {},
    report: { name: 'ABC', description: 'The quick brown fox jumps over the lazy dog' },
    isEditReportGroup: true,
  };
  const propsAdd = {
    handleClose: () => {},
    report: { name: 'ABC', description: 'The quick brown fox jumps over the lazy dog' },
    isEditReportGroup: false,
  };

  describe('@render', () => {
    it('renders without crashing for add', () => {
      // arrange
      const { container } = render(<AddEditReport {...propsAdd} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders without crashing for edit', () => {
      // arrange
      const { container } = render(<AddEditReport {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form for add', () => {
      // arrange
      const { getByTestId } = render(<AddEditReport {...propsAdd} />);

      // assert
      expect(getByTestId('form-add-edit-report')).toBeInTheDocument();
    });

    it('renders the form for edit', () => {
      // arrange
      const { getByTestId } = render(<AddEditReport {...props} />);

      // assert
      expect(getByTestId('form-add-edit-report')).toBeInTheDocument();
    });

    it('renders the form buttons for add', () => {
      // arrange
      const { queryByText } = render(<AddEditReport {...propsAdd} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form buttons for Edit', () => {
      // arrange
      const { queryByText } = render(<AddEditReport {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs for add', () => {
      // arrange
      const { container, getByLabelText } = render(<AddEditReport {...propsAdd} />);

      // assert
      expect(getByLabelText('reporting.form.reportGroupName.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('reporting.form.description')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
    });
    it('renders the form inputs for edit', () => {
      // arrange
      const { container, getByLabelText } = render(<AddEditReport {...props} />);

      // assert
      expect(getByLabelText('reporting.form.reportGroupName.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('reporting.form.description')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('description'))).toBeInTheDocument();
    });
  });
});
