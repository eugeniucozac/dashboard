import React from 'react';
import { PremiumProcessingCases } from './PremiumProcessingCases';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';

const renderPremiumProcessingCases = (props, renderOptions) => {
  const componentProps = {
    casesList: [
      {
        accExcutive: 'Oliver Wood',
        caseId: '23578',
        departmentId: 23,
        department: 'Equinox',
        divisionId: 13,
        insured: 'Rolls Royce',
        policyId: 71940,
        policyRef: '1269',
        policyRef: '0N3157500001',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-12-14T18:30:00.000+00:00',
        taskId: '45677',
        uniqueMarketRef: 'B05070N3157500001',
      },
      {
        accExcutive: 'Oliver Wood2',
        caseId: '23579',
        departmentId: 24,
        department: 'Equinox2',
        divisionId: 14,
        insured: 'Rolls Royce2',
        policyId: 71941,
        policyRef: '1270',
        policyRef: '0N3157500002',
        priority: 'High',
        processId: '12346',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-12-14T18:30:00.000+00:00',
        taskId: '45677',
        uniqueMarketRef: 'B05070N3157500002',
      },
    ],
    selectedCase: [
      {
        accExcutive: 'Oliver Wood',
        caseId: '23578',
        departmentId: 23,
        department: 'Equinox',
        divisionId: 13,
        insured: 'Rolls Royce',
        policyId: 71940,
        policyRef: '1269',
        policyRef: '0N3157500001',
        priority: 'High',
        processId: '12345',
        processName: 'Closing',
        stage: 'Not Assigned',
        startDate: '2020-12-14T18:30:00.000+00:00',
        taskId: '45677',
        uniqueMarketRef: 'B05070N3157500001',
      },
    ],
    ...props,
  };

  render(<PremiumProcessingCases {...componentProps} />, renderOptions);

  const casesToggle = screen.getByTestId('select-cases');

  return {
    componentProps,
    casesToggle,
  };
};

describe('MODULES › PremiumProcessingCases', () => {
  it('renders without crashing', () => {});
});
