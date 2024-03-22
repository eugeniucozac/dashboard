import React from 'react';
import { render } from 'tests';
import Link from './Link';
import { Add } from '@material-ui/icons';

describe('COMPONENTS › Link', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // assert
      render(<Link />);
    });

    it('renders nothing if not passed text prop', () => {
      // arrange
      const { container } = render(<Link />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the text', () => {
      // arrange
      const { container } = render(<Link text="click here" />);

      // assert
      expect(container).toHaveTextContent('click here');
    });

    it('renders the icon', () => {
      // arrange
      const { getByTestId } = render(<Link text="click here" icon={Add} />);

      // assert
      expect(getByTestId('link-icon')).toBeInTheDocument();
    });

    it('renders the icon to the left by default', () => {
      // arrange
      const { container } = render(<Link text="click here" icon={Add} />);

      // assert
      expect(container.querySelector('a > :first-child').tagName.toLowerCase()).toBe('svg');
      expect(container.querySelector('a > :last-child').tagName.toLowerCase()).toBe('span');
    });

    it('renders the icon to the right if given props', () => {
      // arrange
      const { container } = render(<Link text="click here" icon={Add} iconPosition="right" />);

      // assert
      expect(container.querySelector('a > :first-child').tagName.toLowerCase()).toBe('span');
      expect(container.querySelector('a > :last-child').tagName.toLowerCase()).toBe('svg');
    });
  });
});
