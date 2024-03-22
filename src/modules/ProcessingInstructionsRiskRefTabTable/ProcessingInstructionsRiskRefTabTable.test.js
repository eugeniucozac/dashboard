import React from 'react';
import { render } from 'tests';

import ProcessingInstructionsRiskRefTabTable from './ProcessingInstructionsRiskRefTabTable';

describe('MODULES › ProcessingInstructionsChecklist', () => {
  const instruction = {
    riskReferences: [],
  };
  it('renders the table', () => {
    // given
    const { getByTestId } = render(<ProcessingInstructionsRiskRefTabTable instruction={instruction} />);

    // assert
    expect(getByTestId('riskRefs-grid')).toBeInTheDocument();
  });

  it('renders the table column headers', () => {
    // given
    const { getByText } = render(<ProcessingInstructionsRiskRefTabTable instruction={instruction} />);

    // then
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.riskRef')).toBeInTheDocument();
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.insured')).toBeInTheDocument();
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.yoa')).toBeInTheDocument();
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.gxbInstance')).toBeInTheDocument();
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.client')).toBeInTheDocument();
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.riskStatus')).toBeInTheDocument();
    expect(getByText('processingInstructions.checklist.tabs.riskRefs.table.riskDetails')).toBeInTheDocument();
  });
});
