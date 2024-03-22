import React from 'react';
import { render, getFormText, getFormHidden } from 'tests';
import EditDepartmentMarket from './EditDepartmentMarket';
import { getFormSelect } from '../../tests';

describe('FORMS › EditDepartmentMarket', () => {
  const props = {
    market: {
      id: 10,
      departmentId: 1,
      capacityTypeId: 33,
      market: { id: 1000, edgeName: 'Foo Bar Market' },
      underwriters: [
        { id: 20, firstName: 'John', lastName: 'Johnson', emailId: 'jj@aaa.com' },
        { id: 21, firstName: 'Steve', lastName: 'Stevenson', emailId: '' },
        { id: 22, firstName: 'Mark', lastName: '', emailId: '' },
      ],
    },
    deptId: 1,
    handleClose: () => {},
  };

  describe('@render', () => {
    it('renders the form', () => {
      // arrange
      const { getByTestId } = render(<EditDepartmentMarket {...props} />);

      // assert
      expect(getByTestId('form-editDepartmentMarket')).toBeInTheDocument();
    });

    it('renders the form buttons', () => {
      // arrange
      const { queryByText } = render(<EditDepartmentMarket {...props} />);

      // assert
      expect(queryByText('app.cancel')).toBeInTheDocument();
      expect(queryByText('app.submit')).toBeInTheDocument();
    });

    describe('market', () => {
      it('renders the form inputs', () => {
        // arrange
        const { container, getByText } = render(<EditDepartmentMarket {...props} />);

        // assert
        expect(container.querySelector(getFormHidden('departmentId'))).toBeInTheDocument();
        expect(container.querySelector(getFormHidden('departmentId'))).toHaveValue('1');

        expect(container.querySelector(getFormHidden('departmentMarketId'))).toBeInTheDocument();
        expect(container.querySelector(getFormHidden('departmentMarketId'))).toHaveValue('10');

        expect(container.querySelector(getFormHidden('marketId'))).toBeInTheDocument();
        expect(container.querySelector(getFormHidden('marketId'))).toHaveValue('1000');

        expect(container.querySelector(getFormHidden('previousUnderwriters'))).toBeInTheDocument();

        expect(getByText('market.cols.name', { selector: 'label' })).toBeInTheDocument();
        expect(container.querySelector(getFormText('market'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('market'))).toHaveValue('Foo Bar Market');

        expect(getByText('market.fields.capacityType', { selector: 'label' })).toBeInTheDocument();
        expect(container.querySelector(getFormSelect('capacityTypeId'))).toBeInTheDocument();

        expect(getByText('market.fields.firstName')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[0].firstName'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[0].firstName'))).toHaveValue('John');

        expect(getByText('market.fields.lastName')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[0].lastName'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[0].lastName'))).toHaveValue('Johnson');

        expect(getByText('market.fields.email')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[0].emailId'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[0].emailId'))).toHaveValue('jj@aaa.com');

        expect(getByText('market.fields.firstName')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[1].firstName'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[1].firstName'))).toHaveValue('Steve');

        expect(getByText('market.fields.lastName')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[1].lastName'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[1].lastName'))).toHaveValue('Stevenson');

        expect(getByText('market.fields.email')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[1].emailId'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[1].emailId'))).toHaveValue('');

        expect(getByText('market.fields.firstName')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[2].firstName'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[2].firstName'))).toHaveValue('Mark');

        expect(getByText('market.fields.lastName')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[2].lastName'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[2].lastName'))).toHaveValue('');

        expect(getByText('market.fields.email')).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[2].emailId'))).toBeInTheDocument();
        expect(container.querySelector(getFormText('underwriters[2].emailId'))).toHaveValue('');
      });
    });
  });
});
