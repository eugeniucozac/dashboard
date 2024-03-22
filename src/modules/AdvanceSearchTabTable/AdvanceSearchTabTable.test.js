import React from 'react';
import { render, screen } from 'tests';
import AdvanceSearchTabTable from './AdvanceSearchTabTable';

const renderClaimsTab = () => {
  return render(<AdvanceSearchTabTable />);
};

describe('MODULES › AdvanceSearchTabTable', () => {
  it('renders without crashing', () => {
    renderClaimsTab();
    // assert
    expect(screen.getByTestId('Advance-search-table-grid')).toBeInTheDocument();
  });
  it('renders table without crashing', () => {
    renderClaimsTab();
    // assert
    expect(screen.getByTestId('Advance-search-table')).toBeInTheDocument();
  });
});
