import React from 'react';

import { render, getFormSelect, getFormNumber, getFormCheckbox, getFormText, getFormDatepicker, getFormTextarea } from 'tests';
import BulkUpdateLayer from './BulkUpdateLayer';

describe('FORMS › BulkUpdateLayer', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<BulkUpdateLayer {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<BulkUpdateLayer {...props} />);

      // assert
      expect(getByTestId('form-bulk-update-layer')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<BulkUpdateLayer {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs for bulk layer', () => {
      // arrange
      const initialState = {
        placement: {
          bulkItems: {
            layers: [],
            layerMarkets: [],
          },
        },
      };
      const { container, getByLabelText } = render(<BulkUpdateLayer {...props} />, { initialState });

      // assert
      expect(getByLabelText('placement.form.delete.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('delete'))).toBeInTheDocument();

      expect(getByLabelText('form.deleteConfirm.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('deleteConfirm'))).toBeInTheDocument();
    });

    it('renders the form inputs for bulk market', () => {
      // arrange
      const initialState = {
        placement: {
          bulkItems: {
            layers: [],
            layerMarkets: [],
          },
        },
      };
      const { container, getByText, getByLabelText } = render(<BulkUpdateLayer {...props} />, { initialState });

      // assert
      expect(getByText('placement.marketing.fields.status', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('statusId'))).toBeInTheDocument();

      expect(getByText('placement.form.currency.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('isoCode'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.section.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('section'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.premium.label')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('premium'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.written.label')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('written'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.quoteReceived.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('quoteDate'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.quoteExpiry.label')).toBeInTheDocument();
      expect(container.querySelector(getFormDatepicker('validUntilDate'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.subjectivities.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('subjectivities'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.delete.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('delete'))).toBeInTheDocument();

      expect(getByLabelText('form.deleteConfirm.label')).toBeInTheDocument();
      expect(container.querySelector(getFormText('deleteConfirm'))).toBeInTheDocument();
    });
  });
});
