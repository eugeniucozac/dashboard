import React from 'react';
import '@testing-library/jest-dom/extend-expect';

// app
import Logo from './Logo';
import { render } from 'tests';

describe('COMPONENTS › Logo', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<Logo />);
    });

    it("renders nothing if brand isn't defined", () => {
      // arrange
      const { container } = render(<Logo />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders Price Forbes logo if brand is set to "priceforbes"', () => {
      // arrange
      const { getByText } = render(<Logo />, { initialState: { ui: { brand: 'priceforbes' } } });

      // assert
      expect(getByText('logo-edge-priceforbes.svg')).toBeInTheDocument();
    });

    it('renders Bishopsgate logo if brand is set to "bishopsgate"', () => {
      // arrange
      const { getByText } = render(<Logo />, { initialState: { ui: { brand: 'bishopsgate' } } });

      // assert
      expect(getByText('logo-edge-bishopsgate.svg')).toBeInTheDocument();
    });
  });
});
