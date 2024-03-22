import React from 'react';
import ClaimsMovementType from './ClaimsMovementType';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';
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
  percentageOfSelected: 200,
};

beforeEach(() => {
  fetchMock.get(`glob:*api/data/policy/*/underwriting-groups*`, {
    body: {
      data: underwritingGroups,
    },
  });
});

afterEach(() => {
  fetchMock.restore();
});

const renderClaimsMovementType = (props) => {
  const componentProps = {
    ...props,
    claimForm: {
      control: jest.fn(),
      errors: {},
      setValue: jest.fn(),
      watch: jest.fn(),
    },
  };

  return render(<ClaimsMovementType {...componentProps} />);
};

describe('MODULES › ClaimsMovementType', () => {
  it('renders without crashing', () => {
    //arrange
    //renderClaimsMovementType();
    //assert
    /*  expect(screen.getByText('claims.typeOfSettlement.title')).toBeInTheDocument();
    expect(screen.getByText('claims.typeOfSettlement.orderBasis')).toBeInTheDocument();
    expect(screen.getByText('claims.typeOfSettlement.advice')).toBeInTheDocument();
    expect(screen.getByText('claims.typeOfSettlement.settlement')).toBeInTheDocument();
    */
  });

  it('after checking Basis of Order Our Share value should be percentageOfSelected value from Redux', () => {
    //arrange
    // const { container } = renderClaimsTypeOfSettlement();
    // const orderPercentage = screen.getByLabelText('claims.typeOfSettlement.orderPercentage');
    // userEvent.click(orderPercentage);
    //assert
    //expect(container.querySelector('input[name="orderPercentage"]'));
  });

  it('after checking Basis of Order 100% value should be 100', async () => {
    //arrange
    //  const { container } = renderClaimsTypeOfSettlement();
    //  const oneHundredPercent = screen.getByLabelText('claims.typeOfSettlement.oneHundredPercent');
    //  userEvent.click(oneHundredPercent);
    //assert
    //expect(container.querySelector('input[name="orderPercentage"]'));
  });
});
