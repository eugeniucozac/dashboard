import React from 'react';
import PageHeader from './PageHeader';
import { render } from 'tests';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';

describe('COMPONENTS › PageHeader', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // assert
      render(<PageHeader />);
    });

    it('renders nothing if not passed required props', () => {
      // arrange
      const { container } = render(<PageHeader />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the logo', () => {
      // arrange
      const { container } = render(<PageHeader logo="dummy.gif" />);

      // assert
      expect(container.querySelector('img[src="dummy.gif"]')).toBeInTheDocument();
      expect(container.querySelector('svg')).not.toBeInTheDocument();
    });

    it("renders a placeholder icon if logo props isn't provided", () => {
      // arrange
      const { container } = render(<PageHeader items={[1]} />);

      // assert
      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders items', () => {
      // arrange
      const { getByText } = render(
        <PageHeader
          items={[
            { icon: SportsSoccerIcon, title: 'Paris St-Germain' },
            { icon: SportsSoccerIcon, title: 'Chelsea' },
            { icon: SportsSoccerIcon, title: 'Real Madrid' },
          ]}
        />
      );

      // assert
      expect(getByText('Paris St-Germain')).toBeInTheDocument();
      expect(getByText('Chelsea')).toBeInTheDocument();
      expect(getByText('Real Madrid')).toBeInTheDocument();
    });

    it("doesn't render items without an icon", () => {
      // arrange
      const { queryByText } = render(<PageHeader items={[{ icon: SportsSoccerIcon, title: 'Bayern Munich' }]} />);

      // assert
      expect(queryByText('Germany')).not.toBeInTheDocument();
    });

    it("doesn't render items without a title", () => {
      // arrange
      const { queryByText } = render(<PageHeader items={[{ icon: SportsSoccerIcon, content: 'Italy' }]} />);

      // assert
      expect(queryByText('Italy')).not.toBeInTheDocument();
    });

    it('renders the item icon', () => {
      // arrange
      const { container } = render(<PageHeader items={[{ icon: SportsSoccerIcon, title: 'Paris St-Germain' }]} />);

      // assert
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders the item content', () => {
      // arrange
      const { getByText } = render(
        <PageHeader
          items={[
            { icon: SportsSoccerIcon, title: 'Paris St-Germain', content: 'France' },
            { icon: SportsSoccerIcon, title: 'Chelsea', content: 'England' },
          ]}
        />
      );

      // assert
      expect(getByText('France')).toBeInTheDocument();
      expect(getByText('England')).toBeInTheDocument();
    });
  });
});
