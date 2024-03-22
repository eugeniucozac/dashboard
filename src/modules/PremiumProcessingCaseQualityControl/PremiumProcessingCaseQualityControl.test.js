import React from 'react';
import moment from 'moment';
import { render, screen } from 'tests';
import PremiumProcessingCaseQualityControl from './PremiumProcessingCaseQualityControl';

const renderCaseAccordion = (props, renderOptions) => {
  const componentProps = {
    caseTeamHandler: function () {},
    caseTeamDetails: {
      caseDetails: {},
    },
    ...props,
  };

  render(<PremiumProcessingCaseQualityControl {...componentProps} />, renderOptions);
};

describe('MODULES › PremiumProcessingCaseQualityControl', () => {
  it('renders without crashing', () => {
    expect(renderCaseAccordion({})).toMatchInlineSnapshot(`undefined`);
  });
});
