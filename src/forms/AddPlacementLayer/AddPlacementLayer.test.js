import React from 'react';
import { render, getFormNumber, getFormSelect, getFormAutocomplete, getFormCheckbox } from 'tests';
import AddPlacementLayer from './AddPlacementLayer';

describe('FORMS › AddPlacementLayer', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders the form, buttons and inputs', () => {
      // arrange
      const initialState = {
        referenceData: {
          businessTypes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        },
      };
      const { container, getByTestId, queryByText, getByText, getByLabelText } = render(<AddPlacementLayer {...props} />, { initialState });

      // assert
      // container
      expect(getByTestId('form-add-placement-layer')).toBeInTheDocument();

      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();

      // input
      expect(getByText('placement.form.class.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('businessType'))).toBeInTheDocument();

      expect(getByText('placement.form.currency.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('currency'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.buydown.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('buydown'))).toBeInTheDocument();

      expect(getByLabelText('app.amount')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('amount'))).toBeInTheDocument();

      expect(getByLabelText('app.excess')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('excess'))).toBeInTheDocument();
    });
  });
});
