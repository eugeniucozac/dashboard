import React from 'react';
import ClaimsUnderwritingGroups from './ClaimsUnderwritingGroups';
import { render, screen } from 'tests';
import fetchMock from 'fetch-mock';

const underwritingGroups = {
  items: [
    {
      dateValidFrom: '2013-12-29T00:00:00Z',
      dateValidTo: '2014-12-29T00:00:00Z',
      facility: '9',
      facilityRef: 'E13NQ00010',
      groupRef: 'A ',
      narrative: null,
      percentage: 100,
      slipLeader: "Lloyd's Syndicate 1886",
    },
    {
      dateValidFrom: '2013-12-29T00:00:00Z',
      dateValidTo: '2014-12-29T00:00:00Z',
      facility: '10',
      facilityRef: 'E13NQ00011',
      groupRef: 'B ',
      narrative: null,
      percentage: 100,
      slipLeader: "Lloyd's Syndicate 2003 XLC",
    },
    {
      dateValidFrom: '2013-12-29T00:00:00Z',
      dateValidTo: '2014-12-29T00:00:00Z',
      facility: '11',
      facilityRef: 'E13NQ00014',
      groupRef: 'C ',
      narrative: null,
      percentage: 100,
      slipLeader: "Lloyd's Syndicate 1200",
    },
    {
      dateValidFrom: '2013-12-29T00:00:00Z',
      dateValidTo: '2014-12-29T00:00:00Z',
      facility: '18',
      facilityRef: 'E13NY00010',
      groupRef: 'D ',
      narrative: null,
      percentage: 100,
      slipLeader: "Lloyd's Syndicate 1225",
    },
  ],
  percentageOfSelected: null,
};

beforeEach(() => {
  fetchMock.get(`glob:*api/data/policy/*/underwriting-groups*`, {
    body: {
      data: underwritingGroups.items,
    },
  });
});

afterEach(() => {
  fetchMock.restore();
});

const renderClaimsUnderwritingGroups = () => {
  return render(<ClaimsUnderwritingGroups />);
};

describe('MODULES › ClaimsUnderwritingGroups', () => {
  it('renders without crashing', () => {
    //arrange
    renderClaimsUnderwritingGroups();

    //assert
    expect(screen.getByTestId('claims-under-writing-groups-table')).toBeInTheDocument();
  });

  it('render underwriting groups data', () => {
    //arrange
    renderClaimsUnderwritingGroups();

    //assert
    underwritingGroups.items.forEach(async (item, i) => {
      expect(await screen.findByTestId(`claims-under-writing-groups-row-${item[i].facilityRef}`)).toBeInTheDocument();
    });
  });
});
