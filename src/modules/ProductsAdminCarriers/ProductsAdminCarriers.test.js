import React from 'react';
import { render, waitFor, fireEvent } from 'tests';
import ProductsAdminCarriers from './ProductsAdminCarriers';
import * as uiActions from 'stores/ui/ui.actions';
import fetchMock from 'fetch-mock';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    showModal: jest.fn(),
  };
});

describe('MODULES › ProductsAdminCarriers', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/carriers*', {
      body: {
        content: [{ id: 1, name: 'Carrier Name 1' }],
      },
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ProductsAdminCarriers />);
    });

    it('renders carriers table', async () => {
      // arrange
      const { getByText, getAllByText } = render(<ProductsAdminCarriers />);

      // assert
      await waitFor(() => getAllByText('products.admin.carriers.tableCols.name')[0]);
      expect(getByText('products.admin.carriers.tableCols.name')).toBeInTheDocument();
      expect(getByText('Carrier Name 1')).toBeInTheDocument();
    });

    it('renders add carriers button', async () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminCarriers />);

      // assert
      expect(getByTestId('carriers-create-button')).toBeInTheDocument();
    });

    it('renders pagination component', () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminCarriers />);

      // assert
      expect(getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('@actions', () => {
    it('renders the "Add Carrier" modal when click on button', async () => {
      // arrange
      const { getByTestId } = render(<ProductsAdminCarriers />);
      const spyShowModal = jest.spyOn(uiActions, 'showModal').mockReturnValue({ type: 'FOO' });

      // act
      fireEvent.click(getByTestId('carriers-create-button'));

      // assert
      expect(spyShowModal).toHaveBeenCalledTimes(1);
      spyShowModal.mockRestore();
    });
  });
});
