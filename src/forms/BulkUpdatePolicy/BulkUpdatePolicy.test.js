import React from 'react';
import { render, getFormSelect, getFormNumber, getFormCheckbox, getFormText } from 'tests';
import BulkUpdatePolicy from './BulkUpdatePolicy';

describe('FORMS › BulkUpdatePolicy', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<BulkUpdatePolicy {...props} />);

      // assert
      expect(getByTestId('form-bulk-update-policy')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<BulkUpdatePolicy {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs for bulk policy', () => {
      // arrange
      const initialState = {
        placement: {
          bulk: { type: 'policy', items: [] },
        },
      };
      const { container, getByLabelText } = render(<BulkUpdatePolicy {...props} />, { initialState });

      // assert
      expect(getByLabelText('placement.form.delete.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('delete'))).toBeInTheDocument();

      expect(getByLabelText('form.deleteConfirm.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('deleteConfirm'))).toBeInTheDocument();
    });

    it('renders the form inputs for bulk policy market', () => {
      // arrange
      const initialState = {
        placement: {
          bulk: { type: 'policyMarket', items: [] },
        },
      };
      const { container, getByText, getByLabelText } = render(<BulkUpdatePolicy {...props} />, { initialState });

      // assert
      expect(getByText('placement.form.status.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('status'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.premium.label')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('premium'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.delete.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('delete'))).toBeInTheDocument();

      expect(getByLabelText('form.deleteConfirm.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('deleteConfirm'))).toBeInTheDocument();
    });
  });
});
