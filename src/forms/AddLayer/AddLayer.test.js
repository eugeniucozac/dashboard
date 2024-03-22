import React from 'react';
import { render, getFormNumber, getFormSelect, getFormAutocomplete, getFormCheckbox } from 'tests';
import AddLayer from './AddLayer';

describe('FORMS › AddLayer', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddLayer {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddLayer {...props} />);

      // assert
      expect(getByTestId('form-addLayer')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddLayer {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const initialState = {
        referenceData: {
          businessTypes: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        },
      };
      const { container, getByText, getByLabelText } = render(<AddLayer {...props} />, { initialState });

      // assert
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
