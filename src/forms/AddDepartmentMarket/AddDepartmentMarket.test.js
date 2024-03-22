import React from 'react';
import { render, getFormAutocomplete, getFormHidden, getFormSelect, getFormText } from 'tests';
import AddDepartmentMarket from './AddDepartmentMarket';

describe('FORMS › AddDepartmentMarket', () => {
  const props = {
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddDepartmentMarket {...props} />);

      // assert
      expect(getByTestId('form-addDepartmentMarket')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddDepartmentMarket {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByText } = render(<AddDepartmentMarket {...props} />);

      // assert
      expect(container.querySelector(getFormHidden('departmentId'))).toBeInTheDocument();

      expect(getByText('market.fields.market', { selector: 'label' })).toBeInTheDocument();
      expect(container.querySelector(getFormAutocomplete('markets'))).toBeInTheDocument();

      expect(getByText('market.fields.capacityType', { selector: 'label' })).toBeInTheDocument();
      expect(getByText('market.fields.capacityTypeHint')).toBeInTheDocument();
      expect(container.querySelector(getFormSelect('capacityTypeId'))).toBeInTheDocument();

      expect(getByText('market.fields.firstName')).toBeInTheDocument();
      expect(container.querySelector(getFormText('underwriters[0].firstName'))).toBeInTheDocument();

      expect(getByText('market.fields.lastName')).toBeInTheDocument();
      expect(container.querySelector(getFormText('underwriters[0].lastName'))).toBeInTheDocument();

      expect(getByText('market.fields.email')).toBeInTheDocument();
      expect(container.querySelector(getFormText('underwriters[0].emailId'))).toBeInTheDocument();
    });

    it('renders the expand underwriters button', () => {
      // arrange
      const { getByText } = render(<AddDepartmentMarket {...props} />);

      // assert
      expect(getByText('market.addUnderwriters')).toBeInTheDocument();
    });
  });
});
