import React from 'react';
import { render, waitFor, fireEvent, screen } from 'tests';
import ProductsAdminInsureds from './ProductsAdminInsureds';
import * as uiActions from 'stores/ui/ui.actions';
import fetchMock from 'fetch-mock';

jest.mock('stores/ui/ui.actions', () => {
  return {
    __esModule: true,
    ...jest.requireActual('stores/ui/ui.actions'),
    showModal: jest.fn(),
  };
});

describe('MODULES › ProductsAdminInsureds', () => {
  beforeEach(() => {
    fetchMock.get('glob:*/api/v1/insured*', { body: { content: [{ id: 1, name: 'Insured Name 1' }] } });
    fetchMock.get('glob:*/api/v1/reinsured*', { body: { content: [{ id: 1, name: 'ReInsured Name 1' }] } });
    fetchMock.get('glob:*/api/v1/clients*', { body: { content: [{ id: 1, name: 'Client Name 1' }] } });
    fetchMock.get('glob:*/api/v1/facilities/countries', { body: [{ value: 'FR', label: 'France' }] });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<ProductsAdminInsureds />);
    });

    it('renders insureds table and add insured button, pagination', async () => {
      // arrange
      render(<ProductsAdminInsureds />);
      const spyShowModal = jest.spyOn(uiActions, 'showModal').mockReturnValue({ type: 'FOO' });

      // assert
      await waitFor(() => screen.getAllByText('products.admin.insureds.tableCols.name')[0]);
      expect(screen.getByText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(screen.getByText('Insured Name 1')).toBeInTheDocument();
      expect(screen.getByTestId('insureds-create-button')).toBeInTheDocument();

      screen.getByRole('button', { name: /products.admin.insureds.add/i });

      expect(screen.getByTestId('pagination')).toBeInTheDocument();

      // act
      fireEvent.click(screen.getByRole('button', { name: /products.admin.insureds.add/i }));
      // assert
      expect(spyShowModal).toHaveBeenCalledTimes(1);
      spyShowModal.mockRestore();
    });

    it('renders (Re)Insureds table and add (re)insured button', async () => {
      // arrange
      render(<ProductsAdminInsureds reInsured />);
      const spyShowModal = jest.spyOn(uiActions, 'showModal').mockReturnValue({ type: 'FOO' });

      // assert
      await waitFor(() => screen.getAllByText('products.admin.insureds.tableCols.name')[0]);
      expect(screen.getByText('products.admin.insureds.tableCols.name')).toBeInTheDocument();
      expect(screen.getByText('ReInsured Name 1')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /products.admin.reInsureds.add/i })).toBeInTheDocument();

      // act
      fireEvent.click(screen.getByRole('button', { name: /products.admin.reInsureds.add/i }));

      // assert
      expect(spyShowModal).toHaveBeenCalledTimes(1);
      spyShowModal.mockRestore();
    });
  });
});
