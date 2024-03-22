import React from 'react';

// app
import CommissionSlider from './CommissionSlider';
import { render, screen, fireEvent, waitFor } from 'tests';
import userEvent from '@testing-library/user-event';

const stateBroker = {
  user: {
    role: 'BROKER',
  },
};
const stateCoBroker = {
  user: {
    role: 'COBROKER',
  },
};

const handleChangedValues = jest.fn();

const initialProps = {
  defaultClientCommission: 20,
  defaultBrokerCommission: 7.5,
  netDownClientCommission: 19,
  commissionRatioClient: 19,
  handleChangedValues,
  isSliderDisabled: false,
};

describe('render CommissionSlider ', () => {
  it('renders CommissionSlider for BROKER', async () => {
    render(<CommissionSlider {...initialProps} />, { initialState: { ...stateBroker } });
    const ratioInput = screen.getByLabelText('commissionRatio-input-slider');
    const netDownInput = screen.getByLabelText('netDownClientCommission-input-slider');

    expect(screen.getByTestId('commission')).toBeInTheDocument();
    expect(screen.getByTestId('commission-title')).toBeInTheDocument();
    expect(screen.getByText(/products.commissionRatio/i)).toBeInTheDocument();
    // expect(screen.getByText(/products.clientLabel/i)).toBeInTheDocument();
    expect(screen.getByText(/products.brokerLabel/i)).toBeInTheDocument();
    expect(screen.getByText(/products.netdown/i)).toBeInTheDocument();
    expect(screen.getByTestId('netDownClientCommission-slider')).toBeInTheDocument();
    expect(ratioInput).toBeInTheDocument();
    expect(screen.getByTestId('netDownClientCommission-slider')).toBeInTheDocument();
    expect(screen.getByTestId('netDownClientCommission-input-slider')).toBeInTheDocument();
    expect(ratioInput).toHaveValue(19);
    expect(netDownInput).toHaveValue(19);

    fireEvent.change(ratioInput, { target: { value: '15' } });
    expect(ratioInput).toHaveValue(15);
    expect(handleChangedValues).toHaveBeenCalled();
    expect(netDownInput).toHaveValue(15);

    fireEvent.change(netDownInput, { target: { value: '10' } });
    expect(netDownInput).toHaveValue(10);
    expect(handleChangedValues).toHaveBeenCalled();

    fireEvent.change(ratioInput, { target: { value: '50' } });
    expect(ratioInput).toHaveValue(initialProps.defaultClientCommission);
    expect(netDownInput).toHaveValue(initialProps.defaultClientCommission);

    fireEvent.change(ratioInput, { target: { value: initialProps.defaultClientCommission } });
    expect(ratioInput).toHaveValue(initialProps.defaultClientCommission);
    expect(netDownInput).toHaveValue(initialProps.defaultClientCommission);
  });

  it('renders CommissionSlider for COBROKER', async () => {
    render(<CommissionSlider {...initialProps} />, { initialState: { ...stateCoBroker } });

    expect(screen.getByTestId('commission')).toBeInTheDocument();
    expect(screen.getByTestId('commission-title')).toBeInTheDocument();
    expect(screen.getByText(/products.netdown/i)).toBeInTheDocument();
    expect(screen.queryByText(/products.commissionRatio/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('netDownClientCommission-slider')).toBeInTheDocument();
    expect(screen.getByTestId('netDownClientCommission-input-slider')).toBeInTheDocument();
    expect(screen.queryByTestId('commissionRatio-slider')).not.toBeInTheDocument();
    expect(screen.queryByTestId('commissionRatio-input-slider')).not.toBeInTheDocument();
  });
});
