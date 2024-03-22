import React from 'react';
import { render } from 'tests';
import { ClientCharts } from './ClientCharts';
import { mockClasses, mockTheme } from 'setupMocks';
import MockDate from 'mockdate';

// mui
import ApartmentIcon from '@material-ui/icons/Apartment';

describe('MODULES › ClientCharts', () => {
  const defaultProps = {
    classes: mockClasses,
    theme: mockTheme,
    parent: {
      selected: {},
      list: [],
      placements: [],
      offices: [],
    },
    user: {},
    referenceDataCurrencies: [],
    referenceDataDepartments: [],
    resetPortfolioMap: jest.fn(),
  };

  beforeEach(() => {
    MockDate.set('2020');
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      const props = {
        ...defaultProps,
        pageTitle: 'Client title',
        type: 'client',
        pageIcon: ApartmentIcon,
      };
      render(<ClientCharts {...props} />);
    });

    it('renders for Client', () => {
      // arrange
      const props = {
        ...defaultProps,
        pageTitle: 'Client title',
        type: 'client',
        pageIcon: ApartmentIcon,
      };
      const { getByText } = render(<ClientCharts {...props} />);

      // assert
      expect(getByText('Client title')).toBeInTheDocument();
      expect(getByText('portfolio.title')).toBeInTheDocument();
      expect(getByText('app.client')).toBeInTheDocument();
      expect(getByText('app.year')).toBeInTheDocument();
      expect(getByText('2020')).toBeInTheDocument();
      expect(getByText('app.users')).toBeInTheDocument();
    });

    it('renders for Market', () => {
      // arrange
      const props = {
        ...defaultProps,
        pageTitle: 'Market title',
        type: 'market',
        pageIcon: ApartmentIcon,
      };
      const { getByText } = render(<ClientCharts {...props} />);

      // assert
      expect(getByText('Market title')).toBeInTheDocument();
      expect(getByText('portfolio.title')).toBeInTheDocument();
      expect(getByText('app.market')).toBeInTheDocument();
      expect(getByText('app.year')).toBeInTheDocument();
      expect(getByText('2020')).toBeInTheDocument();
      expect(getByText('app.users')).toBeInTheDocument();
    });
  });
});
