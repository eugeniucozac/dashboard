import React from 'react';
import { render } from 'tests';
import PremiumProcessingCaseTeamList from './PremiumProcessingCaseTeamList';

describe('MODULES › PremiumProcessingCaseTeamList', () => {
  it("doesn't render if display=false", () => {
    const props = {
      caseTeamData: {},
      caseInstructionId: 1,
    };
    const { container } = render(<PremiumProcessingCaseTeamList {...props} />);
    expect(container).toBeDefined();
  });
});
