import React from 'react';
import EditProductsFacility from './EditProductsFacility';
import { render, getFormNumber, getFormAutocompleteMui, waitFor } from 'tests';
import fetchMock from 'fetch-mock';

describe('FORMS › EditProductsFacility', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/rates?facilityId=*', {
      body: {
        id: 1,
        facilityId: 100,
        commissionRate: 20,
        reinsuranceRate: 30,
        countryRates: {
          CA: 5,
          US: 6,
          DE: 7,
        },
      },
    });

    fetchMock.get('glob:*/api/v1/facilities/countries', {
      body: [
        {
          label: 'Canada',
          value: 'CA',
        },
        {
          label: 'United States',
          value: 'US',
        },
        {
          label: 'Germany',
          value: 'DE',
        },
      ],
    });

    fetchMock.get('glob:*/api/v1/users', {});
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    const facility = { id: 100, name: 'Facility 100', isRateField: true };

    it('renders without crashing', () => {
      // arrange
      const { container } = render(<EditProductsFacility />);

      // assert
      expect(container).toBeInTheDocument();
    });

    // it('renders the form', async () => {
    //   // arrange
    //   const { getByTestId, queryByTestId } = render(<EditProductsFacility facility={facility} />);
    //   // await waitFor(() => queryByTestId('form-edit-products-facility'));

    //   // assert
    //   expect(queryByTestId('form-edit-products-facility')).toBeInTheDocument();
    //   // expect(queryByTestId('form-edit-products-facility')).toBeInTheDocument();
    // });

    //     it('renders the form buttons', async () => {
    //       // arrange
    //       const { getByTestId, queryByText } = render(<EditProductsFacility facility={facility} />);
    //       await waitFor(() => getByTestId('form-edit-products-facility'));

    //       // assert
    //       expect(queryByText('app.cancel')).toBeInTheDocument();
    //       expect(queryByText('products.admin.facilities.update')).toBeInTheDocument();
    //     });

    //     it('renders the rates form inputs', async () => {
    //       // arrange
    //       const { container, getByText, getByTestId, getByLabelText } = render(<EditProductsFacility facility={facility} />);

    //       await waitFor(() => getByTestId('form-edit-products-facility'));

    //       // assert
    //       expect(getByLabelText('products.admin.facilities.commissionRate')).toBeInTheDocument();
    //       expect(container.querySelector(getFormNumber('commissionRate'))).toBeInTheDocument();

    //       expect(getByLabelText('products.admin.facilities.reinsuranceRate')).toBeInTheDocument();
    //       expect(container.querySelector(getFormNumber('reinsuranceRate'))).toBeInTheDocument();

    //       expect(getByText('app.country')).toBeInTheDocument();
    //       expect(container.querySelector(getFormAutocompleteMui('countries[0].code'))).toBeInTheDocument();

    //       expect(getByText('products.admin.facilities.countryRate')).toBeInTheDocument();
    //       expect(container.querySelector(getFormNumber('countries[0].rate'))).toBeInTheDocument();
    //     });
  });
});
