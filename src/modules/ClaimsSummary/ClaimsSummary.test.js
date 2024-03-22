import React from 'react';
import ClaimsSummary from './ClaimsSummary';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';

const renderClaimsSummary = (props, renderOptions) => {
  const componentProps = {
    searchList: [
      {
        id: 12345,
        name: 'lorem ipsum',
        lossDateFrom: '2020-03-12',
        lossDateTo: '2021-03-12',
        claims: [
          {
            id: 'CL12345',
            insured: 'Saga',
            ucr: '856691',
            policyRef: 'PN235798',
            classOfBusiness: 'Aviation',
            team: 'Adronagh',
            assignedTo: 'Joe Smith',
          },
          {
            id: 'CL12346',
            insured: 'Saga',
            ucr: '155456',
            policyRef: 'PN874798',
            classOfBusiness: 'Aviation',
            team: 'Adronagh',
            assignedTo: 'John Doe',
          },
          {
            id: 'CL12888',
            insured: 'Redux',
            ucr: '458901',
            policyRef: 'PN874711',
            classOfBusiness: 'Cars',
            team: 'BMW',
            assignedTo: 'John Doe',
          },
        ],
      },
      {
        id: 12346,
        name: 'lorem ipsum',
        lossDateFrom: '2020-01-11',
        lossDateTo: '2021-01-11',
        claims: [
          {
            id: 'CL55665',
            insured: 'Intel',
            ucr: '123781',
            policyRef: 'PN414321',
            classOfBusiness: 'Aviation',
            team: 'Microsoft',
            assignedTo: 'Jolie Hand',
          },
        ],
      },
      {
        id: 12347,
        name: 'lorem ipsum',
        lossDateFrom: '2020-11-11',
        lossDateTo: '2021-11-11',
        claims: [
          {
            id: 'CL55415',
            insured: 'Mphasis',
            ucr: '456782',
            policyRef: 'PN147213',
            classOfBusiness: 'Software',
            team: 'Amazon',
            assignedTo: 'Joe Bezos',
          },
          {
            id: 'CL55116',
            insured: 'Mphasis',
            ucr: '456788',
            policyRef: 'PN147219',
            classOfBusiness: 'Sport',
            team: 'Sportsdirect',
            assignedTo: 'Karl Schru',
          },
        ],
      },
      {
        id: 12348,
        name: 'lorem ipsum',
        lossDateFrom: '2021-04-08',
        lossDateTo: '2021-06-08',
        claims: [
          {
            id: 'CL75432',
            insured: 'Samsung',
            ucr: '123456',
            policyRef: 'PN990011',
            classOfBusiness: 'Software',
            team: 'Boeing',
            assignedTo: 'Elon Musk',
          },
        ],
      },
      {
        id: 12349,
        name: 'lorem ipsum',
        lossDateFrom: '2021-01-08',
        lossDateTo: '2021-06-08',
        claims: [
          {
            id: 'CL90901',
            insured: 'Tesla',
            ucr: '456784',
            policyRef: 'PN784356',
            classOfBusiness: 'Space',
            team: 'Space X',
            assignedTo: 'Elon Musk',
          },
          {
            id: 'CL77612',
            insured: 'Mercedes',
            ucr: '456799',
            policyRef: 'PN544856',
            classOfBusiness: 'Cars',
            team: 'Mini',
            assignedTo: 'Gerhard Ze',
          },
        ],
      },
      {
        id: 12351,
        name: 'lorem ipsum',
        lossDateFrom: '2021-02-22',
        lossDateTo: '2022-02-22',
        claims: [
          {
            id: 'CL67891',
            insured: 'Apple',
            ucr: '126785',
            policyRef: 'PN671321',
            classOfBusiness: 'Hardware',
            team: 'Intel',
            assignedTo: 'D J Trump',
          },
          {
            id: 'CL89483',
            insured: 'Samsung',
            ucr: '434356',
            policyRef: 'PN551321',
            classOfBusiness: 'Hardware',
            team: 'Payments',
            assignedTo: 'Jy Hin Min',
          },
        ],
      },
    ],
    ...props,
  };

  render(<ClaimsSummary {...componentProps} />, renderOptions);

  return {
    componentProps,
  };
};

describe('MODULES › ClaimsSummary', () => {
  it('renders without crashing', () => {
    //arrange
    //assert
  });

  it('render Loss Information on click', () => {
    //arrange
    //assert
  });

  it('render Claim Information on click', () => {
    //arrange
    //assert
  });

  it('render Attachments on click', () => {
    //arrange
    //assert
  });
});
