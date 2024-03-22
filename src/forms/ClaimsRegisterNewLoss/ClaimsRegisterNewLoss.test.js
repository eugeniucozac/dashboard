import React from 'react';
import { render } from 'tests';
import ClaimsRegisterNewLoss from './ClaimsRegisterNewLoss';

describe('COMPONENTS › RegisterNewLoss LinearStepper', () => {
    const props = {
        steps: [],
        stepsForms: () => { },
    };
    it('renders nothing if not passed all required props', () => {
        render(<ClaimsRegisterNewLoss {...props} />);
    });

    it('renders the component', () => {
        // arrange
        const { getByTestId } = render(<ClaimsRegisterNewLoss {...props} />);
        // assert
        expect(getByTestId('LinearStepper')).toBeInTheDocument();
    });

    it('Not renders the back button by default', () => {
        // arrange
        const { queryByText } = render(<ClaimsRegisterNewLoss {...props} />);
        // assert
        expect(queryByText('app.back')).toBeNull();
    });
});
