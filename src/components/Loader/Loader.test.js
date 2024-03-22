import React from 'react';
import { render } from 'tests';
import Loader from './Loader';
import defaults from '../../theme/theme-defaults';

describe('COMPONENTS › Loader', () => {
  describe('@render', () => {
    it('renders the loader visible by default', () => {
      const { getByTestId } = render(<Loader />);
      expect(getByTestId('loader')).toBeVisible();
      expect(getByTestId('loader')).toHaveStyle({ opacity: 1 });
    });

    it('renders the loader hidden if visible props is false', () => {
      const { getByTestId } = render(<Loader visible={false} />);
      expect(getByTestId('loader')).not.toBeVisible();
      expect(getByTestId('loader')).toHaveStyle({ opacity: 0 });
    });

    it('renders the loading indicator', () => {
      const { getByRole } = render(<Loader />);
      expect(getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders the text label', () => {
      const { getByRole, getByText } = render(<Loader label="foo.bar" />);
      expect(getByRole('progressbar')).toBeInTheDocument();
      expect(getByText('foo.bar')).toBeInTheDocument();
    });

    it('renders the appropriate styles by default', () => {
      const { getByTestId } = render(<Loader />);
      expect(getByTestId('loader')).toHaveStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: defaults.zIndex.loader,
      });
    });

    it('renders the appropriate styles for absolute positioned loader', () => {
      const { getByTestId } = render(<Loader absolute />);
      expect(getByTestId('loader')).toHaveStyle({
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
      });
    });

    it('renders the appropriate styles for side panel loader', () => {
      const { getByTestId } = render(<Loader panel />);
      expect(getByTestId('loader')).toHaveStyle({ position: 'fixed' });
    });

    it('renders the appropriate styles for inline loader', () => {
      const { getByTestId } = render(<Loader inline />);
      expect(getByTestId('loader')).toHaveStyle({
        background: 'none',
        alignItems: 'flex-start',
      });
    });
  });
});
