import React from 'react';
import { render, waitFor, fireEvent } from 'tests';
import ProductsAdminClients from './ProductsAdminClients';
import * as uiActions from 'stores/ui/ui.actions';
import fetchMock from 'fetch-mock';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    showModal: jest.fn(),
  };
});

describe('MODULES › ProductsAdminClients', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/client*', {
      body: {
        content: [{ id: 1, name: 'Client Name 1' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ProductsAdminClients />);
    });

    it('renders clients table', async () => {
      // arrange
      const { getByText, getAllByText } = render(<ProductsAdminClients />);

      // assert
      await waitFor(() => getAllByText('products.admin.clients.tableCols.name')[0]);
      expect(getByText('products.admin.clients.tableCols.name')).toBeInTheDocument();
      expect(getByText('Client Name 1')).toBeInTheDocument();
    });

    it('renders add clients button', async () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminClients />);

      // assert
      expect(getByTestId('clients-create-button')).toBeInTheDocument();
    });

    it('renders pagination component', () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminClients />);

      // assert
      expect(getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('renders the "Add Client" modal when click on button', async () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminClients />);
      const spyShowModal = jest.spyOn(uiActions, 'showModal').mockReturnValue({ type: 'FOO' });

      // act
      fireEvent.click(getByTestId('clients-create-button'));

      // assert
      expect(spyShowModal).toHaveBeenCalledTimes(1);
      spyShowModal.mockRestore();
    });
  });
});
