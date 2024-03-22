import React from 'react';
import Footer from './Footer';
import { render } from 'tests';
import MockDate from 'mockdate';

describe('COMPONENTS › Footer', () => {
  it('renders without crashing', () => {
    // arrange
    const { getByTestId } = render(<Footer />);

    // assert
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the copyright text', () => {
    // arrange
    MockDate.set('2019');
    const { getByText } = render(<Footer />);

    // assert
    expect(getByText('app.copyright 2019')).toBeInTheDocument();
    MockDate.reset();
  });

  it('renders the version text in dev mode', () => {
    // arrange
    const { getByText } = render(<Footer />);

    // assert
    expect(getByText(/app.version [0-9]{8}\.[0-9]+/)).toBeInTheDocument();
  });
});
