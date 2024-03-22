import React from 'react';
import Auth from './Auth';
import { render } from 'tests';

describe('COMPONENTS › Auth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<Auth />);
    });

    it('renders children content', () => {
      // arrange
      const { getByText } = render(<Auth>123</Auth>);

      // assert
      expect(getByText('123')).toBeInTheDocument();
    });
  });
});
