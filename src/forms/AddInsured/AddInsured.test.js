import React from 'react';
import AddInsured from './AddInsured';
import { render, getFormText, getFormAutocompleteMui, getFormHidden, fireEvent } from 'tests';

describe('FORMS › AddInsured', () => {
  describe('@render', () => {
    it('renders the form, buttons and inputs', () => {
      // arrange
      const { container, queryByText, getByTestId, getByLabelText } = render(<AddInsured />);

      // assert
      // form
      expect(getByTestId('form-add-insured')).toBeInTheDocument();

      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();

      // inputs
      expect(getByLabelText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.partyType')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.street')).toBeInTheDocument();
      expect(container.querySelector(getFormText('street'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.city')).toBeInTheDocument();
      expect(container.querySelector(getFormText('city'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.zipCode')).toBeInTheDocument();
      expect(container.querySelector(getFormText('zipCode'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.county')).toBeInTheDocument();
      expect(container.querySelector(getFormText('county'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.state')).toBeInTheDocument();
      expect(container.querySelector(getFormText('state'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.country')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('country'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('distanceToCoast'))).toBeInTheDocument();
    });

    it('renders the form Gender and DOB if individual is selected', () => {
      // arrange
      const { container, queryByText, getByTestId, getByLabelText, getByRole } = render(<AddInsured />);
      const partType = container.querySelector(getFormAutocompleteMui('partyType'));

      fireEvent.mouseDown(partType);
      const option = queryByText('products.admin.insureds.typeOptions.individual');
      expect(option).toBeInTheDocument();

      fireEvent.click(option);

      expect(partType).toHaveProperty('value', 'products.admin.insureds.typeOptions.individual');

      // assert
      // form
      expect(getByTestId('form-add-insured')).toBeInTheDocument();

      // buttons
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();

      // inputs
      expect(getByLabelText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.partyType')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('partyType'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.gender')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('genderType'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.dateOfBirth')).toBeInTheDocument();
      expect(getByRole('textbox', { name: /products\.admin\.insureds\.dateofbirth/i })).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.street')).toBeInTheDocument();
      expect(container.querySelector(getFormText('street'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.city')).toBeInTheDocument();
      expect(container.querySelector(getFormText('city'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.zipCode')).toBeInTheDocument();
      expect(container.querySelector(getFormText('zipCode'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.county')).toBeInTheDocument();
      expect(container.querySelector(getFormText('county'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.state')).toBeInTheDocument();
      expect(container.querySelector(getFormText('state'))).toBeInTheDocument();

      expect(getByLabelText('products.admin.insureds.tableCols.country')).toBeInTheDocument();
      expect(container.querySelector(getFormAutocompleteMui('country'))).toBeInTheDocument();

      expect(container.querySelector(getFormHidden('distanceToCoast'))).toBeInTheDocument();
    });
  });
});
