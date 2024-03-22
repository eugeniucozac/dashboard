import React from 'react';
import { render, getFormSelect, getFormCheckbox, getFormNumber, getFormHidden, getFormTextarea } from 'tests';
import EditPlacementLayer from './EditPlacementLayer';

describe('FORMS › EditPlacementLayer', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditPlacementLayer {...props} />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<EditPlacementLayer {...props} />);

      // assert
      expect(getByTestId('form-edit-layer')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<EditPlacementLayer {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText, getByLabelText } = render(<EditPlacementLayer {...props} />);

      // assert
      expect(getByText('placement.form.status.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('status'))).toBeInTheDocument();

      expect(getByText('placement.form.currency.label', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('currency'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.buydown.label')).toBeInTheDocument();
      expect(container.querySelector(getFormCheckbox('buydown'))).toBeInTheDocument();

      expect(getByLabelText('app.amount')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('amount'))).toBeInTheDocument();

      expect(getByLabelText('app.excess')).toBeInTheDocument();
      expect(container.querySelector(getFormNumber('excess'))).toBeInTheDocument();

      expect(getByLabelText('placement.form.notes.label')).toBeInTheDocument();
      expect(container.querySelector(getFormTextarea('notes'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('layerId'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('departmentId'))).toBeInTheDocument();
      expect(container.querySelector(getFormHidden('businessTypeId'))).toBeInTheDocument();
    });
  });
});
