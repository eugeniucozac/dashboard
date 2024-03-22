import { render, screen, within, waitFor } from 'tests';
import RiskMap from './RiskMap';
import userEvent from '@testing-library/user-event';

const generateLocation = (id) => ({
  id,

  buildingTitle: `Building ${id}`,
  city: 'New York',
  constructionType: 'FRAME',
  county: 'New York County',
  distanceToCoast: 0.63,
  distanceToCoastInitialValue: 0.63,
  formattedAddress: '4 Charles St #3004, New York, NY 10014, USA',
  inOuterBanksNc: false,
  lat: 40.7351675 + id * 0.001,
  latitude: 40.7351675 + id * 0.001,
  lng: -74.0006537 + id * 0.001,
  locationsFound: 1,
  longitude: -74.0006537 + id * 0.001,
  roofType: 'TILE',
  state: 'New York',
  streetAddress: '4 Charles Street',
  totalInsurableValue: 500000 + id * 0.002,
});

const title = 'buildings';
const locations = [
  ...Array(2)
    .fill(0)
    .map((_, i) => generateLocation(i + 1)),
];

const locationsDefinitions = {
  arrayItemDef: [
    {
      name: 'buildingTitle',
      type: 'HIDDEN',
      group: 'BUILDINGS',
    },
    {
      name: 'streetAddress',
      type: 'TEXT',
      group: 'BUILDINGS',
      label: 'Street Address',
      header: 'Address',
    },
    {
      name: 'city',
      type: 'TEXT',
      group: 'BUILDINGS',
      label: 'City',
    },
    {
      name: 'county',
      type: 'TEXT',
      group: 'BUILDINGS',
      label: 'County',
    },
    {
      name: 'state',
      type: 'TEXT',
      group: 'BUILDINGS',
      label: 'State',
    },
    {
      name: 'latitude',
      type: 'HIDDEN',
      group: 'BUILDINGS',
      label: 'Latitude',
    },
    {
      name: 'longitude',
      type: 'HIDDEN',
      group: 'BUILDINGS',
      label: 'Latitude',
    },
    {
      name: 'formattedAddress',
      type: 'HIDDEN',
      group: 'BUILDINGS',
      label: 'Formatted Address',
    },
    {
      name: 'distanceToCoast',
      type: 'DOUBLE',
      group: 'BUILDINGS',
      label: 'Distance to the coast (miles)',
    },
    {
      name: 'inOuterBanksNc',
      type: 'BOOLEAN',
      group: 'BUILDINGS',
      label: 'In Outer Banks, North Carolina?',
    },
    {
      name: 'totalInsurableValue',
      type: 'DOUBLE',
      group: 'BUILDINGS',
      label: 'Total Insurable Value ($)',
      header: 'Details',
    },

    {
      name: 'constructionType',
      type: 'SELECT',
      indicative: false,
      group: 'BUILDINGS',
      label: 'Construction Type',
    },
    {
      name: 'roofType',
      type: 'SELECT',
      group: 'BUILDINGS',
      label: 'Roof Type',
    },
  ],
  type: 'ARRAY',
};

describe('MODULES › RiskMap', () => {
  it('should render RiskMap', async () => {
    render(<RiskMap title={title} locations={locations} locationDefinitions={locationsDefinitions} />);

    expect(screen.getByTestId('risk-map')).toBeInTheDocument();

    waitFor(() => {
      expect(
        screen.getByRole('region', {
          name: /map/i,
        })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Building 1')).toBeInTheDocument();
    expect(screen.getByText('Building 2')).toBeInTheDocument();

    expect(screen.getAllByTestId('location-row')).toHaveLength(2);

    const row = screen.getAllByTestId('location-row')[0];

    userEvent.click(within(row).getByRole('button'));
    const locationTooltipCardView = screen.getByTestId('location-tooltip-card');

    expect(locationTooltipCardView).toBeInTheDocument();
    userEvent.click(within(locationTooltipCardView).getByRole('button'));
    waitFor(() => {
      expect(screen.queryByTestId('location-tooltip-card')).not.toBeInTheDocument();
    });
  });

  // it should render RiskMap with 20 locations
  it('should render RiskMap with 20 locations,  test pagination', async () => {
    const manyLocations = [
      ...Array(15)
        .fill(0)
        .map((_, i) => generateLocation(i + 1)),
    ];

    render(<RiskMap title={title} locations={manyLocations} locationDefinitions={locationsDefinitions} />);

    expect(screen.getAllByTestId('location-row')).toHaveLength(10);

    userEvent.click(
      screen.getByRole('button', {
        name: /pagination.nextPage/i,
      })
    );
    expect(screen.getAllByTestId('location-row')).toHaveLength(5);
  });
});
