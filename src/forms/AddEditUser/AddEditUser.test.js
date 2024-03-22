import React from 'react';
import AddUser from './AddEditUser';
import { render, screen, getFormAutocomplete, getFormAutocompleteMui, getFormSwitch, getFormSelect, openMuiSelect, waitFor } from 'tests';
import userEvent from '@testing-library/user-event';
import fetchMock from 'fetch-mock';

const initialState = {
  referenceData: {
    departments: [
      {
        id: 1,
        name: 'Property & Casualty',
      },
    ],
  },
};
const offices = [
  {
    id: 1,
    logoFileName: 'rt-specialty.svg',
    name: 'R-T Specialty, LLC',
    offices: [{ id: 1, name: 'Kansas City' }],
  },
];

const products = [
  {
    label: 'Nasco / Medical - General',
    value: 'NASCO_GENERAL',
  },
  {
    label: 'EPIC - Terror Property',
    value: 'EPIC_TERROR_PROP',
  },
];

const clientsResponse = [
  {
    id: '5f845eedcc6d0f02b8eb1d92',
    name: 'Test Aviation FW Client',
  },

  {
    id: '5f3e7ad2d77a52662e7447a9',
    name: 'Test 7',
  },
];
const carriersResponse = [
  {
    id: '5f845eedcc6d0f02b8eb1d92',
    name: 'Test Aviation FW Carrier',
  },

  {
    id: '5f3e7ad2d77a52662e7447a9',
    name: 'Test Carrier 7',
  },
];

const userResponse = {
  id: '6061afe80519240f01504c95',
  fullName: 'qapfuser6 PF',
  emailId: 'qapfuser6@outlook.com',
  role: 'UNDERWRITER',
  products: ['NASCO_GENERAL'],
  clients: ['5f845eedcc6d0f02b8eb1d92', '5f3e7ad2d77a52662e7447a9'],
  admin: false,
  coverholder: false,
};
describe('FORMS › AddEditUser', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/client/parent/all/offices', { body: { status: 'success', data: offices } });
    fetchMock.get('glob:*/api/v1/products/edge', { body: { status: 'success', data: products } });
    fetchMock.get('glob:*/api/v1/clients/edge*', { body: clientsResponse });
    fetchMock.get('glob:*/api/v1/carriers/edge*', { body: carriersResponse });
    fetchMock.get('glob:*/api/v1/users/edge/*', { body: userResponse });
  });

  afterEach(() => {
    fetchMock.restore();
  });
  it('renders Create User form, buttons and inputs', async () => {
    // arrange
    const { container } = render(<AddUser />, { initialState });
    // assert
    // form
    await waitFor(() => screen.getByTestId('form-addUser'));
    expect(screen.getByTestId('form-addUser')).toBeInTheDocument();

    // buttons
    expect(screen.queryByText('app.cancel')).toBeInTheDocument();
    expect(screen.queryByText('app.create')).toBeInTheDocument();

    // inputs
    expect(screen.getByRole('textbox', { name: /admin.form.firstName.label/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /admin.form.lastName.label/i })).toBeInTheDocument();
    expect(screen.getByText('admin.form.departments.label', { selector: 'label' })).toBeInTheDocument();
    expect(container.querySelector(getFormAutocompleteMui('departments'))).toBeInTheDocument();
    expect(container.querySelector(getFormSelect('role'))).toBeInTheDocument();
    expect(container.querySelector(getFormSwitch('isAdmin'))).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /admin.form.email.label/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /admin.form.phone.label/i })).toBeInTheDocument();
  });

  it('renders different inputs when Role is changed', async () => {
    // arrange
    const { container } = render(<AddUser />, { initialState });
    await waitFor(() => screen.getByTestId('form-addUser'));
    const role = container.querySelector(getFormSelect('role'));
    // assert
    expect(role).toBeInTheDocument();
    await openMuiSelect(role);

    const option = screen.queryByText('app.broker');
    expect(screen.queryByText('app.broker')).toBeInTheDocument();
    expect(screen.queryByText('app.cobroker')).toBeInTheDocument();
    expect(screen.queryByText('app.underwriter')).toBeInTheDocument();
    userEvent.click(option);
    expect(role).toHaveProperty('value', 'BROKER');
    expect(container.querySelector(getFormAutocomplete('offices'))).not.toBeInTheDocument();
    expect(container.querySelector(getFormSwitch('isAdmin'))).toBeEnabled();

    await openMuiSelect(role);
    userEvent.click(screen.queryByText('app.cobroker'));
    expect(role).toHaveProperty('value', 'COBROKER');
    expect(container.querySelector(getFormSwitch('isAdmin'))).toBeDisabled();
    await waitFor(() => expect(container.querySelector(getFormAutocompleteMui('offices'))).toBeInTheDocument());

    await openMuiSelect(role);
    userEvent.click(screen.queryByText('app.underwriter'));
    expect(role).toHaveProperty('value', 'UNDERWRITER');
    expect(container.querySelector(getFormSwitch('isAdmin'))).toBeDisabled();
    await waitFor(() => {
      expect(container.querySelector(getFormAutocompleteMui('departments'))).not.toBeVisible();
      expect(container.querySelector(getFormAutocompleteMui('offices'))).not.toBeVisible();
    });
  });

  it('renders AddEditForm Add To Quote & Bind button when edit user', async () => {
    const user = {
      id: 1123,
      firstName: 'qapfuser6',
      middleName: null,
      lastName: 'PF',
      fullName: 'qapfuser6 PF',
      emailId: 'qapfuser6@outlook.com',
      isSystemUser: true,
      userName: null,
      password: null,
      role: 'UNDERWRITER',
      contactPhone: '02083367799',
      sourceSystemId: 4,
      offices: [],
      departmentIds: [1],
      isAdmin: false,
      programmesUserId: '',
    };
    render(<AddUser user={user} />, { initialState });
    await waitFor(() => screen.getByTestId('form-addUser'));
    expect(screen.getByRole('heading', { name: /admin.quoteBindTitle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /products.admin.addTo/i })).toBeInTheDocument();
  });

  it('renders AddEditForm Quote & Bind form when edit user with programmesUserId', async () => {
    const user = {
      id: 1123,
      firstName: 'qapfuser6',
      middleName: null,
      lastName: 'PF',
      fullName: 'qapfuser6 PF',
      emailId: 'qapfuser6@outlook.com',
      isSystemUser: true,
      userName: null,
      password: null,
      role: 'UNDERWRITER',
      contactPhone: '02083367799',
      sourceSystemId: 4,
      offices: [],
      departmentIds: [1],
      isAdmin: false,
      programmesUserId: '6061afe80519240f01504c95',
    };
    const { container } = render(<AddUser user={user} />, { initialState });

    await waitFor(() => screen.getByTestId('form-addUser'));
    expect(screen.getByRole('heading', { name: /admin.quoteBindTitle/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /products.admin.addTo/i })).not.toBeInTheDocument();
    expect(container.querySelector(getFormAutocompleteMui('clients'))).toBeInTheDocument();
    expect(container.querySelector(getFormAutocompleteMui('carriers'))).toBeInTheDocument();
    expect(container.querySelector(getFormAutocompleteMui('products'))).toBeInTheDocument();
    expect(container.querySelector(getFormSwitch('coverholder'))).toBeDisabled();
  });
});
