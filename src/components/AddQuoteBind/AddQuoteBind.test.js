import React from 'react';

// app
import AddQuoteBind from './AddQuoteBind';
import { render, screen, openMuiSelect, waitFor } from 'tests';
import userEvent from '@testing-library/user-event';

describe('COMPONENTS › AddQuoteBind', () => {
  const products = [
    {
      label: 'Product Error',
      value: 'PRODUCT_ERROR',
      status: 'ERROR',
      message: 'ERROR message',
    },
    {
      label: 'Product Warning',
      value: 'PRODUCT_WARN',
      status: 'WARN',
      message: 'WARNING message',
    },
    {
      label: 'Product OK',
      value: 'PRODUCT_OK',
      status: 'OK',
    },
  ];

  it('renders without crashing', async () => {
    render(<AddQuoteBind products={products} />);
    const product = screen.getByRole('button', { name: /select product/i });
    const addRiskButton = screen.getByTestId('risk-add-button');

    expect(screen.getByRole('button', { name: /select product/i })).toBeInTheDocument();
    expect(addRiskButton).toBeDisabled();

    // assert
    expect(product).toBeInTheDocument();
    await openMuiSelect(product);

    expect(screen.getByRole('option', { name: /Product Error/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Product Warning/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Product OK/i })).toBeInTheDocument();

    userEvent.click(screen.queryByText('Product Error'));
    expect(addRiskButton).toBeDisabled();
  });

  it('Add Risk button is disabled if selected product status=ERROR', async () => {
    render(<AddQuoteBind products={products} />);
    const product = screen.getByRole('button', { name: /select product/i });

    // assert
    expect(product).toBeInTheDocument();
    await openMuiSelect(product);

    userEvent.click(screen.queryByText('Product Error'));
    expect(screen.getByTestId('risk-add-button')).toBeDisabled();
    expect(screen.getByRole('button', { name: /Product Error/i })).toBeInTheDocument();
  });

  it('Add Risk button is enabled if selected product status=WARN', async () => {
    render(<AddQuoteBind products={products} />);
    const product = screen.getByRole('button', { name: /select product/i });

    // assert
    expect(product).toBeInTheDocument();
    await openMuiSelect(product);

    userEvent.click(screen.queryByText('Product Warning'));
    await waitFor(() => expect(screen.getByTestId('risk-add-button')).toBeEnabled());
    expect(screen.getByRole('button', { name: /Product Warning/i })).toBeInTheDocument();
  });

  it('Add Risk button is enabled if selected product status=OK', async () => {
    render(<AddQuoteBind products={products} />);
    const product = screen.getByRole('button', { name: /select product/i });

    // assert
    expect(product).toBeInTheDocument();
    await openMuiSelect(product);

    userEvent.click(screen.queryByText('Product OK'));
    expect(screen.getByRole('button', { name: /Product OK/i })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('risk-add-button')).toBeEnabled());
  });
});
