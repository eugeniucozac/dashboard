import React from 'react';

//app
import { ClaimsSummaryView } from './ClaimsSummary.view';

export default function ClaimsSummary({ selectedClaimId, selectedLossId }) {
  const searchList = [
    {
      id: 12345,
      name: 'lorem ipsum',
      lossDate: '2020-03-12',
      claims: [
        {
          id: 'CL12345',
          type: 'Auto Populated',
          insured: 'Saga',
          inceptionDate: '2020-02-21',
          expiryDate: '2020-05-11',
          ucr: '856691',
          policyRef: 'PN235798',
          classOfBusiness: 'Aviation',
          team: 'Adronagh',
          status: 'Open',
          assignedTo: 'Joe Smith',
        },
        {
          id: 'CL12346',
          type: 'Auto Populated',
          insured: 'Saga',
          inceptionDate: '2020-01-21',
          expiryDate: '2021-11-12',
          ucr: '155456',
          policyRef: 'PN874798',
          classOfBusiness: 'Aviation',
          team: 'Adronagh',
          status: 'Open',
          assignedTo: 'John Doe',
        },
        {
          id: 'CL12888',
          type: 'Auto Populated',
          insured: 'Redux',
          inceptionDate: '2020-07-15',
          expiryDate: '2020-09-11',
          ucr: '458901',
          policyRef: 'PN874711',
          classOfBusiness: 'Cars',
          team: 'BMW',
          status: 'Open',
          assignedTo: 'John Doe',
        },
      ],
    },
    {
      id: 12346,
      name: 'lorem ipsum',
      lossDate: '2020-01-11',
      claims: [
        {
          id: 'CL55665',
          type: 'Auto Populated',
          insured: 'Intel',
          inceptionDate: '2019-04-01',
          expiryDate: '2019-09-08',
          ucr: '123781',
          policyRef: 'PN414321',
          classOfBusiness: 'Aviation',
          team: 'Microsoft',
          status: 'Open',
          assignedTo: 'Jolie Hand',
        },
      ],
    },
    {
      id: 12347,
      name: 'lorem ipsum',
      lossDate: '2021-01-01',
      claims: [
        {
          id: 'CL55415',
          type: 'Auto Populated',
          insured: 'Mphasis',
          inceptionDate: '2021-01-17',
          expiryDate: '2021-11-19',
          ucr: '456782',
          policyRef: 'PN147213',
          classOfBusiness: 'Software',
          team: 'Amazon',
          status: 'Open',
          assignedTo: 'Joe Bezos',
        },
        {
          id: 'CL55116',
          type: 'Auto Populated',
          insured: 'Mphasis',
          inceptionDate: '2019-01-18',
          expiryDate: '2020-11-21',
          ucr: '456788',
          policyRef: 'PN147219',
          classOfBusiness: 'Sport',
          team: 'Sportsdirect',
          status: 'Open',
          assignedTo: 'Karl Zen',
        },
      ],
    },
    {
      id: 12348,
      name: 'lorem ipsum',
      lossDate: '2021-04-08',
      claims: [
        {
          id: 'CL75432',
          type: 'Auto Populated',
          insured: 'Samsung',
          inceptionDate: '2020-06-12',
          expiryDate: '2021-09-11',
          ucr: '123456',
          policyRef: 'PN990011',
          classOfBusiness: 'Software',
          team: 'Boeing',
          status: 'Open',
          assignedTo: 'Elon Musk',
        },
      ],
    },
    {
      id: 12349,
      name: 'lorem ipsum',
      lossDate: '2021-01-18',
      claims: [
        {
          id: 'CL90901',
          type: 'Auto Populated',
          insured: 'Tesla',
          inceptionDate: '2019-09-29',
          expiryDate: '2020-12-11',
          ucr: '456784',
          policyRef: 'PN784356',
          classOfBusiness: 'Space',
          team: 'Space X',
          status: 'Open',
          assignedTo: 'Elon Musk',
        },
        {
          id: 'CL77612',
          type: 'Auto Populated',
          insured: 'Mercedes',
          inceptionDate: '2017-11-21',
          expiryDate: '2020-09-31',
          ucr: '456799',
          policyRef: 'PN544856',
          classOfBusiness: 'Cars',
          team: 'Mini',
          status: 'Open',
          assignedTo: 'Gerhard Schred',
        },
      ],
    },
    {
      id: 12351,
      name: 'lorem ipsum',
      lossDate: '2021-02-22',
      claims: [
        {
          id: 'CL67891',
          type: 'Auto Populated',
          insured: 'Apple',
          inceptionDate: '2018-01-12',
          expiryDate: '2020-11-21',
          ucr: '126785',
          policyRef: 'PN671321',
          classOfBusiness: 'Hardware',
          team: 'Intel',
          status: 'Open',
          assignedTo: 'D J Trump',
        },
        {
          id: 'CL89483',
          type: 'Auto Populated',
          insured: 'Samsung',
          inceptionDate: '2020-09-12',
          expiryDate: '2021-11-19',
          ucr: '434356',
          policyRef: 'PN551321',
          classOfBusiness: 'Hardware',
          team: 'Payments',
          status: 'Open',
          assignedTo: 'Jy Hin Min',
        },
      ],
    },
  ];

  const lossDetails = searchList.find((loss) => loss.id === selectedLossId);
  const claimDetails = lossDetails.claims.filter((claim) => claim.id === selectedClaimId);

  const attachmentsDetails = [
    {
      id: 12345,
      type: 'PDF',
    },
    {
      id: 12346,
      type: 'OUTLOOK',
    },
  ];

  return <ClaimsSummaryView lossDetails={lossDetails} attachmentsDetails={attachmentsDetails} claimDetails={claimDetails} />;
}
