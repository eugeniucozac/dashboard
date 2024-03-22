import React from 'react';
import AddProductsCarrier from './AddProductsCarrier';
import { render, getFormText } from 'tests';

describe('FORMS › AddProductsCarrier', () => {
  const fields = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      defaultValue: '',
      label: 'products.admin.carriers.tableCols.name',
    },
  ];

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const { container } = render(<AddProductsCarrier />);

      // assert
      expect(container).toBeInTheDocument();
    });

    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<AddProductsCarrier fields={fields} />);

      // assert
      expect(getByTestId('form-add-products-carrier')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<AddProductsCarrier fields={fields} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('products.admin.carriers.create')).toBeInTheDocument();
    });

    it('renders the form inputs', () => {
      // arrange
      const { container, getByLabelText } = render(<AddProductsCarrier fields={fields} />);

      // assert
      expect(getByLabelText('products.admin.carriers.tableCols.name')).toBeInTheDocument();
      expect(container.querySelector(getFormText('name'))).toBeInTheDocument();
    });
  });
});
