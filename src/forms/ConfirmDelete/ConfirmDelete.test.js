import React from 'react';
import { render, getFormText } from 'tests';
import ConfirmDelete from './ConfirmDelete';

describe('FORMS › ConfirmDelete', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<ConfirmDelete {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<ConfirmDelete {...props} />);

      // assert
      expect(getByTestId('form-confirmDelete')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<ConfirmDelete {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<ConfirmDelete {...props} />);

      // assert
      expect(getByLabelText('form.deleteConfirm.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('deleteConfirm'))).toBeInTheDocument();
    });
  });
});
