import React from 'react';

// app
import OpeningMemoInfo from './OpeningMemoInfo';
import { render } from 'tests';

describe('MODULES › OpeningMemoInfo', () => {
  const defaultProps = {
    onChange: jest.fn(),
    formProps: {
      watch: jest.fn(),
    },
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<OpeningMemoInfo {...defaultProps} />);
    });

    it('renders the UMR label', () => {
      // arrange
      const fields = [{ name: 'uniqueMarketReference', label: 'app.umr', value: 'UMR1' }];

      const { getByText } = render(<OpeningMemoInfo {...defaultProps} fields={fields} />);

      // assert
      expect(getByText('app.umr')).toBeInTheDocument();
    });

    it('renders the UMR value', () => {
      // arrange
      const fields = [{ name: 'uniqueMarketReference', label: 'app.umr', value: 'UMR1' }];

      const { getByText } = render(<OpeningMemoInfo {...defaultProps} fields={fields} />);

      // assert
      expect(getByText('UMR1')).toBeInTheDocument();
    });

    it('renders the UMR values separated by comma', () => {
      // arrange
      const fields = [{ name: 'uniqueMarketReference', label: 'app.umr', value: 'UMR1,UMR2,UMR3' }];

      const { queryByText, getByText } = render(<OpeningMemoInfo {...defaultProps} fields={fields} />);

      // assert
      expect(queryByText('UMR1,UMR2,UMR3')).not.toBeInTheDocument();
      expect(getByText('UMR1, UMR2, UMR3')).toBeInTheDocument();
    });
  });
});
