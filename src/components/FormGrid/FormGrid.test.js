import React from 'react';
import { render } from 'tests';
import FormGrid from './FormGrid';

describe('COMPONENTS › FormGrid', () => {
  it('renders without crashing', async () => {
    // arrange
    const { container } = render(<FormGrid container />);
    const div = container.querySelector('div');
    // assert
    expect(div.classList).toContain('MuiGrid-spacing-xs-4');
  });

  it('renders with spacing props', async () => {
    // arrange
    const { container } = render(<FormGrid container spacing={5} />);
    const div = container.querySelector('div');

    // assert
    expect(div.classList).toContain('MuiGrid-spacing-xs-5');
  });

  describe('tablet', () => {
    beforeEach(() => {
      window.resizeTo(640);
    });

    it('renders with 3 spacing', async () => {
      // arrange
      const { container } = render(<FormGrid container />);
      const div = container.querySelector('div');

      // assert
      expect(div.classList).toContain('MuiGrid-spacing-xs-3');
    });
  });

  describe('mobile', () => {
    beforeEach(() => {
      window.resizeTo(320);
    });

    it('renders with 2 spacing', async () => {
      // arrange
      const { container } = render(<FormGrid container />);
      const div = container.querySelector('div');

      // assert
      expect(div.classList).toContain('MuiGrid-spacing-xs-2');
    });
  });
});
