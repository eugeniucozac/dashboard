import React from 'react';
import LinkClaimPolicy from './LinkClaimPolicy';

import { render } from 'tests';

const props = {
  policyInformation: {
    policyRef: 'E13NY15400',
    insured: 'Lakewood Villa Condo',
    inceptionDate: '29/12/2013',
    expiryDate: '29/12/2014',
    company: 'XB_London',
    division: 'Equinox',
    policyType: 'Facultative',
    client: 'CRC Insurance Services Inc',
    originalCurrency: 'USD',
    policyNote: 'Buildings and as Wdg',
  },
};

const renderLinkClaimPolicy = () => {
  return render(<LinkClaimPolicy />, { ...props, isDataReady: true });
};

describe('COMPONENTS › LINKCLAIMPOLICY', () => {
  const originalWarn = console.warn;
  afterEach(() => (console.warn = originalWarn));

  const mockedWarn = () => {};
  beforeEach(() => (console.warn = mockedWarn));

  it('renders without crashing', () => {
    // arrange
    const { container } = renderLinkClaimPolicy();
    // assert
    expect(container).toBeInTheDocument();
  });
});
