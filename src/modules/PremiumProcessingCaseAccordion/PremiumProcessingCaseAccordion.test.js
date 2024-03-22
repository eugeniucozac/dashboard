import React from 'react';
import { render } from 'tests';
import PremiumProcessingCaseAccordion from './PremiumProcessingCaseAccordion';

const renderCaseAccordion = (props, renderOptions) => {
  render(<PremiumProcessingCaseAccordion />, renderOptions);
};

describe('MODULES › PremiumProcessingCaseAccordion', () => {
  it('renders without crashing', () => {
    expect(renderCaseAccordion({})).toMatchInlineSnapshot(`undefined`);
  });
});
