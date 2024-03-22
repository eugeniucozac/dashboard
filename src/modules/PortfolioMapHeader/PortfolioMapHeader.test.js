import React from 'react';
import { render } from 'tests';
import { PortfolioMapHeader } from './PortfolioMapHeader';

describe('MODULES › PortfolioMapHeader', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<PortfolioMapHeader />);
    });

    it('renders logo', () => {
      // arrange
      const { container } = render(<PortfolioMapHeader logo="mock-image.jpg" />);

      // assert
      expect(container.querySelector('img[src="mock-image.jpg"]')).toBeInTheDocument();
    });

    it('renders title if logo not defined', () => {
      // arrange
      const { getByText } = render(<PortfolioMapHeader title={'foo bar'} />);

      // assert
      expect(getByText('foo bar')).toBeInTheDocument();
    });

    it('renders no title nor logo if not defined', () => {
      // arrange
      const { container, queryByText } = render(<PortfolioMapHeader />);

      // assert
      expect(container.querySelector('img[src="mock-image.jpg"]')).not.toBeInTheDocument();
      expect(queryByText('foo bar')).not.toBeInTheDocument();
    });

    it('renders departments', () => {
      // arrange
      const initialState = {
        portfolioMap: {
          tiv: {
            filteredDepartments: [{ title: 'Dep 1' }],
          },
        },
      };
      const { getByText } = render(<PortfolioMapHeader />, { initialState });

      // assert
      expect(getByText('Departments')).toBeInTheDocument();
      expect(getByText('Dep 1')).toBeInTheDocument();
    });
  });
});
