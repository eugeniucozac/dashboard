import React from 'react';
import { render } from 'tests';
import HorizontalLinearStepper from './HorizontalLinearStepper';

describe('COMPONENTS › HorizontalLinearStepper', () => {
  const props = {
    steps: [],
    stepContent: () => {},
    handleCancel: () => {},
    handleSave: () => {},
  };

  it('renders nothing if not passed all required props', () => {
    render(<HorizontalLinearStepper stepContent={() => {}} />);
  });

  it('renders when passing props', () => {
    render(<HorizontalLinearStepper {...props} />);
  });

  it('renders the component', () => {
    // arrange
    const { getByTestId } = render(<HorizontalLinearStepper {...props} />);
    // assert
    expect(getByTestId('horizontalLinear-stepper')).toBeInTheDocument();
  });

  it('Not renders the back button by default', () => {
    // arrange
    const { queryByText } = render(<HorizontalLinearStepper {...props} />);
    // assert
    expect(queryByText('app.back')).toBeNull();
  });
});
