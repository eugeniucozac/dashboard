import React from 'react';
import { render, screen } from 'tests';
import PremiumProcessingCaseResubmissionDetails from './PremiumProcessingCaseResubmissionDetails';

const renderCaseAccordion = (props, renderOptions) => {
  const componentProps = {
    caseTeamHandler: function () {},
    caseTeamDetails: {
      caseDetails: {},
    },
    ...props,
  };

  render(<PremiumProcessingCaseResubmissionDetails {...componentProps} />, renderOptions);
};

describe('MODULES › PremiumProcessingCaseResubmissionDetailsControl', () => {
  it('renders without crashing', () => {
    expect(renderCaseAccordion({})).toMatchInlineSnapshot(`undefined`);
  });
});
