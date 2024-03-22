import React from 'react';
import { render, screen } from 'tests';
import PremiumProcessingCaseRejectDetails from './PremiumProcessingCaseRejectDetails';

const renderCaseAccordion = (props, renderOptions) => {
  const componentProps = {
    caseTeamHandler: function () {},
    caseTeamDetails: {
      caseDetails: {},
    },
    ...props,
  };

  render(<PremiumProcessingCaseRejectDetails {...componentProps} />, renderOptions);
};

describe('MODULES › PremiumProcessingRejectDetailsControl', () => {
  it('renders without crashing', () => {
    expect(renderCaseAccordion({})).toMatchInlineSnapshot(`undefined`);
  });
});
